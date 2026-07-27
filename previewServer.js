import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/runtime", express.static(path.join(__dirname, "src/runtime")));

app.get("/", (req, res) => {
    res.redirect("/runtime/index.html");
});

app.listen(5173, () => {
    console.log("Preview Server running at http://localhost:5173");
});