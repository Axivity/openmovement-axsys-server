/**
 * Created by Praveen on 27/08/2015.
 */

var gulp        = require('gulp');
var sourcemaps  = require("gulp-sourcemaps");
var babel       = require("gulp-babel");
var concat      = require("gulp-concat");
var mocha       = require('gulp-mocha');
var babel       = require('babel/register');

gulp.task("default", function () {
    return gulp.src(["lib/**/*.js", "src/**/*.js"])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});


gulp.task('test', function () {
    return gulp.src(['test/*-test.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'list',
            compilers: {
                js: babel
            }
        }));
});
