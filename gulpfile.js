/**
 * Created by Praveen on 27/08/2015.
 */

var gulp              = require('gulp');
var notify            = require('gulp-notify');
var fs                = require('fs');
var browserify        = require('browserify');
var sourcemaps        = require('gulp-sourcemaps');
var babel             = require('gulp-babel');
var concat            = require('gulp-concat');
var mocha             = require('gulp-mocha');
var eslint            = require('gulp-eslint');
var nodemon           = require('gulp-nodemon');
var uglify            = require('gulp-uglify');
var rename            = require('gulp-rename');
var babelify          = require('babelify');
var source            = require('vinyl-source-stream');
var buffer            = require('vinyl-buffer');
var flow              = require('gulp-flowtype');
var sourcemapReporter = require('jshint-sourcemap-reporter');

var clientSrcDir = "lib", flowDest = "tmp_build_flow";

gulp.task('test', function () {
    var babel_c       = require('babel/register');
    return gulp.src(['test/*-test.js', 'test/**/*-test.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: 'list',
            compilers: {
                js: babel_c
            },
            require: ['./test/test_helper']
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

gulp.task('flow:babel', function(cb) {
    gulp.src(clientSrcDir + '/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ blacklist: ['flow'] }))
        .on('error', notify.onError('<%= error.message %>'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(flowDest))
        .on('end', cb);
});

//gulp.task('flow', ['flow:babel'], function() {
//    gulp.src(flowDest + '/**/*.js')
//        .pipe(flow({
//            all: false,
//            weak: false,
//            killFlow: false,
//            beep: true,
//            abort: false,
//            reporter: {
//                reporter: function(errors) {
//                    return sourcemapReporter.reporter(errors, { sourceRoot: '/' + clientSrcDir + '/' });
//                }
//            }
//        }));
//
//});

gulp.task('flow', ['flow:babel'], function(cb) {
    gulp.src(flowDest + '/**/*.js')
    .pipe(flow({
        all: false,
        weak: false,
        killFlow: false,
        beep: true,
        abort: true,
        reporter: {
            reporter: function(errors) {
                return sourcemapReporter.reporter(errors, { sourceRoot: '/' + clientSrcDir + '/' });
            }
        }
    }))
    .on('error', function(err) {
        console.log('FLOW ERROR');
        console.log(err);
        throw new Error(err);
    })
    .on('end', cb)
    .emit('end');
});

gulp.task('flow:watch', function() {
    gulp.watch(clientSrcDir + '/**/*.js', ['client:flow']);
});