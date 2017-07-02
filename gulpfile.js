const gulp = require('gulp');
const wrap = require("gulp-wrap-function");
const rename = require('gulp-rename');
const ghPages = require('gulp-gh-pages');
const useref = require('gulp-useref');
const revAll = require('gulp-rev-all');
const runSequence = require('run-sequence');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const minifyCss = require('gulp-clean-css');

// not gulp plugins
const path = require('path');
const del = require('del');
const marked = require('marked');

const dot = require('dot');
dot.templateSettings.strip = false;


gulp.task('md2html', function(){
	let dots = dot.process({path: "./templates"});
	
	let convertMarkdown = function(md){
		return marked(md).trim();
	};

	let compilePage = function(html){
		return dots.page({
			body: html
		});
	};
	
	return gulp.src('articles/*.md')
		.pipe(wrap(convertMarkdown))
		.pipe(wrap(compilePage))
		.pipe(rename(function(file) {
			file.dirname = path.join(file.dirname, file.basename);
			file.basename = 'index';
			file.extname = '.html';
	    }))
	    .pipe(gulp.dest('dev/posts'));
});

gulp.task('copyAssets2Dev', function(){
	return gulp.src('assets/**')
		.pipe(gulp.dest('dev/assets'));
});

gulp.task('dev', function(callback){
	runSequence('clear', ['md2html','copyAssets2Dev'], callback);
});

gulp.task('clear', function(){
	return del(['dev','dist']);
});

gulp.task('release', ['dev'], function(){
	return gulp.src('dev/**')
        .pipe(gulpif('*.html', useref()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(revAll.revision({     
        	dontGlobal: ['/favicon.*'],
            dontRenameFile: ['.html']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['release'], function() {
    return gulp.src('dist/**')
        .pipe(ghPages({
        	branch: 'master'
        }));
});

gulp.task('default', ['deploy']);


