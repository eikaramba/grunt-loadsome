/*
 * loadsome
 * https://loadso.me
 *
 * Copyright (c) 2014 Eike Thies
 * Licensed under the MIT license.
 */

// 'use strict';

module.exports = function(grunt) {

    var _ = require('lodash');
    var path = require('path');
    var fs = require('fs');
    var crypto = require('crypto');
    var url = require('url');
    var async = require('async');
    var request = require('request');

    var detectDestType = function(dest) {
        if (grunt.util._.endsWith(dest, '/')) {
            return 'directory';
        } else {
            return 'file';
        }
    };

    var unixifyPath = function(filepath) {
        if (process.platform === 'win32') {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    };

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
                return arguments[0];
            }
        }
    }

    function md5(content, algorithm, encoding) {
        var hash = crypto.createHash(algorithm);
        hash.update(content);
        return hash.digest(encoding);
    }

    grunt.registerMultiTask('loadsome', 'Replaces references of loadso.me to their downloaded and concenated local counterparts', function() {

        var done = this.async();

        var options = this.options({
            encoding: grunt.file.defaultEncoding,
            mode: false //Whether to copy or set the existing file permissions. Set to true to copy the existing file permissions. Or set to the mode, i.e.: 0644, that copied files will be set to.
        });

        var fileSettings = {
            downloadPath: "assets",
            dest: "dest"
        };

        var dest;
        var isExpandedPair;
        var content;
        var filesToBeProcessed = [];

        // Iterate over all specified file groups.
        async.eachSeries(this.files, function(filePair, nextFile) {

            // grunt.log.subhead(JSON.stringify(filePair));

            isExpandedPair = filePair.orig.expand || false;

            async.eachSeries(filePair.src, function(src, nextSrc) {
                grunt.log.subhead('file is ' + src);

                if (detectDestType(filePair.dest) === 'directory') {
                    dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
                } else {
                    dest = filePair.dest;
                }

                var settings = extend(fileSettings, filePair);

                var replaceOrders = [];

                if (grunt.file.isDir(src)) {
                    grunt.file.mkdir(dest);
                } else {
                    content = fs.readFileSync(src).toString();
                    // var results = content.match(/<script.+src=['"][^"']+loadso\.me([^"']+)["']/gm);
                    var pattern = /<script.+src=['"]([^"']+loadso\.me)([^"']+)["']/gm;
                    var result;

                    //Now find every occurence of loadsome and save them into our object. Then we can use this to schedule the downloads and replace the references with the downloaded files
                    async.whilst(
                        function() {
                            return result = pattern.exec(content);
                        },
                        function(nextReplace) {
                            var replaceOrder = {};
                            replaceOrder.path = result[2];
                            replaceOrder.replace = result[1] + result[2];
                            replaceOrder.filetype = replaceOrder.path.split('.').pop();
                            grunt.log.writeln('found & download: ' + replaceOrder.replace);

                            request("https://loadso.me"+replaceOrder.path, function(err, response, downloadedContent) {
                                if (response.statusCode !== 200 || err) {
                                    if(response.statusCode === 429) {
                                        grunt.log.subhead('Too many requests, please report this us so that we can adapt the timeout or implement a additional option to include a token for unlimited requests!');
                                    } else {
                                        grunt.log.subhead('Download failed:' + err);
                                    }
                                    setTimeout(function(){ nextReplace(err); }, 1150); //TODO: Add token option so that more concurrent calls can be made
                                }else{
                                    var hash = md5(downloadedContent, "md5", 'hex');

                                    //settings.downloadPath must end with slash, TODO: Add if missing
                                    var relativePath = path.relative(path.dirname(dest), settings.downloadPath).replace(new RegExp('\\' + path.sep, 'g'), '/');

                                    var assetLocalPath = unixifyPath(path.join(settings.downloadPath, hash + "." + replaceOrder.filetype));
                                    var assetPath = relativePath + "/" + hash + "." + replaceOrder.filetype;

                                    grunt.file.write(assetLocalPath, downloadedContent);
                                    grunt.log.writeln('Downloaded loadsome file written to '+assetLocalPath);
                                    if (options.mode !== false) {
                                        fs.chmodSync(assetLocalPath, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
                                    }
                                    replaceOrder.newPath = assetPath;
                                    replaceOrders.push(replaceOrder);
                                    setTimeout(function(){ nextReplace(err); }, 1150); //TODO: Add token option so that more concurrent calls can be made
                                }
                            });

                        },
                        function(err) {
                            if (err) {
                                grunt.log.subhead('failed:' + err);
                            }
                            _.forEach(replaceOrders, function(order) {
                                content = content.replace(new RegExp('(<script.+src=[\'"])' + order.replace + '(["\'])', 'gm'), '$1' + order.newPath + '$2');
                            });
                            grunt.file.write(dest, content);
                            grunt.log.writeln('file references replaced and html file written to: '+dest);
                            if (options.mode !== false) {
                                fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
                            }
                            nextSrc();
                        }
                    );
                }

            }, function(err) {
                nextFile();
            });

            // grunt.log.subhead(JSON.stringify(filesToBeProcessed));
        }, function(err) {
            done();
        });

    });
};
