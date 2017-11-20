var gulp = require('gulp'),

    // jade
    jade = require('gulp-jade'),
    changed = require('gulp-changed'),
    cached = require('gulp-cached'),
    jadeInheritance = require('gulp-jade-inheritance'),
    filter = require('gulp-filter'),

    // stylus
    stylus = require('gulp-stylus'),
    prefix = require('gulp-autoprefixer'),
    // минификация - найти новый

    // sprite
    spritesmith = require('gulp.spritesmith'),

    // other
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    webserver = require('gulp-webserver');

// Set defaults
var isDev = true;
var isProd = false;

// If "production" is passed from the command line then update the defaults
if (gutil.env.type === 'production') {
    isDev = false;
    isProd = true;
}

gulp.task('stylus', function() {
    gulp.src(['source/stylus/*.styl'])
        .pipe(stylus())
        .pipe(prefix())
        .pipe(gulp.dest('build/css/'));
});

gulp.task('jade', function() {
    gulp.src(['source/jade/*.jade'])
        .pipe(changed('html', {extension: '.html'}))
        .pipe(gulpif(global.isWatching, cached('jade')))
        .pipe(jadeInheritance({basedir: 'source/jade'}))
        .pipe(filter(function (file) {
            return !/partials/.test(file.path);
        }))
        .pipe(jade({
            pretty: true
        })
        .on('error', console.log))
        .pipe(gulp.dest('build/html'));
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});

gulp.task('js', function() {
    gulp.src(['source/app/**/**/**/*.+(js)'])
        .pipe(concat('app.js'))
        .pipe(gulpif(isProd, uglify({
            mangle: false,
            compress: {
                drop_console: true
            }
        })))
        .pipe(gulp.dest('build/js'));
});

gulp.task('webserver', function() {
    gulp.src('..')
        .pipe(webserver({
            //livereload: true,
            open: true,
            port: 8000
        }));
});

gulp.task('spritesmith', function () {
  return gulp
    .src('source/assets/icons/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: '../../stylus/ui/sprite/sprite.styl',
      imgPath :'../img/sprite.png',
      algorithm: 'binary-tree',
      cssFormat: 'stylus'
    }))
    .pipe(gulp.dest('build/img/'));
});

gulp.task('vendor', function() {
    gulp.src([
        'vendor/jquery/jquery.js'
    ])
        .pipe(concat('app-common.js'))
        .pipe(gulpif(isProd, uglify({
            mangle: false,
            compress: {
                drop_console: true
            }
        })))
        .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function() {
    gulp.watch('source/app/**/**/**/*.+(js)', ['js']);
    gulp.watch('source/stylus/**/*.styl', ['stylus']);
    gulp.watch('source/assets/icons/*.png', ['spritesmith']);
    gulp.watch('source/jade/**/**/*.jade', ['setWatch', 'jade']);
});

gulp.task('build', ['js', 'stylus', 'jade', 'spritesmith', 'vendor']);
gulp.task('default', ['build', 'watch', 'webserver', 'spritesmith']);