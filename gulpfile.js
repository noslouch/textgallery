'use strict';
var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('default', function() {
    var server = livereload();

    gulp.watch(['*.js', '*.html', '*.css'], function(file) {
        server.changed(file.path)
    })
})
