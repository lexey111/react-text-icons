const path = require('path');
const http = require('http');
const fs = require('fs');
const exists = require('fs').exists;

module.exports = function serve(publicFolder, host, port) {
    http.createServer((request, response) => {
        const baseURL = 'http://' + request.headers.host + '/';
        const reqUrl = new URL(request.url, baseURL);
        const uri = reqUrl.pathname;

        let filename = path.join(publicFolder, uri);

        const contentTypesByExtension = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript'
        };

        exists(filename, function (fileExists) {
            if (!fileExists) {
                console.log(`[404] ${filename}`);

                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not Found\n");
                response.end();
                return;
            }

            if (fs.statSync(filename).isDirectory()) {
                filename += 'index.html';
            }

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    console.log(`[500] ${filename}`);

                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }
                console.log(`[200] ${filename}`);

                const headers = {};
                const contentType = contentTypesByExtension[path.extname(filename)];
                if (contentType) {
                    headers["Content-Type"] = contentType;
                }
                response.writeHead(200, headers);
                response.write(file, "binary");
                response.end();
            });
        });
    }).listen(port, host, () => {
        console.log(`# Server is running on http://${host}:${port}\n`);
    });
}
