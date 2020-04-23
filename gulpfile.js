"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const del = require('del');

gulp.task('clean', () => {
    return del([
        './dist/*'
    ])
});

gulp.task("sass", () => {
    return (gulp
        .src("./assets/styles/app.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest("./dist")));
});

gulp.task('js', (done) => {
    return gulp.src(['./assets/js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('./dist'));
})

gulp.task('copy:fonts', () => {
    return gulp.src('./assets/fonts/**/*.*')
        .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('copy:images', () => {
    return gulp.src('./assets/images/**/*.*')
        .pipe(gulp.dest('./dist/images'))
})

gulp.task('sync', function () {
    // Start the server
    browserSync.init({
        server: "./dist",
        open: false
    });

    browserSync.watch("./dist", function (event, file) {
        browserSync.reload();
    });
});

gulp.task('html', () => {
    return gulp.src('./index.html')
    .pipe(gulp.dest('./dist'))
})

gulp.task("watch", () => {
    gulp.watch("./assets/styles/**/*.scss", ["sass"]);
    gulp.watch('./assets/js/**/*.js', ['js']);
    gulp.watch('index.html', ['html']);
});

gulp.task('build-dev', () => {
    runSequence('clean', 'html', 'sass', 'js', 'copy:fonts', 'copy:images', 'watch', 'sync', () => {
        console.log(
            `
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  ██████╗ ██╗      █████╗ ███╗   ██╗███████╗████████╗███████╗     ██████╗ ██╗   ██╗██╗
  ██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝╚══██╔══╝██╔════╝    ██╔═══██╗██║   ██║██║
  ██████╔╝██║     ███████║██╔██╗ ██║█████╗     ██║   █████╗      ██║   ██║██║   ██║██║
  ██╔═══╝ ██║     ██╔══██║██║╚██╗██║██╔══╝     ██║   ██╔══╝      ██║   ██║██║   ██║██║
  ██║     ███████╗██║  ██║██║ ╚████║███████╗   ██║   ███████╗    ╚██████╔╝╚██████╔╝██║
  ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚══════╝     ╚═════╝  ╚═════╝ ╚═╝
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  __________________
< Time to work now ! >
  ------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
                
    `
        )
    });
})

gulp.task('build', () => {
    runSequence('clean', 'sass', 'js', 'copy:fonts', 'copy:images', () => {
        console.log('Build done')
    });
})
