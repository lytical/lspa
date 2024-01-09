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
const _uglify = require('gulp-uglify-es').default;
const _util = require('util');

const _exec = _util.promisify(_cp.exec);

const build_file_nm = 'build.js';
const bundle_nm = 'html';
const bundle_file_nm = `${bundle_nm}.js`;

const bundle_html = async () => {
  const paths = (await get_files('.', ent =>
    (ent.isFile() && _path.parse(ent.name).ext === '.html') ||
    (ent.isDirectory() && ent.name !== '.git' && ent.name !== '.dist' && ent.name !== '.stage' && ent.name !== '.vscode' && ent.name !== '.obj' && ent.name !== 'node_modules')))
    .filter(x => !x.endsWith('/index.html'));
  await _fs.writeFile(bundle_file_nm, 'require([' + paths.map(x => `'text!${x}'`).join(',') + '],function(){});');
  await _fs.writeFile(build_file_nm, `({name:"${bundle_nm}",out:"../.dist/html.js",baseUrl:".",paths:{text:"node_modules/requirejs-text/text"}})`);
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

const get_files = async (dir, predicate) => {
  let rt = [];
  for(let path of await _fs.readdir(dir, { withFileTypes: true })) {
    if(predicate(path)) {
      if(path.isFile()) {
        rt.push(dir === '.' ? path.name : dir + '/' + path.name);
      }
      else if(path.isDirectory()) {
        rt = rt.concat(await get_files(dir === '.' ? path.name : dir + '/' + path.name, predicate));
      }
    }
  }
  return rt;
}

exports.post_build = _gulp.series(
  _gulp.parallel
  (
    done => _pump(_gulp.src(['package.json', 'README.md', '@lytical/lspa/**/*.{ico,gif,jpg,jpeg,png,svg,md,css}', '!node_modules/**']), _gulp.dest('../.dist'), done),
    done => _pump(_gulp.src('../.dist/**/*.js', { dot: true }), _uglify({ mangle: { keep_fnames: true }, output: { comments: 'some' } }), _gulp.dest('../.dist'), done),
    bundle_html
    ),
  done => _pump(_gulp.src(['../.dist/index.js', '../.dist/html.js'], { dot: true }), _concat('index.js'), _gulp.dest('../.dist'), done),
  done => _pump(_gulp.src(['package.json', 'README.md', '@lytical/lspa/**/*.{ico,gif,jpg,jpeg,png,svg,md,css}', '!node_modules/**']), _gulp.dest('../.dist'), done),
  done => { _del(['../.dist/*.{map,tsbuildinfo}', `../.dist/${bundle_file_nm}`], { force: true }); done() }
);