const gulp = require('gulp');
const del = require('del');
const through = require('through2');

function clean() {
  return del('./lib/**');
}

function copyMetaFiles() {
  return gulp.src(['./README.md']).pipe(gulp.dest('./lib/'));
}

function generateCliPackageJSON() {
  return gulp
    .src('./package.json')
    .pipe(
      through.obj((file, enc, cb) => {
        const rawJSON = file.contents.toString();
        const parsed = JSON.parse(rawJSON);
        parsed.main = parsed.main.replace('./lib/', './');
        parsed.module = parsed.module.replace('./lib/', './');
        parsed.types = parsed.types.replace('./lib/', './');
        parsed.typings = parsed.typings.replace('./lib/', './');
        delete parsed.scripts;
        delete parsed.devDependencies;
        delete parsed.publishConfig;
        delete parsed.files;
        const stringified = JSON.stringify(parsed, null, 2);
        file.contents = Buffer.from(stringified);
        cb(null, file);
      }),
    )
    .pipe(gulp.dest('lib/'));
}

exports.default = gulp.series(clean, copyMetaFiles, generateCliPackageJSON);
