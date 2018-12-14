/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-11-24
 * @author Liang <liang@maichong.it>
 */

var archiver = require('../index');

var assert = require('assert');
describe('Archiver', function() {
  it('Should perform basic archiving', function(done) {
    var archive = archiver('test.zip', {
      store: true
    });

    // append a file
    archive.file('index.js', { name: 'index.js' });

    // append files from a directory
    archive.directory('test/');

    // finalize the archive
    archive.finalize().then(function () {
      done();
    });
  });
});
