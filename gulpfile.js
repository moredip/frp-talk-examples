var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    del = require('del');

gulp.task('clean', function (cb) {
  del(['public'],cb);
});

gulp.task('coffee', function () {
  var javascripts = gulp.src('coffee/*.coffee')
    .pipe(plumber())
    .pipe(coffee());

  javascripts
    .pipe(gulp.dest('public'));
  
  javascripts.pipe(concat('app.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('copy', function () {
  var inputs = [
    'index.html',
    'html/**/*.html',
    'node_modules/bacon/lib/bacon.js',
    'node_modules/d3/d3.js',
    'node_modules/jquery/dist/jquery.js',
    'vendor/Bacon.js',
    'vendor/bacon-viz.js'
  ];
  gulp.src(inputs)
    .pipe(gulp.dest('public'));
});

gulp.task('sass', function() {
  gulp.src('sass/app.scss')
    .pipe(plumber())
    .pipe( sass({
      includePaths: require('node-bourbon').includePaths.concat( require('node-neat').includePaths )
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('default', ['coffee','sass','copy']);

gulp.task('watch', ['default'], function(){
  gulp.watch(['**/*.html'], ['copy']);
  gulp.watch(['sass/*.scss'], ['sass']);
  gulp.watch(['coffee/*.coffee'], ['coffee']);
});
