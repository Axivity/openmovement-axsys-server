/**
 * Created by Praveen on 27/08/2015.
 */

var gulp        = require('gulp');
var fs          = require('fs');
var browserify  = require('browserify');
var sourcemaps  = require('gulp-sourcemaps');
var babel       = require('gulp-babel');
var concat      = require('gulp-concat');
var mocha       = require('gulp-mocha');
var eslint      = require('gulp-eslint');
var nodemon     = require('gulp-nodemon');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');

gulp.task('test', function () {
    var babel_c       = require('babel/register');
    return gulp.src(['test/*-test.js', 'test/**/*-test.js'], {read: false})
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

gulp.task('server', function () {
    'use strict';
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: 'axsys-devices'
    }).on('restart', function() {
       console.log('Restarted server');
    });

});

gulp.task('dist-client', function() {
    var options = {
        entries: './client-lib/client.js',
        debug: true
    };

    browserify(options)
        .transform(babelify)
        .bundle()
        .on('error', function(err) {console.error(err); this.emit('end');} )
        .pipe(source('client.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist-client'));
});
