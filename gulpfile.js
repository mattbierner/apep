var babel = require("gulp-babel");
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var plumber = require('gulp-plumber');

gulp.task("default", () =>
    gulp.src("src/*.js")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./")));

gulp.task("tests", () =>
    gulp.src("tests_src/*.js")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./tests")));

gulp.watch('src/*.js', ['default']);
gulp.watch('tests_src/*.js', ['tests']);

