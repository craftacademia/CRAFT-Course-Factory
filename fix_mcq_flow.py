path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/browser/browserRuntime.js'

with open(path) as f:
    content = f.read()

# ── 1. In renderCurrentPage, split MCQ from regular branching ──────────────
old_render = """        await this.renderBranchingOptions(page);"""

new_render = """        // MCQ uses a dedicated 3-step flow (question → options → feedback).
        // All other branching styles (instant, hotspot) use the standard path.
        const hasMCQ =
            (this.currentPlayer?.branchingQueue ?? [])
            .some(c => c.properties?.style === "mcq");

        if (hasMCQ) {
            await this.renderMCQFlow(page);
        } else {
            await this.renderBranchingOptions(page);
        }"""

count = content.count(old_render)
assert count == 1, f'renderBranchingOptions call anchor not unique — count: {count}'
content = content.replace(old_render, new_render)


# ── 2. Insert renderMCQFlow method just before renderBranchingOptions ──────
old_insert = """    async renderBranchingOptions(page) {"""

new_insert = """    async renderMCQFlow(page) {

        const branchingQueue =
            this.currentPlayer?.branchingQueue ?? [];

        if (branchingQueue.length === 0) {
            return;
        }

        const component = branchingQueue[0];
        const options   = component.properties?.options ?? [];
        const feedback  = component.properties?.feedback ?? {};
        const slot      = this.rootElement.querySelector("#branching-slot");

        if (!slot) {
            return;
        }

        // ── Step 1: question text on screen (VO already played via
        // playDialogueSequence — nothing to do here, just a visual moment
        // before the options appear). dialogueComplete is already true.
        // The slot is currently empty; leave it that way for a beat so the
        // learner sees the question panel before the options panel replaces it.

        // ── Step 2: show question recap + options, play option VOs, unlock ──
        const questionText =
            this.currentPlayer?.dialogueQueue?.[0]
            ?.properties?.text ?? "";

        // Build the options HTML
        const radios = options.map((option, index) => `
<label class="mcq-option">
    <input
        type="radio"
        name="mcq-${component.id}"
        data-branching-id="${component.id}"
        data-option-index="${index}">
    <span>
        <span class="branch-option-label">Option ${index + 1}</span>
        ${option.text ?? ""}
    </span>
</label>`).join("");

        slot.innerHTML = `
<div class="branch-options branch-options--mcq branch-options--locked" data-component-id="${component.id}">
    <p class="mcq-question-recap" style="font-size:18px;font-weight:600;color:#222;margin-bottom:18px;padding:0 4px;">${questionText}</p>
    ${radios}
    <button class="mcq-submit-btn" data-branching-submit="${component.id}" disabled>Submit</button>
</div>`;

        // Play each option's VO in sequence before unlocking
        this.branchingChoicePending = true;

        for (const option of options) {

            if (!this.branchingChoicePending) {
                break;
            }

            const audioAsset = this.findDialogueAudio(option.voiceId);

            if (!audioAsset) {
                continue;
            }

            await new Promise(resolve => {

                const audio = new Audio(`./${audioAsset.src}`);

                this.currentAudio        = audio;
                this.currentAudioResolve = resolve;

                audio.onended = resolve;
                audio.onerror = resolve;
                audio.onpause = resolve;

                audio.play().catch(resolve);

            });

        }

        // Clear stale resolver before binding clicks
        this.currentAudioResolve = null;
        this.currentAudio        = null;

        // Unlock options
        const wrapper = slot.querySelector(`[data-component-id="${component.id}"]`);
        if (wrapper) {
            wrapper.classList.remove("branch-options--locked");
        }

        // Wire up radio → enable Submit
        const submitBtn = slot.querySelector(`[data-branching-submit="${component.id}"]`);
        const radiosEl  = slot.querySelectorAll(`[data-branching-id="${component.id}"]`);

        for (const radio of radiosEl) {
            radio.addEventListener("change", () => {
                if (submitBtn) submitBtn.disabled = false;
            });
        }

        // ── Step 3: wait for Submit, then show feedback + play its VO ────────
        await new Promise(resolve => {

            if (!submitBtn) {
                resolve();
                return;
            }

            submitBtn.addEventListener("click", async () => {

                const checked = slot.querySelector(
                    `[data-branching-id="${component.id}"]:checked`
                );

                if (!checked) {
                    return;
                }

                const index  = Number(checked.dataset.optionIndex);
                const option = options[index];

                // Record choice so gating logic (updateChrome) can see it
                this.state.variables.set(
                    `branching.${component.id}`,
                    { selected: index, option }
                );

                // Determine correct vs incorrect
                const maxScore = Math.max(...options.map(o => Number(o.score) || 0));
                const isCorrect = (Number(option.score) || 0) >= maxScore;
                const feedbackLine = isCorrect ? feedback.correct : feedback.incorrect;

                // Show feedback panel
                slot.innerHTML = feedbackLine
                    ? `<div class="dialogue-box" style="position:relative;bottom:auto;left:auto;right:auto;width:100%;box-sizing:border-box;margin-top:20px;">
                           <div class="dialogue-speaker">NAR</div>
                           <div class="dialogue-text">${feedbackLine.text ?? ""}</div>
                       </div>`
                    : "";

                // Play feedback VO
                if (feedbackLine?.voiceId) {

                    const feedbackAudio = this.findDialogueAudio(feedbackLine.voiceId);

                    if (feedbackAudio) {

                        await new Promise(r => {

                            const audio = new Audio(`./${feedbackAudio.src}`);

                            this.currentAudio        = audio;
                            this.currentAudioResolve = r;

                            audio.onended = r;
                            audio.onerror = r;
                            audio.onpause = r;

                            audio.play().catch(r);

                        });

                    }

                }

                this.currentAudioResolve = null;
                this.currentAudio        = null;

                // Signal that interaction is complete so Next activates
                if (typeof this.onStateChange === "function") {
                    this.onStateChange();
                }

                resolve();

            }, { once: true });

        });

    }



    async renderBranchingOptions(page) {"""

count = content.count(old_insert)
assert count == 1, f'renderBranchingOptions definition anchor not unique — count: {count}'
content = content.replace(old_insert, new_insert)


with open(path, 'w') as f:
    f.write(content)

print('Done')
