/**
 * @author edy4c7 <edy4c7@gmail.com>
 */

import archiver from 'archiver';

module.exports = function (file: archiver.Format, options: archiver.ArchiverOptions): archiver.Archiver {
  const archive = archiver(file, options);
  let done: boolean;
  let error: archiver.ArchiverError;
  let promise: Promise<void>;
  let onSuccess: { (): void; (value: void | PromiseLike<void>): void; };
  let onError: { (arg0: archiver.ArchiverError): void; (reason?: any): void; };

  archive.on('finish', () => {
    done = true;
    if (onSuccess) {
      onSuccess();
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', (err) => {
    error = err;
    if (onError) {
      onError(err);
    }
    throw err;
  });

  const finalize = archive.finalize;
  archive.finalize = () =>  {
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
