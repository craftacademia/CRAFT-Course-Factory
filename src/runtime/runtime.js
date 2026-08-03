import BrowserRuntime from "./browser/browserRuntime.js";


console.log(
    "CRAFT Runtime Loaded"
);


const app =
    document.getElementById(
        "app"
    );


const runtime =
    new BrowserRuntime(
        app
    );


fetch(
    "./data/course.json"
)
.then(
    response =>
    response.json()
)
.then(
    course =>
    runtime.mount(course)
)
.catch(
    error =>
    console.error(error)
);