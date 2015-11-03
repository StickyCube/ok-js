'use strict';

var
  pkg         = require('./package.json'),
  gulp        = require('gulp'),
  browserify  = require('gulp-browserify'),
  uglify      = require('gulp-uglify'),
  mocha       = require('gulp-mocha'),
  rename      = require('gulp-rename'),
  license     = require('gulp-license'),
  header      = require('gulp-header'),
  istanbul    = require('gulp-istanbul');

gulp.task('pre-test', function () {
  gulp
    .src(['./src/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('tests', ['pre-test'], function () {
  gulp
    .src(['./tests/**/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});

gulp.task('build', ['tests'], function () {
  gulp
    .src('./src/main.js')
    .pipe(browserify({ standalone: 'ok' }))
    .pipe(uglify())
    .pipe(rename({
      basename: 'ok',
      extname: '.min.js'
    }))
    .pipe(license('MIT', { tiny: false }))
    .pipe(header([
      '/**',
      ' *  <%= pkg.name %> - <%= pkg.version %>',
      ' *  <%= pkg.description %>',
      ' *  @link <%= pkg.homepage %>',
      ' *  @license <%= pkg.license %>',
      '*/\n'
    ].join('\n'), { pkg: pkg }))
    .pipe(gulp.dest('./dist'));
});
