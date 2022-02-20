/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-11-24
 * @author Liang <liang@maichong.it>
 */

var archiver = require('../index');
const fs = require('fs')

const output = fs.createWriteStream('test.zip')
var archive = archiver('zip', {
  store: true
});

archive.pipe(output)

// append a file
archive.file('index.js', { name: 'index.js' });

// append files from a directory
archive.directory('tests/');

// finalize the archive
archive.finalize().then(function () {
  console.log('done');
});
