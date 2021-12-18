"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var autocannon_1 = __importDefault(require("autocannon"));
var stream_1 = __importDefault(require("stream"));
var run = function (url) {
    var buffer = [];
    var outputStream = new stream_1.default.PassThrough();
    var instance = (0, autocannon_1.default)({
        url: url,
        connections: 100,
        duration: 20,
    });
    autocannon_1.default.track(instance, {
        outputStream: outputStream,
    });
    outputStream.on('data', function (data) {
        buffer.push(data);
    });
    instance.on('done', function () { return process.stdout.write(Buffer.concat(buffer)); });
};
console.log('Running all benchmarks in parallel...');
run('http://localhost:8080/info');
