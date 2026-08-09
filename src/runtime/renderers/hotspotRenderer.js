/**
 * HotspotRenderer
 *
 * Flow:
 * Step 1 — (handled by browserRuntime before bind() is called)
 *   Question VO plays. Auto-advances when done.
 *
 * Step 2 — bind() phase 1: document grid
 *   4 document images shown as clickable cards.
 *   Clicking each reveals title, subtitle, and description text.
 *   All items must be clicked before options appear.
 *
 * Step 3 — bind() phase 2: options
 *   White panel. Question recap at top.
 *   Option VOs play in sequence. Options unlock. Submit.
 *
 * Step 4 — bind() phase 3: feedback
 *   Feedback text shown. Feedback VO plays. Next activates.
 */
export default class HotspotRenderer {

    render(component, context) {
        // No static render — built dynamically in bind().
    }

    async bind(slot, component, runtime) {

        const items    = component.properties?.items    ?? [];
        const branching = component.properties?.branching ?? null;
        const options  = branching?.options  ?? [];
        const feedback = branching?.feedback ?? {};

        const questionText =
            runtime.currentPlayer
            ?.dialogueQueue?.[0]
            ?.properties?.text ?? "";


        // ── Step 2: document grid ─────────────────────────────────────────────

        const clickedSet = new Set();

        const cardsHTML = items.map((item, index) => `
<div class="hotspot-card" data-hotspot-index="${index}" style="
    flex:1; min-width:140px; max-width:220px;
    border:3px solid #d71920; border-radius:16px;
    background:#fff; cursor:pointer; overflow:hidden;
    display:flex; flex-direction:column; align-items:center;
    transition:box-shadow 0.2s;">
    ${item.image ? `<img src="./${item.image.src}" style="width:100%;height:130px;object-fit:cover;">` : `<div style="width:100%;height:130px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:32px;">📄</div>`}
    <div style="padding:10px;text-align:center;">
        <div style="font-size:14px;font-weight:700;color:#d71920;">${item.title}</div>
        <div style="font-size:12px;color:#777;margin-top:2px;">${item.subtitle}</div>
    </div>
</div>`).join("");

        slot.innerHTML = `
<div style="position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;padding:20px;gap:16px;overflow-y:auto;">
    <div id="hotspot-grid" style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;">
        ${cardsHTML}
    </div>
    <div id="hotspot-detail" style="min-height:60px;background:#fdeceb;border:2px solid #d71920;border-radius:12px;padding:14px 18px;display:none;">
        <div id="hotspot-detail-title" style="font-size:16px;font-weight:700;color:#d71920;margin-bottom:6px;"></div>
        <div id="hotspot-detail-text" style="font-size:16px;color:#222;line-height:1.5;"></div>
    </div>
    <div id="hotspot-progress" style="font-size:13px;color:#777;text-align:center;">
        Click each document to examine it (0 of ${items.length} viewed)
    </div>
</div>`;

        // Wait for all items to be clicked
        await new Promise(resolve => {

            const grid    = slot.querySelector('#hotspot-grid');
            const detail  = slot.querySelector('#hotspot-detail');
            const detailTitle = slot.querySelector('#hotspot-detail-title');
            const detailText  = slot.querySelector('#hotspot-detail-text');
            const progress    = slot.querySelector('#hotspot-progress');

            grid.querySelectorAll('.hotspot-card').forEach(card => {

                card.addEventListener('click', () => {

                    const index = Number(card.dataset.hotspotIndex);
                    const item  = items[index];

                    clickedSet.add(index);

                    // Highlight clicked card
                    grid.querySelectorAll('.hotspot-card').forEach(c => {
                        c.style.boxShadow = '';
                        c.style.borderColor = '#d71920';
                    });
                    card.style.boxShadow = '0 0 0 4px #d71920';

                    // Show detail
                    detailTitle.textContent = item.title;
                    detailText.textContent  = item.text;
                    detail.style.display    = 'block';

                    const count = clickedSet.size;
                    progress.textContent =
                        count >= items.length
                        ? 'All documents examined — scroll down to answer'
                        : `Click each document to examine it (${count} of ${items.length} viewed)`;

                    if (clickedSet.size >= items.length) {
                        resolve();
                    }

                });

            });

        });


        // ── Step 3: options panel ─────────────────────────────────────────────

        if (!branching || options.length === 0) return;

        const radiosHTML = options.map((option, index) => `
<label class="mcq-option mcq-option--locked" style="pointer-events:none;opacity:0.6;">
    <input
        type="radio"
        name="hotspot-${branching.id}"
        data-hotspot-opt-id="${branching.id}"
        data-hotspot-opt-index="${index}"
        disabled>
    <span>
        <span class="branch-option-label">Option ${index + 1}</span>
        ${option.text ?? ""}
    </span>
</label>`).join("");

        slot.innerHTML = `
<div style="position:absolute;left:5%;right:5%;top:8%;bottom:8%;overflow-y:auto;display:flex;flex-direction:column;gap:14px;background:#fff;border-radius:20px;padding:24px 28px;">
    <p style="font-size:18px;font-weight:600;color:#444;margin:0 0 12px 0;line-height:1.5;">${questionText}</p>
    ${radiosHTML}
    <button class="mcq-submit-btn" id="hotspot-submit-${branching.id}" disabled style="align-self:center;margin-top:8px;">Submit</button>
</div>`;

        // Play option VOs before unlocking
        runtime.branchingChoicePending = true;

        for (const option of options) {

            if (!runtime.branchingChoicePending) break;

            const audioAsset =
                typeof runtime.findDialogueAudio === "function"
                ? runtime.findDialogueAudio(option.voiceId)
                : null;

            if (!audioAsset) continue;

            await new Promise(resolve => {
                const audio = new Audio(`./${audioAsset.src}`);
                runtime.currentAudio        = audio;
                runtime.currentAudioResolve = resolve;
                audio.onended = resolve;
                audio.onerror = resolve;
                audio.onpause = resolve;
                audio.play().catch(resolve);
            });

        }

        runtime.currentAudioResolve = null;
        runtime.currentAudio        = null;

        // Unlock options
        slot.querySelectorAll('.mcq-option--locked').forEach(el => {
            el.classList.remove('mcq-option--locked');
            el.style.pointerEvents = '';
            el.style.opacity = '';
        });
        slot.querySelectorAll(`[data-hotspot-opt-id="${branching.id}"]`).forEach(el => {
            el.disabled = false;
        });

        const submitBtn = slot.querySelector(`#hotspot-submit-${branching.id}`);

        slot.querySelectorAll(`[data-hotspot-opt-id="${branching.id}"]`).forEach(radio => {
            radio.addEventListener('change', () => {
                if (submitBtn) submitBtn.disabled = false;
            });
        });

        // Wait for Submit
        const selectedOption = await new Promise(resolve => {

            if (!submitBtn) { resolve(null); return; }

            submitBtn.addEventListener('click', () => {

                const checked = slot.querySelector(`[data-hotspot-opt-id="${branching.id}"]:checked`);
                if (!checked) return;

                submitBtn.disabled = true;

                const index  = Number(checked.dataset.hotspotOptIndex);
                const option = options[index];

                if (runtime.state?.variables?.set) {
                    runtime.state.variables.set(
                        `branching.${branching.id}`,
                        { selected: index, option }
                    );
                }

                resolve(option);

            }, { once: true });

        });

        if (!selectedOption) return;


        // ── Step 4: feedback ──────────────────────────────────────────────────

        const maxScore     = Math.max(...options.map(o => Number(o.score) || 0));
        const isCorrect    = (Number(selectedOption.score) || 0) >= maxScore;
        const feedbackLine = isCorrect ? feedback.correct : feedback.incorrect;

        slot.innerHTML = feedbackLine
            ? `<div class="dialogue-box" style="position:relative;bottom:auto;left:auto;right:auto;width:90%;margin:30px auto 0 auto;box-sizing:border-box;">
                   <div class="dialogue-speaker">${feedbackLine.speaker ?? "NAR"}</div>
                   <div class="dialogue-text">${feedbackLine.text ?? ""}</div>
               </div>`
            : "";

        if (feedbackLine?.voiceId) {

            const feedbackAudio =
                typeof runtime.findDialogueAudio === "function"
                ? runtime.findDialogueAudio(feedbackLine.voiceId)
                : null;

            if (feedbackAudio) {

                await new Promise(resolve => {
                    const audio = new Audio(`./${feedbackAudio.src}`);
                    runtime.currentAudio        = audio;
                    runtime.currentAudioResolve = resolve;
                    audio.onended = resolve;
                    audio.onerror = resolve;
                    audio.onpause = resolve;
                    audio.play().catch(resolve);
                });

            }

        }

        runtime.currentAudioResolve = null;
        runtime.currentAudio        = null;

        if (typeof runtime.onStateChange === "function") {
            runtime.onStateChange();
        }

    }

}
