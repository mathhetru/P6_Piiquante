const http = require("http");
const express = require("express");
const bodyparser = require("body-parser");
const jsonwebtoken = require("jsonwebtoken");

const host = 'localhost';
const port = 3000;
const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("My first server!");
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

