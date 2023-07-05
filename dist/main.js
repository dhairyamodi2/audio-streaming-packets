"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.listen(3000, () => {
    console.log('server running');
});
app.get('/stream-audio', (req, res) => {
    const range = req.headers.range;
    console.log(range);
    if (!range) {
        res.status(422).json('Range Header required');
        return;
    }
    const filePath = path_1.default.resolve(__dirname, "../assets/sample.mp3");
    const videoSize = fs_1.default.statSync(filePath).size;
    console.log(filePath);
    console.log(videoSize);
    const chunkSize = 5 ** 5;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mp3"
    };
    res.writeHead(206, headers);
    const stream = fs_1.default.createReadStream(filePath, { start, end });
    stream.pipe(res);
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../client/index.html'));
});
