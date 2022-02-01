const path = require('path');
const fs = require('fs');
const serve = require('./esbuild.serve');

const outputFolder = path.resolve('./dist');
const host = 'localhost';
const port = 3030;

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
    productionMode = true; // to override when watch mode is ON
}

console.log('# Welcome to ReactTextIcon builder');
console.log('# Mode  [ ' + (productionMode ? 'Production' : 'Development') + ' ]');
console.log('# Watch [ ' + (watchMode ? 'ON' : 'OFF') + ' ]');
console.log('# Serve [ ' + (serveMode ? 'ON' : 'OFF') + ' ]');

console.log('');

// declare informer for watch mode
const watchConfig = {
    onRebuild(err, res) {
        if (err) {
            console.log('[FAIL] Build failed.')
        } else {
            console.log(`[OK] Build is done. Errors: ${res.errors.length}, warnings: ${res.warnings.length}`);
            console.log();
        }
    }
};

// copy index.html to dist folder
(function copyAssets() {
    // here should be recursive copying of all the assets, if any - such as fonts, images, etc.
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }
    fs.copyFileSync(path.resolve('./src/assets/index.html'), path.join(outputFolder, 'index.html'));
})();

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
        console.log('-------');
        if ((watchMode || serveMode) && !watchAnnounced) {
            watchAnnounced = true;
            console.log();
            console.log(`# ${(serveMode ? 'Serve' : 'Watch')} mode. Press Ctrl + C to interrupt.`);
            console.log();
        }

        console.timeEnd('# Build time');

        if (serveMode) {
            serve(outputFolder, host, port);
        }
    })
    .catch(res => {
        if (!watchMode) {
            console.log(`[FAIL] Errors: ${res.errors.length}, warnings: ${res.warnings.length}`);
            process.exit(-1);
        }
    });
