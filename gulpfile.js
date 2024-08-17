/*
  (c) 2020 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

const _concat = require('gulp-concat');
const _cp = require('child_process');
const _del = require('del');
const _fs = require('fs').promises;
const _gulp = require('gulp');
const _path = require('path');
const _pump = require('pump');
const _replace = require('gulp-replace');
const _uglify = require('gulp-uglify-es').default;
const _util = require('util');

const _exec = _util.promisify(_cp.exec);

const build_file_nm = 'build.js';
const bundle_nm = 'html';
const bundle_file_nm = `${bundle_nm}.js`;
const exclude = ['.dist', '.stage', '.vscode', '.obj', 'node_modules'].map(x => _path.join('/', x, '/'));

exports.bundle_html = async () => {
  const paths = (await get_files('.', ent => ent.isFile() &&
    ent.name.endsWith('.html') &&
    ent.name !== 'index.html' &&
    exclude.every(x => ent.parentPath.indexOf(x) === -1)));
  await _fs.writeFile(bundle_file_nm, 'require([' + paths.map(x => `'text!${x}'`).join(',') + '],function(){});');
  await _fs.writeFile(build_file_nm, `({name:"${bundle_nm}",out:"../.dist/@lytical/lspa/html.js",baseUrl:".",paths:{text:"node_modules/requirejs-text/text"}})`);
  try {
    await exec('node node_modules/requirejs/bin/r.js -o ' + build_file_nm);
  }
  finally {
    await _fs.unlink(bundle_file_nm);
    await _fs.unlink(build_file_nm);
  }
}

const exec = async (cmd, is_verbose) => {
  let rt = await _exec(cmd);
  if(is_verbose) {
    display_results(rt);
  }
  if(rt.code) {
    throw new Error(`failed to execute command return code (${rt.code})`);
  }
  return rt;
}

const get_files = async (dir, predicate, recursive = true) => {
  let rt = [];
  for(let ent of await _fs.readdir(_path.resolve(dir), { withFileTypes: true, recursive })) {
    if(predicate(ent)) {
      rt.push(_path.relative('.', _path.join(ent.parentPath, ent.name)).replace(/\\/g, '/'));
    }    
  }
  return rt;
}

exports.pre_build = async () => {
  const package = await require(_path.resolve('package.json'));
  const version = package.version.split('.');
  version.push(Number.parseInt(version.pop()) + 1);
  let nxt_ver = version.join('.');
  await _pump(
    _gulp.src(['package.json', '**/main.ts', '!node_modules/**', '!.dist/**', '!.vscode/**', '!.scripts/**']),
    _replace(/"version":\s?"[^"]+"/, `"version": "${nxt_ver}"`),
    _replace(/version\s?=\s?'[^']+'/, `version = '${nxt_ver}'`),
    _gulp.dest('.'));
}

exports.post_build = _gulp.series(
  _gulp.parallel
    (
      done => _pump(_gulp.src(['package.json', 'README.md', '@lytical/lspa/**/*.{ico,gif,jpg,jpeg,png,svg,md,css}', '!node_modules/**']), _gulp.dest('../.dist/@lytical/lspa'), done),
      done => _pump(_gulp.src('../.dist/@lytical/lspa/**/*.js', { dot: true }), _uglify({ mangle: { keep_fnames: true }, output: { comments: 'some' } }), _gulp.dest('../.dist/@lytical/lspa'), done),
      exports.bundle_html
    ),
  done => _pump(_gulp.src(['./node_modules/@lytical/lmvc/index.js', '../.dist/@lytical/lspa/index.js', '../.dist/@lytical/lspa/html.js'], { dot: true }), _concat('index.js'), _gulp.dest('../.dist/@lytical/lspa'), done),
  done => _pump(_gulp.src(['../.dist/@lytical/lspa/index.d.ts', './node_modules/@lytical/lmvc/index.d.ts'], { dot: true }), _concat('index.d.ts'), _gulp.dest('../.dist/@lytical/lspa'), done),
  done => _pump(_gulp.src(['package.json', 'README.md', '@lytical/lspa/**/*.{ico,gif,jpg,jpeg,png,svg,md,css}', '!node_modules/**']), _gulp.dest('../.dist/@lytical/lspa'), done),
  done => { _del(['../.dist/@lytical/lspa/*.{map,tsbuildinfo}', `../.dist/@lytical/lspa/${bundle_file_nm}`], { force: true }); done() }
);