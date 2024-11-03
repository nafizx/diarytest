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
    const teacher = req.query.teacher || "Nabila Tabassum"; // Default teacher's name

    const width = 2480;
    const height = 3508;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("bg2.png");
    ctx.drawImage(bg, 0, 0, width, height);

    ctx.font = "61px Arial";
    ctx.fillStyle = "#000000";

    ctx.fillText(cls, 428, 736);
    ctx.fillText(subject, 478, 867);
    ctx.fillText(teacher, 710, 994); // Teacher's name from query parameter
    ctx.fillText(cw, 244, 1220);
    ctx.fillText(hw, 244, 1628);
    ctx.fillText(remark, 244, 1860);
    ctx.textAlign = "center";

    // Set date text: either from query or default to current date
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

    // Crop canvas to 3/5 of height
    const cropHeight = (height / 5) * 3;
    const croppedCanvas = createCanvas(width, cropHeight);
    const croppedCtx = croppedCanvas.getContext("2d");

    croppedCtx.drawImage(canvas, 0, 0, width, cropHeight, 0, 0, width, cropHeight);

    // Create image buffer from the cropped canvas
    const imgBuffer = croppedCanvas.toBuffer("image/png");

    // Save the cropped image to a file
    fs.writeFileSync("test.png", imgBuffer);

    // Send the cropped image as a response
    res.sendFile(path.join(__dirname, "test.png"));
});

app.listen(3000, () => console.log('API is listening on port 3000!'));
