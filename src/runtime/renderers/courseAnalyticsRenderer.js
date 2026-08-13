/**
 * CourseAnalyticsRenderer
 *
 * Reads SCORE_CHECKPOINT components from all pages to get module names
 * and max scores. Re-computes each module's score using the same
 * baseline-delta approach as scoreCheckpointRenderer. Renders the
 * full analytics panel matching the design image.
 */
export default class CourseAnalyticsRenderer {

    render(component, context) {
        // Rendered dynamically in bind()
    }

    async bind(slot, component, runtime) {

        const bands   = component.properties?.bands   ?? [];
        const passScore = Number(component.properties?.passScore ?? 70);

        // ── Collect module checkpoints from all pages ──────────────────────────

        const modules = [];

        for (const page of runtime.course?.pages ?? []) {
            for (const layer of page.layers ?? []) {
                for (const comp of layer.components ?? []) {
                    if (comp.type === 'SCORE_CHECKPOINT') {
                        modules.push({
                            id:         comp.id,
                            name:       comp.properties?.moduleName ?? '',
                            max:        Number(comp.properties?.max ?? 0),
                            checkpointId: comp.properties?.checkpointId ?? comp.id
                        });
                    }
                }
            }
        }

        // ── Re-compute per-module scores using same baseline-delta logic ────────

        let baseline = 0;
        const moduleScores = [];

        for (const mod of modules) {

            const currentTotal =
                typeof runtime.computeTotalScore === 'function'
                ? runtime.computeTotalScore()
                : 0;

            // Use the stored baseline from state if available
            const storedBaseline =
                runtime.state?.variables?.get?.(`scoreBaseline_${mod.id}`) ?? null;

            const score = storedBaseline !== null
                ? storedBaseline
                : runtime.state?.variables?.get?.(`scoreCheckpoint_${mod.checkpointId}`) ?? 0;

            moduleScores.push({
                ...mod,
                score: score
            });

        }

        // Fallback: use computeTotalScore breakdown if no per-module data
        // Re-compute using the running total approach
        let runningBaseline = 0;
        const computed = [];

        // Walk pages in order, track branching scores per checkpoint
        const branchingScores = {};
        const dragDropScores  = {};

        if (runtime.state?.variables) {
            for (const [key, val] of Object.entries(runtime.state.variables.all?.() ?? {})) {
                if (key.startsWith('branching.')) {
                    const score = Number(val?.option?.score) || 0;
                    branchingScores[key] = score;
                }
                if (key.startsWith('dragDrop.')) {
                    const score = Number(val?.score) || 0;
                    dragDropScores[key] = score;
                }
            }
        }

        // Map each checkpoint to the score earned before it in the course
        // by summing all branching/dragDrop scores from pages up to that page
        const pageOrder = (runtime.course?.pages ?? []).map(p => p.id);
        const componentToPage = {};

        for (const page of runtime.course?.pages ?? []) {
            for (const layer of page.layers ?? []) {
                for (const comp of layer.components ?? []) {
                    componentToPage[comp.id] = page.id;
                }
            }
        }

        // For each checkpoint, sum scores earned on pages BEFORE it
        const checkpointModules = modules.map(mod => {
            const checkpointPageIdx = pageOrder.indexOf(componentToPage[mod.id] ?? '');

            let moduleScore = 0;
            let prevCheckpointPageIdx = 0;

            // Find the previous checkpoint's page index
            const modIdx = modules.indexOf(mod);
            if (modIdx > 0) {
                const prevMod = modules[modIdx - 1];
                prevCheckpointPageIdx = pageOrder.indexOf(componentToPage[prevMod.id] ?? '') + 1;
            }

            // Sum branching and dragDrop scores from pages between previous and current checkpoint
            for (const page of runtime.course?.pages ?? []) {
                const pageIdx = pageOrder.indexOf(page.id);
                if (pageIdx < prevCheckpointPageIdx || pageIdx >= checkpointPageIdx) continue;

                for (const layer of page.layers ?? []) {
                    for (const comp of layer.components ?? []) {
                        const bScore = branchingScores[`branching.${comp.id}`];
                        const dScore = dragDropScores[`dragDrop.${comp.id}`];
                        if (bScore !== undefined) moduleScore += bScore;
                        if (dScore !== undefined) moduleScore += dScore;
                    }
                }
            }

            return { ...mod, score: moduleScore };
        });

        const totalScore = checkpointModules.reduce((s, m) => s + m.score, 0);
        const totalMax   = checkpointModules.reduce((s, m) => s + m.max,   0);
        const pct        = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
        const passed     = pct >= passScore;

        // ── Remark per module ─────────────────────────────────────────────────

        function getRemark(score, max, modName) {
            const modPct = max > 0 ? Math.round((score / max) * 100) : 0;
            for (const band of [...bands].sort((a,b) => b.min - a.min)) {
                if (modPct >= band.min && modPct <= band.max) {
                    return band.remark.replace('{module}', modName);
                }
            }
            return modPct === 100 ? 'Good to Go' : modPct >= 50 ? 'Refer Documentation' : `Refer the complete ${modName}`;
        }

        function moduleIcon(score, max) {
            const p = max > 0 ? (score / max) * 100 : 0;
            if (p === 100) return { bg: '#e8f5e9', color: '#2e9e4f', emoji: '✅' };
            if (p >= 50)   return { bg: '#fff8e1', color: '#f59e0b', emoji: '📖' };
            return              { bg: '#e3f0ff', color: '#1e3a8a', emoji: '📄' };
        }

        function remarkIcon(score, max) {
            const p = max > 0 ? (score / max) * 100 : 0;
            if (p === 100) return { bg: '#e8f5e9', color: '#2e9e4f', emoji: '👍' };
            if (p >= 50)   return { bg: '#fff8e1', color: '#f59e0b', emoji: '📋' };
            return              { bg: '#e3f0ff', color: '#1e3a8a', emoji: '📚' };
        }

        // ── Render ────────────────────────────────────────────────────────────

        const rowsHTML = checkpointModules.map((mod, i) => {
            const mi = moduleIcon(mod.score, mod.max);
            const ri = remarkIcon(mod.score, mod.max);
            const remark = getRemark(mod.score, mod.max, mod.name);
            return `
<tr style="border-bottom:1px solid #e0e0e0;">
    <td style="padding:14px 16px;display:flex;align-items:center;gap:14px;">
        <div style="width:40px;height:40px;border-radius:10px;background:${mi.bg};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${mi.emoji}</div>
        <span style="font-size:16px;font-weight:600;color:#222;">Module ${i+1} — ${mod.name}</span>
    </td>
    <td style="padding:14px 16px;text-align:center;font-size:20px;font-weight:700;color:#1e3a8a;">${mod.score} / ${mod.max}</td>
    <td style="padding:14px 16px;">
        <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;border-radius:50%;background:${ri.bg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${ri.emoji}</div>
            <span style="font-size:15px;font-weight:600;color:#1e3a8a;">${remark}</span>
        </div>
    </td>
</tr>`;
        }).join('');

        const passedColor  = passed ? '#2e9e4f' : '#d71920';
        const passedBg     = passed ? '#e8f5e9' : '#fdeceb';
        const passedLabel  = passed ? '✅ PASSED' : '❌ FAILED';
        const passedMsg    = passed
            ? 'Congratulations! You have successfully completed the course.'
            : 'You did not reach the passing score. Please review the modules.';

        slot.innerHTML = `
<div style="position:absolute;inset:0;background:#f0f4f8;overflow-y:auto;font-family:Arial,sans-serif;padding:24px;">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#1e3a8a;display:flex;align-items:center;justify-content:center;font-size:28px;">📊</div>
        <div>
            <div style="font-size:26px;font-weight:800;color:#1e3a8a;">COURSE ANALYTICS</div>
            <div style="font-size:14px;color:#777;margin-top:2px;">Your Learning Summary</div>
        </div>
    </div>

    <!-- Module table -->
    <div style="background:#fff;border-radius:16px;overflow:hidden;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="background:#1e3a8a;">
                    <th style="padding:14px 16px;text-align:left;color:#fff;font-size:13px;letter-spacing:0.5px;width:50%;">MODULE</th>
                    <th style="padding:14px 16px;text-align:center;color:#fff;font-size:13px;letter-spacing:0.5px;width:20%;">SCORE</th>
                    <th style="padding:14px 16px;text-align:left;color:#fff;font-size:13px;letter-spacing:0.5px;width:30%;">STATUS / REMARKS</th>
                </tr>
            </thead>
            <tbody>${rowsHTML}</tbody>
        </table>
    </div>

    <!-- Total score panel -->
    <div style="background:#fff;border-radius:16px;padding:24px 32px;display:flex;align-items:center;gap:0;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="flex:1;display:flex;justify-content:center;">
            <div style="font-size:64px;">${passed ? '🏆' : ''}</div>
        </div>
        <div style="flex:1;text-align:center;border-left:1px solid #eee;border-right:1px solid #eee;padding:0 24px;">
            <div style="font-size:14px;font-weight:700;color:#1e3a8a;letter-spacing:0.5px;margin-bottom:8px;">TOTAL COURSE SCORE</div>
            <div style="font-size:48px;font-weight:800;color:#1e3a8a;">${totalScore}<span style="font-size:24px;color:#777;">/${totalMax}</span></div>
            <div style="margin-top:12px;background:${passedColor};color:#fff;border-radius:30px;padding:10px 28px;font-size:18px;font-weight:700;display:inline-block;">${passedLabel}</div>
        </div>
        <div style="flex:1;text-align:center;padding:0 24px;">
            <div style="font-size:36px;margin-bottom:8px;">${passed ? '🛡️' : '📋'}</div>
            <div style="font-size:14px;font-weight:700;color:#222;line-height:1.5;">${passedMsg}</div>
            <div style="font-size:12px;color:#777;margin-top:6px;">Refer individual Module remarks<br>for targeted revision and improvement.</div>
        </div>
    </div>

    <!-- Buttons -->
    <div style="display:flex;gap:16px;justify-content:center;margin-top:20px;">
        <button onclick="window.location.reload()" style="padding:12px 32px;border-radius:30px;border:2px solid #1e3a8a;background:#fff;color:#1e3a8a;font-size:15px;font-weight:700;cursor:pointer;">↺ REVIEW MODULES</button>
        <button style="padding:12px 32px;border-radius:30px;border:none;background:#1e3a8a;color:#fff;font-size:15px;font-weight:700;cursor:pointer;">🏠 EXIT COURSE</button>
    </div>

</div>`;

        // Signal completion — no Next button needed on analytics screen
        if (typeof runtime.onStateChange === 'function') {
            runtime.onStateChange();
        }

    }

}
