var gulp = require('gulp');

// var browserSync = require('browser-sync');// odpalanie skryptu w  przegladarce
// var reload = browserSync.reload;// odswierzanie odpalonej w przegladarce strony po wprowadzeniu zmian w plikach
var connect = require('gulp-connect');// odpalanie skryptu w  przegladarce - mniej obciaza niz powyzszy browser-sync

var watch = require('gulp-watch');

// var minifyHTML = require('gulp-minify-html'); // minifikacja html

// var concat = require('gulp-concat');// konkatenacja - podawane sa pliki do polaczenia, nazwa skonkatenowanego pliku i jego lokalizacja 
var useref = require('gulp-useref');// konkatenacja - koniecznosc wstawiania blokow w html, ktore wskazuja na pliki do konkatenacji

var jshint = require('gulp-jshint');// sprawdzanie błędów w js
var stylish = require('jshint-stylish');



// var mainBowerFiles = require("main-bower-files");// dołączenie glównych plików z "bower_components"
var uglify = require('gulp-uglify');// minifikacja jsów

var sass = require('gulp-sass');// sass->css
var autoprefixer = require('gulp-autoprefixer');// dodawanie autoprefixerów
var cssmin = require('gulp-cssmin');// minifikacja cssów
// var urlAdjuster = require('gulp-css-url-adjuster');// zmiana sciezki do obrazkow w css

var imagemin = require('gulp-imagemin');// minifikacja obrazków

// var debug = require('gulp-debug');
// var merge = require('gulp-merge');
// var plumber = require('gulp-plumber');// nie zatrzymuje działania choć napotka na bląd
 
var config = {
    paths: {
        html: {
            src:  ['src/**/*.html']
        },
        javascript: {
            src:  ['src/js/**/*.js'],
            dest: 'src/js'
        },
        scss: {
            src: ['src/scss/**/*.scss'],
            dest: 'src/css'
        },
        images: {
            src: ['src/img/**/*'],
            dest: 'dist/img'
        }
    }
};

gulp.task('connect', function() {
  connect.server({
    root: 'src',// wskazanie lokalizacji, z ktorej odpalana jest strona na http://localhost:8080/ (localhost trzeba wpisać do przegladarki)
    livereload: true// dodanie w tasku '.pipe(connect.reload())' automatycznie odswiezy strone po wprowadzeniu zmiany
  });
});

gulp.task('style', function(){
  return gulp.src(config.paths.scss.src)
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))

    .pipe(gulp.dest(config.paths.scss.dest));
    // .pipe(connect.reload());// wywolanie przeladowania strony w przegladarce 
});

gulp.task('lint', function() {
  return gulp.src(config.paths.javascript.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(connect.reload());// wywolanie przeladowania strony w przegladarce 
});

gulp.task('watch', function () {
  gulp.watch(config.paths.html.src, ['html']);
  gulp.watch(config.paths.scss.src, ['style']);
  gulp.watch(config.paths.javascript.src, ['lint']);
});

gulp.task('html', function(){
   return gulp.src(config.paths.html.src)
     .pipe(connect.reload());// wpiywolanie przeladowania strony w przegladarce 
});

gulp.task('index', function () {
  var assets = useref.assets();
  
  return gulp.src(config.paths.html.src)
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function(){
  return gulp.src('dist/css/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function(){
  return gulp.src('dist/js/*.js')
    .pipe(cssmin())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('img', function () {
  return gulp.src(config.paths.images.src)
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(config.paths.images.dest));
});




gulp.task('default', ['connect', 'style', 'lint', 'watch']);
gulp.task('project', ['index', 'css', 'js', 'img']);



