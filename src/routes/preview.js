import express from "express";
import path from "path";
import { buildPlayer } from "../buildPlayer.js";

const router = express.Router();

router.get("/", (req, res) => {

    const currentCourseData = req.app.locals.currentCourseData;

    if (!currentCourseData) {
        return res
            .status(400)
            .send("No course data available. Please parse a script first.");
    }

    const outputDir = path.join(process.cwd(), "preview");

    buildPlayer(currentCourseData, outputDir);

    return res.sendFile(path.join(outputDir, "index.html"));

});

router.post("/render", (req, res) => {

    try {

        const courseData =
            req.body.courseData ??
            req.app.locals.currentCourseData;

        if (!courseData) {
            return res.status(400).json({
                error: "No course JSON provided."
            });
        }

        const outputDir = path.join(process.cwd(), "preview");

        buildPlayer(courseData, outputDir);

        return res.json({
            success: true,
            preview: "/preview"
        });

    } catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

});

export default router;