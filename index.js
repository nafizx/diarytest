const { createCanvas, loadImage } = require("canvas");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.get("/test", async (req, res) => {
    const cls = req.query.class;
    const subject = req.query.subject;
    const cw = req.query.cw;
    const hw = req.query.hw;
    const remark = req.query.remarks;
    const teacher = req.query.teacher || "Nabila Tabassum";

    const width = 2480;
    const height = 3508;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("bg2.png");
    ctx.drawImage(bg, 0, 0, width, height);

    ctx.font = "63px Arial";
    ctx.fillStyle = "#000000";

    ctx.fillText(cls, 375, 739);
    ctx.fillText(subject, 425, 870);
    ctx.fillText(teacher, 695, 997);
    ctx.fillText(cw, 181, 1220);
    ctx.fillText(hw, 181, 1628);
    ctx.fillText(remark, 181, 1860);
    ctx.textAlign = "center";

    let dateText;
    if (req.query.date) {
        dateText = `Date: ${req.query.date}`;
    } else {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const dayName = currentDate.toLocaleString('en-US', { weekday: 'long' });
        dateText = `Date: ${day}.${month}.${year} (${dayName})`;
    }

    ctx.fillText(dateText, 1793, 736);

    const cropHeight = (height / 5) * 3;
    const croppedCanvas = createCanvas(width, cropHeight);
    const croppedCtx = croppedCanvas.getContext("2d");

    croppedCtx.drawImage(canvas, 0, 0, width, cropHeight, 0, 0, width, cropHeight);

    const imgBuffer = croppedCanvas.toBuffer("image/png");
    fs.writeFileSync("test.png", imgBuffer);

    res.sendFile(path.join(__dirname, "test.png"));
});

app.listen(3000, () => console.log('API is listening on port 3000!'));
