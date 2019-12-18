const http = require('http');
const app = require('./app'); // tạo app express

const port = process.env.PORT || 4000; // tạo port
const server = http.createServer(app); // tạo server

//RUN SERVER
server.listen(port, () => {
    console.log('server start run at port:' + port);
});