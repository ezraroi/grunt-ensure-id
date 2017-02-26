/*
 * grunt-ensure-id
 * https://github.com/ezraroi/grunt-ensure-id
 *
 * Copyright (c) 2015 Roi Ezra
 * Licensed under the MIT license.
 */

'use strict';
const htmlparser = require("htmlparser2");
const replace = require('replace-in-file');
const camelCase = require('lodash.camelcase');

module.exports = function (grunt) {

    grunt.registerMultiTask('ensure_id', 'Ensures that all specified html elements has id attribute', checkHtml);

    function checkHtml() {
        /* jshint validthis: true */

        var options = this.options({
            check: ['ng-attr-id'],
            elements: ['button', 'a', 'input', 'select'],
            attrs: ['ng-click', 'ng-submit'],
            autofix: true
        });

        var currentFile, hasError = false, currentLine, index, countFile = 0, uniqueId = 0;
        var parser = new htmlparser.Parser({
            onopentag: parseOpenTag
        }, { decodeEntities: true });
        grunt.log.debug('Found ' + this.files.length + ' file groups to check');
        this.files.forEach(function (f) {
            f.src.filter(filterNonExistingFiles).map(parseFile);
        });
        parser.end();
        if (hasError) {
            grunt.fail.warn('Found elements without -> ' + options.check + '.');
        }

        function filterNonExistingFiles(filepath) {
            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Source file "' + filepath + '" not found.');
                return false;
            } else {
                return true;
            }
        }

        function parseFile(filepath) {
            grunt.log.debug('Checking file: ' + filepath);
            currentFile = filepath;
            var lines = grunt.file.read(filepath);
            index = 1;
            lines.split('\n').forEach(function (line) {
                currentLine = line.replace('\r', '');
                parser.parseComplete(currentLine);
                index++;
            });
            grunt.log.debug('Finished file: ' + filepath);
            countFile++;
        }

        function parseOpenTag(name, attribs) {
            if (options.elements.indexOf(name) !== -1) {
                if (!attribs.hasOwnProperty(options.check)) {
                    if (options.autofix) {

                        /* convert name file to camelCase */
                        var regExpFileName = new RegExp(/[^/]*$/g);
                        var nameFile = camelCase(regExpFileName.exec(currentFile.replace(/\.html/g, '')));

                        /* replace the special characters of the html tag to be able to use it with regular expressions */
                        var copyCurrentLine = currentLine;
                        copyCurrentLine = copyCurrentLine.replace(/\"/g, '\\"');
                        copyCurrentLine = copyCurrentLine.replace(/\./g, '\\.');
                        copyCurrentLine = copyCurrentLine.replace(/\//g, '\\/');
                        copyCurrentLine = copyCurrentLine.replace(/\(/g, '\\(');
                        copyCurrentLine = copyCurrentLine.replace(/\)/g, '\\)');
                        var regexString = new RegExp(copyCurrentLine);

                        switch (name) {
                            case 'button':
                                var newId = nameFile + "_btn_" + countFile + "_" + uniqueId;
                                break;

                            case 'img':
                                var newId = nameFile + "_img_" + countFile + "_" + uniqueId;
                                break;

                            case 'p':
                                var newId = nameFile + "_text_" + countFile + "_" + uniqueId;
                                break;

                            case 'span':
                                var newId = nameFile + "_span_" + countFile + "_" + uniqueId;
                                break;

                            case 'a':
                                var newId = nameFile + "_link_" + countFile + "_" + uniqueId;
                                break;

                            case 'iframe':
                                var newId = nameFile + "_iframe_" + countFile + "_" + uniqueId;
                                break;

                            default:
                                var newId = nameFile + "_other_" + countFile + "_" + uniqueId;
                                break;
                        }
                        uniqueId++;

                        /* Prepare options to replace file */
                        var replaceOptions = {
                            files: currentFile,
                            from: regexString,
                            to: currentLine.replace('<' + name, '\<' + name + ' ' + options.check + '="' + newId + '"')
                        };

                        try {
                            let changedFiles = replace.sync(replaceOptions);
                            grunt.log.debug(currentFile + ' [AUTO FIX] Line ' + index + ': (' + name + ' with ' + attribute + ' -> without: ' + options.check + ')' + currentLine);
                        }
                        catch (error) {
                            grunt.log.debug('Error occurred:', error);
                        }
                        hasError = false;
                    } else {
                        grunt.log.warn(currentFile + ' Line ' + index + ': (' + name + ' -> without: ' + options.check + ')' + currentLine);
                        hasError = true;
                    }
                }
            }

            options.attrs.forEach(function (attribute) {
                if (attribs.hasOwnProperty(attribute) && !attribs.hasOwnProperty(options.check)) {

                    if (options.autofix) {

                        /* convert name file to camelCase */
                        var regExpFileName = new RegExp(/[^/]*$/g);
                        var nameFile = camelCase(regExpFileName.exec(currentFile.replace(/\.html/g, '')));

                        /* replace the special characters of the html tag to be able to use it with regular expressions */
                        var copyCurrentLine = currentLine;
                        copyCurrentLine = copyCurrentLine.replace(/\"/g, '\\"');
                        copyCurrentLine = copyCurrentLine.replace(/\./g, '\\.');
                        copyCurrentLine = copyCurrentLine.replace(/\//g, '\\/');
                        copyCurrentLine = copyCurrentLine.replace(/\(/g, '\\(');
                        copyCurrentLine = copyCurrentLine.replace(/\)/g, '\\)');
                        var regexString = new RegExp(copyCurrentLine);

                        switch (attribute) {
                            case 'ng-click':
                                var newId = nameFile + "_btn_" + countFile + "_" + uniqueId;
                                break;
                            case 'ng-submit':
                                var newId = nameFile + "_btn_" + countFile + "_" + uniqueId;
                                break;
                            default:
                                var newId = nameFile + "_other_" + countFile + "_" + uniqueId;
                                break;
                        }
                        uniqueId++;

                        /* Prepare options to replace file */
                        var replaceOptions = {
                            files: currentFile,
                            from: regexString,
                            to: currentLine.replace('<' + name, '\<' + name + ' ' + options.check + '="' + newId + '"')
                        };

                        try {
                            let changedFiles = replace.sync(replaceOptions);
                            grunt.log.debug(currentFile + ' [AUTO FIX] Line ' + index + ': (' + name + ' with ' + attribute + ' -> without: ' + options.check + ')' + currentLine);
                        }
                        catch (error) {
                            grunt.log.debug('Error occurred:', error);
                        }
                        hasError = false;
                    } else {
                        grunt.log.warn(currentFile + ' Line ' + index + ': (' + name + ' with ' + attribute + ' -> without: ' + options.check + ')' + currentLine);
                        hasError = true;
                    }

                }
            });
        }

    }


};
