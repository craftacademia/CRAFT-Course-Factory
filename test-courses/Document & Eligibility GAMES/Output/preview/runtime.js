
import BrowserRuntime from "./browser/browserRuntime.js";

document.addEventListener("DOMContentLoaded", async () => {

    const app = document.getElementById("app");

    const runtime = new BrowserRuntime(app);

    await runtime.mount(window.PIR);

});
