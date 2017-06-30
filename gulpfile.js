const gulp = require('gulp');
const wrap = require("gulp-wrap-function");
const rename = require('gulp-rename');
const ghPages = require('gulp-gh-pages');

// not gulp plugins
const path = require('path');
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
	    .pipe(gulp.dest('dist/posts'));
});

gulp.task('deploy', function() {
    return gulp.src('dist/**/*')
        .pipe(ghPages({
        	branch: 'main'
        }));
});


gulp.task('watch', function(){
	gulp.watch(['templates/*.*','articles/*.md'], ['build']);
});

gulp.task('build', ['md2html'])

gulp.task('default', ['build', 'deploy']);


