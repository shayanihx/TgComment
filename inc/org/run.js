const config = require('./../config');

const path = require('path');
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const minify = require('minify');

(async() => {
    try {
        let cssCode = await minify('./style.css', {css: {compatibility: '*'}});

        let jsCode = fs.readFileSync('./script.js', 'utf8');
        let obfuscationResult = JavaScriptObfuscator.obfuscate(jsCode, {
            compact: true,
            controlFlowFlattening: true
        });

        let appSource = fs.readFileSync('./../../app.js', 'utf8');
        let appSourceFirstLine = appSource.split('\n')[0];
        let currentVersion = appSourceFirstLine.replace('const filesVersion = ', '').replace(';', '');
        let newVersion = parseFloat(currentVersion) + 0.1;
        let newAppSource = appSource.replace(appSourceFirstLine, `const filesVersion = ${newVersion.toFixed(1)};`);

        fs.writeFile(path.join(config.staticDir, 'css/style.css'), cssCode, function(){
            fs.writeFile(path.join(config.staticDir, 'js/script.js'), obfuscationResult.getObfuscatedCode(), 'utf8', function(){
                fs.writeFile(path.join(config.projectDir, 'app.js'), newAppSource, 'utf8', function(){
                    console.log('Done !');
                });
            });
        });

    }catch (e) {

    }
})()