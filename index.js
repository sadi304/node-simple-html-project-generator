#!/usr/bin/env node

var program = require('commander');
var fs = require('fs-extra');
var co = require('co');
var prompt = require('co-prompt');
var chalk = require('chalk');

program
    .usage('gen [options]')
    .option('-b, --bootstrap', 'Set if bootstrap is to be included')
    .option('-j, --jquery', 'Set if jquery is to be included')
    .action(function(arg) {
        if(arg === 'gen') {
            co(function *() {
                var name = yield prompt('project name: ');
                var author = yield prompt('author: ');
                var version = yield prompt('version: ');

                if(!name) {
                    console.log(chalk.bold.red('Project name must be specified'));
                    process.exit(1);
                }

                var root = './' + name.replace(/ /g, '');
                var assets = root + '/assets';
                var js = assets + '/js';
                var css = assets + '/css';
                var images = assets + '/images';

                // SYNC PROCESSES 
                fs.mkdirsSync(
                    js
                );
                fs.mkdirsSync(
                    css
                );
                fs.mkdirsSync(
                    images
                );

                var indexFile = root + '/index.html';
                var styleFile = root + '/style.css';
                var customJS = js + '/custom.js';

                var datahtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <!-- CSS -->
    ${program.bootstrap ? '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">\n': ''}<link rel="stylesheet" href="./style.css">
</head>
<body>
    
</body> 
    <!-- SCRIPTS -->
    ${program.jquery ? '<script src="https://code.jquery.com/jquery.min.js"></script>\n': ''}${program.bootstrap ? '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>\n': ''}<script src="./assets/js/custom.js"></script>
</html>`;

                var dataStyleJS = `/* ----------------------------
/*  Name: ${name}
    Author: ${author}
    Version: ${version}
/* -------------------------- */`;

                fs.outputFileSync(indexFile, datahtml);
                fs.outputFileSync(styleFile, dataStyleJS);
                fs.outputFileSync(customJS, dataStyleJS);

                console.log(chalk.bold.cyan('Project Successfully Generated!'));
                console.log(chalk.bold.cyan('cd to ' + root));
                process.exit(0);
            })
        }
        else {
            console.log(chalk.bold.red('Use: simplegen-html gen [options] to generate'));
        }
    })
    .parse(process.argv);