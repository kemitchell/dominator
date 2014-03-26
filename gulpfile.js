/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const replace = require('gulp-replace');

const paths = {
  script: './src/dominator.js',
  templates: ['./templates/*.js'],
  build: './build'
};

gulp.task('default', function () {
  var body = fs.readFileSync(paths.script, 'utf8');

  gulp.src(paths.templates)
      .pipe(replace(/{{ body }}/, body))
      .pipe(gulp.dest(paths.build));
});
