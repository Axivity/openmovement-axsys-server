/**
 * Created by Praveen on 27/08/2015.
 */

var gulp        = require('gulp');
var sourcemaps  = require("gulp-sourcemaps");
var babel       = require("gulp-babel");
var concat      = require("gulp-concat");
var mocha       = require('gulp-mocha');
var eslint      = require('gulp-eslint');
var spawn = require('child_process').spawn;

var node;

gulp.task('test', function () {
    var babel_c       = require('babel/register');
    return gulp.src(['test/*-test.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'list',
            compilers: {
                js: babel_c
            }
        }));
});

gulp.task('lint', function() {
    return gulp.src(['./src/*.js', './lib/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('server', function() {
    if (node) node.kill();
    node = spawn('node', ['server.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
    gulp.run('server');
    gulp.watch(['./app.js', './lib/**/*.js', 'lib/*.js'], function() {
        gulp.run('server')
    });
});