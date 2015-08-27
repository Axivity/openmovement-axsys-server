/**
 * Created by Praveen on 27/08/2015.
 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
    return gulp.src(['test/*-test.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'list'}));
});
