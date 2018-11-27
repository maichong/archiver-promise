/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-11-24
 * @author Liang <liang@maichong.it>
 */

'use strict';

var archiver = require('archiver');

module.exports = function (file, options) {
  var archive = archiver(file, options);
  var done;
  var error;
  var promise;
  var onSuccess;
  var onError;

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
