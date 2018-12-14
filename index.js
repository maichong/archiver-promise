/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-11-24
 * @author Liang <liang@maichong.it>
 */

'use strict';

var archiver = require('archiver');
var path = require('path');
var fs = require('fs');

module.exports = function (file, options) {
  var ext = path.extname(file).substring(1); // strip the leading .
  var archive = archiver(ext, options);
  var done;
  var error;
  var promise;
  var onSuccess;
  var onError;

  archive.pipe(fs.createWriteStream(file));

  archive.on('finish', function () {
    done = true;
    if (onSuccess) {
      onSuccess();
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function (err) {
    error = err;
    if (onError) {
      onError(err);
    }
    throw err;
  });

  let finalize = archive.finalize;
  archive.finalize = function () {
    if (error) return Promise.reject(error);
    if (done) return Promise.resolve();
    if (!promise) {
      promise = new Promise(function (resolve, reject) {
        onSuccess = resolve;
        onError = reject;
      });
      finalize.call(archive);
    }
    return promise;
  };

  return archive;
};
