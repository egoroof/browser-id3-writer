var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var Server = require('karma').Server;
var path = require('path');

gulp.task('build', function (done) {
    gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
        .on('end', function () {
            new Server({
                configFile: path.join(__dirname, 'karma.conf.js'),
                singleRun: true,
                concurrency: 1
            }, done).start();
        });
});
