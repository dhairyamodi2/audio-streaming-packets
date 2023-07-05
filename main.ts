import express from "express";
import path from "path";
import fs from 'fs'
const app = express();


app.listen(3000, () => {
    console.log('server running')
})

app.get('/stream-audio', (req, res) => {
    const range = req.headers.range;
    console.log(range);
    if (!range) {
        res.status(422).json('Range Header required');
        return
    }
    const filePath = path.resolve(__dirname, "../assets/sample.mp3");
    const videoSize = fs.statSync(filePath).size;
    console.log(filePath);
    console.log(videoSize);

    const chunkSize = 5**5;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "audio/mp3"
    }

    res.writeHead(206, headers);
    const stream = fs.createReadStream(filePath, {start, end});
    stream.pipe(res)
})
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
})