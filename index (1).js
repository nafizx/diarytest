const { createCanvas, registerFont, loadImage, Image } = require("canvas");
const express =  require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.get("/test", async(req, res) => {
    let cls = req.query.class;
    const subject = req.query.subject;
    const teacher = req.query.teacher;
    const cw = req.query.cw;
    const hw = req.query.hw;
    const remark = req.query.remarks;
    
    const width = 2480;
    const height = 3508;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    let bg = await loadImage("bg2.png");
    ctx.drawImage(bg, 0, 0, width, height);
    
    ctx.font = "61px Arial";
    ctx.fillStyle = "#000000";
    
    ctx.fillText(cls, 448, 736);
    ctx.fillText(subject, 498, 867);
    ctx.fillText(teacher, 691, 994);
    ctx.fillText(cw, 264, 1220);
    ctx.fillText(hw, 264, 1628);
    ctx.fillText(remark, 264, 1860);
    ctx.textAlign = "center";

    // Get the current date and day name
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const date = `${day}-${month}-${year}`;
    const dayName = currentDate.toLocaleString('en-US', { weekday: 'long' });

    // Update the date text with the current date and day name
    ctx.fillText(`Date: ${date} (${dayName})`, 1793, 736);
    
    // Now apply cropping to the canvas
    const cropHeight = (height / 5) * 3; // Cropping to 3/5 of the height
    const croppedCanvas = createCanvas(width, cropHeight);
    const croppedCtx = croppedCanvas.getContext('2d');

    // Draw the cropped portion of the original canvas onto the cropped canvas
    croppedCtx.drawImage(canvas, 0, 0, width, cropHeight, 0, 0, width, cropHeight);

    // Create the image buffer from the cropped canvas
    const imgBuffer = croppedCanvas.toBuffer("image/png");

    // Save the cropped image to a file
    fs.writeFileSync("test.png", imgBuffer);

    // Send the cropped image as a response
    res.sendFile(path.join(__dirname, "test.png"));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
