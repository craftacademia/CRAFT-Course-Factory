/**
 * HotspotRenderer — 4-step Hotspot flow as a self-contained API.
 *
 * Step 1 (handled by browserRuntime before bind() is called):
 *   Location image shown, narration VO plays. Auto-advances when done.
 *
 * Step 2 — bind() phase 1: document grid
 *   4 document images shown as clickable cards.
 *   Clicking each reveals its title and description text.
 *   All items must be clicked before options appear.
 *
 * Step 3 — bind() phase 2: options
 *   White panel. Question text at top.
 *   Option VOs play in sequence. Options unlock. Submit.
 *
 * Step 4 — bind() phase 3: feedback
 *   White background. Feedback text centered. Feedback VO plays.
 *   Next activates when VO ends.
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

        // Set stage to white for steps 2-4
        const stage = runtime.rootElement?.closest?.('#craft-stage') ??
                      document.querySelector('#craft-stage');
        if (stage) stage.style.background = '#ffffff';

        // Hide scene image
        const sceneImage = document.querySelector('#craft-stage .image-component');
        if (sceneImage) sceneImage.style.display = 'none';


        // ── Step 2: document grid ─────────────────────────────────────────────

        const clicked = new Set();

        const cardsHTML = items.map((item, i) => `
<div class="hotspot-card" data-index="${i}" style="
    flex:1; min-width:130px; max-width:200px; cursor:pointer;
    border:3px solid #d71920; border-radius:16px; background:#fff;
    overflow:hidden; display:flex; flex-direction:column; align-items:center;
    transition:box-shadow 0.2s;">
    ${item.image ? `<img src="./${item.image.src}" style="width:100%;height:120px;object-fit:cover;pointer-events:none;">` : `<div style="width:100%;height:120px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:28px;">📄</div>`}
    <div style="padding:10px;text-align:center;">
        <div style="font-size:13px;font-weight:700;color:#d71920;">${item.title}</div>
        <div style="font-size:11px;color:#777;margin-top:2px;">${item.subtitle}</div>
    </div>
</div>`).join('');

        slot.innerHTML = `
<div style="position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;padding:20px;gap:14px;overflow-y:auto;">
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;" id="hs-grid">
        ${cardsHTML}
    </div>
    <div id="hs-detail" style="min-height:60px;background:#fdeceb;border:2px solid #d71920;border-radius:12px;padding:14px 18px;display:none;">
        <div id="hs-detail-title" style="font-size:15px;font-weight:700;color:#d71920;margin-bottom:6px;"></div>
        <div id="hs-detail-text"  style="font-size:16px;color:#222;line-height:1.5;"></div>
    </div>
    <div id="hs-progress" style="font-size:13px;color:#777;text-align:center;">
        Click each document to examine it (0 of ${items.length} viewed)
    </div>
</div>`;

        await new Promise(resolve => {

            const grid     = slot.querySelector('#hs-grid');
            const detail   = slot.querySelector('#hs-detail');
            const detTitle = slot.querySelector('#hs-detail-title');
            const detText  = slot.querySelector('#hs-detail-text');
            const progress = slot.querySelector('#hs-progress');

            grid.querySelectorAll('.hotspot-card').forEach(card => {
                card.addEventListener('click', () => {

                    const idx  = Number(card.dataset.index);
                    const item = items[idx];
                    clicked.add(idx);

                    grid.querySelectorAll('.hotspot-card').forEach(c => {
                        c.style.boxShadow = '';
                    });
                    card.style.boxShadow = '0 0 0 4px #d71920';

                    detTitle.textContent = item.title;
                    detText.textContent  = item.text;
                    detail.style.display = 'block';

                    progress.textContent = clicked.size >= items.length
                        ? 'All documents examined — scroll down to answer'
                        : `Click each document to examine it (${clicked.size} of ${items.length} viewed)`;

                    if (clicked.size >= items.length) resolve();

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
        data-hs-opt-id="${branching.id}"
        data-hs-opt-index="${index}"
        disabled>
    <span>
        <span class="branch-option-label">Option ${index + 1}</span>
        ${option.text ?? ""}
    </span>
</label>`).join('');

        slot.innerHTML = `
<div style="position:absolute;left:5%;right:5%;top:8%;bottom:8%;overflow-y:auto;display:flex;flex-direction:column;gap:14px;background:#fff;border-radius:20px;padding:24px 28px;">
    <p style="font-size:18px;font-weight:600;color:#444;margin:0 0 12px 0;line-height:1.5;">${questionText}</p>
    ${radiosHTML}
    <button class="mcq-submit-btn" id="hs-submit-${branching.id}" disabled style="align-self:center;margin-top:8px;">Submit</button>
</div>`;

        // Play option VOs before unlocking
        runtime.branchingChoicePending = true;

        for (const option of options) {

            if (!runtime.branchingChoicePending) break;

            const audioAsset =
                typeof runtime.findDialogueAudio === 'function'
                ? runtime.findDialogueAudio(option.voiceId)
                : null;

            if (!audioAsset) continue;

            await new Promise(resolve => {
                const audio = runtime.createAudio(`./${audioAsset.src}`);
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
        slot.querySelectorAll(`[data-hs-opt-id="${branching.id}"]`).forEach(el => {
            el.disabled = false;
        });

        const submitBtn = slot.querySelector(`#hs-submit-${branching.id}`);

        slot.querySelectorAll(`[data-hs-opt-id="${branching.id}"]`).forEach(radio => {
            radio.addEventListener('change', () => {
                if (submitBtn) submitBtn.disabled = false;
            });
        });

        // Wait for Submit
        const selectedOption = await new Promise(resolve => {

            if (!submitBtn) { resolve(null); return; }

            submitBtn.addEventListener('click', () => {

                const checked = slot.querySelector(`[data-hs-opt-id="${branching.id}"]:checked`);
                if (!checked) return;

                submitBtn.disabled = true;

                const index  = Number(checked.dataset.hsOptIndex);
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


        // ── Step 4: feedback screen ───────────────────────────────────────────

        const maxScore     = Math.max(...options.map(o => Number(o.score) || 0));
        const isCorrect    = (Number(selectedOption.score) || 0) >= maxScore;
        const feedbackLine = isCorrect ? feedback.correct : feedback.incorrect;

        slot.innerHTML = feedbackLine
            ? `<div style="position:absolute;inset:0;background:#ffffff;display:flex;align-items:center;justify-content:center;padding:40px;">
                   <div class="dialogue-box" style="position:relative;bottom:auto;left:auto;right:auto;width:90%;max-width:800px;box-sizing:border-box;">
                       <div class="dialogue-speaker">${feedbackLine.speaker ?? "NAR"}</div>
                       <div class="dialogue-text">${feedbackLine.text ?? ""}</div>
                   </div>
               </div>`
            : '';

        if (feedbackLine?.voiceId) {

            const feedbackAudio =
                typeof runtime.findDialogueAudio === 'function'
                ? runtime.findDialogueAudio(feedbackLine.voiceId)
                : null;

            if (feedbackAudio) {

                await new Promise(resolve => {
                    const audio = runtime.createAudio(`./${feedbackAudio.src}`);
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

        if (typeof runtime.onStateChange === 'function') {
            runtime.onStateChange();
        }

    }

}
