const path = require('path');
const http = require('http');
const url = require('url');
const fs = require('fs');
const exists = require('fs').exists;

const outputFolder = path.resolve('./dist');
let productionMode = true;
let watchMode = false;
let serveMode = false;

if (process?.argv.includes('--watch') || process?.env?.npm_config_watch) {
    watchMode = true;
}
if (process?.argv.includes('--serve') || process?.env?.npm_config_serve) {
    serveMode = true;
}

if (process?.argv.includes('--development') || process?.env?.npm_config_mode === 'development') {
    productionMode = false;
}

if (process?.argv.includes('--production') || process?.env?.npm_config_mode === 'production') {
    productionMode = true; // to override with watch mode
}

console.log('# Welcome to ReactTextIcon builder');
if (productionMode) {
    console.log('# Production build');
} else {
    console.log('# Development build');
}
if (watchMode) {
    console.log('# Watch mode ON.')
}
if (serveMode) {
    console.log('# Development server is ON.')
}

console.log('');

const watchConfig = {
    onRebuild(err, res) {
        if (err) {
            console.log('[ERROR] Build failed.')
        } else {
            console.log(`[OK] Build is done. Errors: ${res.errors.length}, warnings: ${res.warnings.length}`);
            console.log();
        }
    }
}

// copy index.html to dist folder
fs.copyFileSync(path.resolve('./src/index.html'), path.join(outputFolder, 'index.html'));

console.time('# Build time');

let watchAnnounced = false;

require('esbuild')
    .build({
        entryPoints: ['./src/index.tsx'],
        outdir: outputFolder,
        bundle: true,
        legalComments: 'none',
        minify: productionMode,
        format: 'iife',
        watch: watchMode ? watchConfig : null
    })
    .then((_) => {
        console.log('------');
        if (watchMode && !watchAnnounced) {
            watchAnnounced = true;
            console.log();
            console.log('Watch mode on. Press Ctrl + C to interrupt.');
            console.log();
        }

        console.timeEnd('# Build time');

        if (serveMode) {
            const host = 'localhost';
            const port = 3030;

            http.createServer((request, response) => {
                const uri = url.parse(request.url).pathname;
                let filename = path.join(outputFolder, uri);

                const contentTypesByExtension = {
                    '.html': "text/html",
                    '.css': "text/css",
                    '.js': "text/javascript"
                };

                console.log('Requested', filename);

                exists(filename, function (exists) {
                    if (!exists) {
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
                            response.writeHead(500, {"Content-Type": "text/plain"});
                            response.write(err + "\n");
                            response.end();
                            return;
                        }

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
                console.log(`# Server is running on http://${host}:${port}`);
            });
        }
    })
    .catch(res => {
        if (!watchMode) {
            console.log(`[ERROR] Errors: ${res.errors.length}, warnings: ${res.warnings.length}`);
            process.exit(-1);
        }
    });
