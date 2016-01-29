'use strict';

const http = require('http');
const fs = require('fs');
const DB = require('simple-connection');

const config = fs.readFileSync('./config/db.json', 'utf-8');

http.createServer((req, res) => {

    if ((req.url === '/api/users/') && (req.method === 'POST')) {

        req.on('data', (vl) => {
            let email = JSON.parse(vl);

            let db = DB(JSON.parse(config));

            let collection = db.collection('preUser');

            collection.insert(email).then((suc) => {

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write('ok');
                res.end();
            }).catch((err) => {
                res.writeHead(503, {'Content-Type': 'text/plain'});
                res.write('ok');
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
