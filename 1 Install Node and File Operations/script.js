const http = require('http');

const server = http.createServer((req, res) => {
    res.end("Hello World");
})

server.listen(3000, () => {
    console.log(`Server start at port no 3000`);
});