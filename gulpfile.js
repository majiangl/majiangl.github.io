var gulp = require('gulp');
var wrap = require("gulp-wrap-function");
var rename = require('gulp-rename');

// not gulp plugins
var path = require('path');
var marked = require('marked');

var dot = require('dot');
dot.templateSettings.strip = false;


gulp.task('md2html', function(){
	var dots = dot.process({path: "./templates"});
	
	var convertMarkdown = function(md){
		return marked(md).trim();
	};

	var compilePage = function(html){
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


gulp.task('watch', function(){
	gulp.watch(['templates/*.*','articles/*.md'], ['build']);
});

gulp.task('build', ['md2html'])

gulp.task('default', ['build']);


