"use strict";
var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var tsProject = ts.createProject("tsconfig.json");
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// task to clean all files in lib (which is out folder for containing all javascripts)
gulp.task("clean:lib", function () {
    return del(['lib/**/*']);
});

// task to build(transpile) all typescripts into javascripts in lib folder
gulp.task("tsc", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("lib"));
});

// adding default tasks as clean and build
gulp.task('default', ['clean:lib', 'tsc'], function () {});


// another tutorial test
  
// gulp.task('watch', ['scripts'], () => {
//     gulp.watch('src/**/*.ts', ['scripts']);
// });

// gulp.task('assets', function () {
//     return gulp.src(JSON_FILES)
//         .pipe(gulp.dest('dist'));
// });

// gulp.task('default2', ['watch', 'assets']);