'use strict';

const http = require('http');
const fs = require('fs');
const DB = require('simple-connection');

const config = fs.readFileSync('./config/db.json', 'utf-8');

http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-Width');
    res.setHeader('Access-Control-Allow-Max-Age', '86400');

    if ((req.method === 'OPTIONS')) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
    }

    if ((req.url === '/api/users/') && (req.method === 'POST')) {

        req.on('data', (vl) => {
            let email = JSON.parse(vl);

            if (!email && !email.email) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.write('don\'t found a email.');
                res.end();
                return;
            }

            let db = DB(JSON.parse(config));

            let collection = db.collection('preUser');

            collection.insert(email).then((suc) => {

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write('ok');
                res.end();

            }).catch((err) => {
                console.log(err);

                res.writeHead(503, {'Content-Type': 'text/plain'});
                res.write('Can\'t save email');
                res.end();
            });

        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('fail');
        res.end();
    }

}).listen(1337, '127.0.0.1');

console.log('Server is read');
console.log('Config is read = ', (config) ? true : false);
