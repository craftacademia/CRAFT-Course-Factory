/**
 * MCQRenderer — 3-step MCQ flow as a self-contained API.
 *
 * Step 1 (handled by browserRuntime before bind() is called):
 *   Scene image shown, question VO plays. Auto-advances when VO ends.
 *
 * Step 2 (bind() phase 1):
 *   White panel. Question recap at top. Option VOs play in sequence.
 *   Options unlock. Learner picks one, clicks Submit.
 *
 * Step 3 (bind() phase 2):
 *   Feedback text shown. Feedback VO plays. Next activates when done.
 */
export default class MCQRenderer {

    render(component, context) {
        // No static render — panel built dynamically in bind().
    }

    async bind(slot, component, runtime) {

        const options  = component.properties?.options  ?? [];
        const feedback = component.properties?.feedback ?? {};

        const questionText =
            runtime.currentPlayer
            ?.dialogueQueue?.[0]
            ?.properties?.text ?? "";

        // ── Step 2: build options panel ───────────────────────────────────────

        const radiosHTML = options.map((option, index) => `
<label class="mcq-option mcq-option--locked" style="pointer-events:none;opacity:0.6;">
    <input
        type="radio"
        name="mcq-${component.id}"
        data-mcq-id="${component.id}"
        data-mcq-index="${index}"
        disabled>
    <span>
        <span class="branch-option-label">Option ${index + 1}</span>
        ${option.text ?? ""}
    </span>
</label>`).join("");

        slot.innerHTML = `
<div style="position:absolute;left:5%;right:5%;top:8%;bottom:8%;overflow-y:auto;display:flex;flex-direction:column;gap:14px;background:#ffffff;border-radius:20px;padding:24px 28px;">
    <p style="font-size:18px;font-weight:600;color:#444;margin:0 0 12px 0;line-height:1.5;">${questionText}</p>
    ${radiosHTML}
    <button class="mcq-submit-btn" id="mcq-submit-${component.id}" disabled style="align-self:center;margin-top:8px;">Submit</button>
</div>`;

        // ── Play option VOs before unlocking ──────────────────────────────────

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

        // ── Unlock options ────────────────────────────────────────────────────

        slot.querySelectorAll("label.mcq-option--locked").forEach(el => {
            el.classList.remove("mcq-option--locked");
            el.style.pointerEvents = "";
            el.style.opacity = "";
        });

        slot.querySelectorAll(`[data-mcq-id="${component.id}"]`).forEach(el => {
            el.disabled = false;
        });

        // ── Wire radio → enable Submit ────────────────────────────────────────

        const submitBtn = slot.querySelector(`#mcq-submit-${component.id}`);

        slot.querySelectorAll(`[data-mcq-id="${component.id}"]`).forEach(radio => {
            radio.addEventListener("change", () => {
                if (submitBtn) submitBtn.disabled = false;
            });
        });

        // ── Wait for Submit ───────────────────────────────────────────────────

        const selectedOption = await new Promise(resolve => {

            if (!submitBtn) { resolve(null); return; }

            submitBtn.addEventListener("click", () => {

                const checked = slot.querySelector(`[data-mcq-id="${component.id}"]:checked`);
                if (!checked) return;

                submitBtn.disabled = true;

                const index  = Number(checked.dataset.mcqIndex);
                const option = options[index];

                if (runtime.state?.variables?.set) {
                    runtime.state.variables.set(
                        `branching.${component.id}`,
                        { selected: index, option }
                    );
                }

                resolve(option);

            }, { once: true });

        });

        if (!selectedOption) return;

        // ── Step 3: feedback screen ───────────────────────────────────────────

        const maxScore     = Math.max(...options.map(o => Number(o.score) || 0));
        const isCorrect    = (Number(selectedOption.score) || 0) >= maxScore;
        const feedbackLine = isCorrect ? feedback.correct : feedback.incorrect;

        slot.innerHTML = feedbackLine
            ? `<div class="dialogue-box" style="position:relative;bottom:auto;left:auto;right:auto;width:90%;margin:30px auto 0 auto;box-sizing:border-box;">
                   <div class="dialogue-speaker">${feedbackLine.speaker ?? "NAR"}</div>
                   <div class="dialogue-text">${feedbackLine.text ?? ""}</div>
               </div>`
            : "";

        // ── Play feedback VO ──────────────────────────────────────────────────

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

        // Signal completion so updateChrome enables Next.
        if (typeof runtime.onStateChange === "function") {
            runtime.onStateChange();
        }

    }

}
