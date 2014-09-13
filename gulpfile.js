var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    del = require('del');

gulp.task('clean', function (cb) {
  del(['public'],cb);
});

gulp.task('coffee', function () {
    gulp.src('coffee/*.coffee')
    //.pipe(sourcemaps.init())
    .pipe(coffee())
    //.pipe(sourcemaps.write())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('copy', function () {
  var inputs = [
    'index.html',
    'css/app.css',
    'node_modules/bacon/lib/bacon.js',
    'node_modules/d3/d3.js',
    'node_modules/jquery/dist/jquery.js',
    'vendor/Bacon.js',
    'vendor/bacon-viz.js'
  ];
  gulp.src(inputs)
    .pipe(gulp.dest('public'));
});

gulp.task('default', ['coffee','copy']);

gulp.task('watch', ['default'], function(){
  gulp.watch(['css/app.css','index.html'], ['copy']);
  gulp.watch(['coffee/*.coffee'], ['coffee']);
});
