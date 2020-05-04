var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var merge = require('merge2');
var sourcemaps = require("gulp-sourcemaps");
var eslint = require('gulp-eslint');
var path = require('path');
var { fork } = require('child_process');
var process = require('process');

function clean() {
  return del([
    './dist/**/*'
  ]);
}

var tsProject = ts.createProject('./tsconfig.json');

function compile() {
  return gulp.src(tsProject.config.include)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
    .pipe(gulp.dest('./dist'));
}

// 应用进程
var appProcess = null;

/**
 * 运行应用进程
 */
function run(done) {
  if (appProcess) {
    terminate(() => {
      run(done);
    });
  } else {
    appProcess = fork(path.resolve(__dirname, './dist/index.js'));
    appProcess.on('exit', () => {
      appProcess = null;
    });
    done();
  }
}

/**
 * 终止应用进程
 */
function terminate(done) {
  if (appProcess) {
    appProcess.on('exit', () => {
      done();
    });
    appProcess.kill('SIGINT');
  } else {
    done();
  }
}

/**
 * 监听gulp进程是否中断
 */
process.on('SIGINT', () => {
  terminate(() => {
    if (watcher) {
      watcher.close();
      watcher = null;
    }
    process.exit(0);
  });
});

var watcher = null;

function watch(done) {
  watcher = gulp.watch(tsProject.config.include, gulp.series(
    terminate,
    lint,
    clean,
    compile,
    run
  ));
  done();
}

function lint() {
  return gulp.src(['./src/**/*.ts'])
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest('./dist/'));
}

exports.default = gulp.series(
  lint,
  clean,
  compile
);

exports.debug = gulp.series(
  lint,
  clean,
  compile,
  run,
  watch
);

exports.lint = lint;

