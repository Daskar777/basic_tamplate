// Определяем переменную "preprocessor"
let preprocessor = 'sass';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require("gulp-babel");
const browserSync = require('browser-sync').create();
const { src, dest, parallel, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');



// настройка роботи browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'app/' }, // Вказуємо папку сервера
		notify: false, // відключаємо повідомлення
		online: true // режим роботи true або false
	})
}

// слідкування за змінами в файлах
function startwatch() { 
	watch('app/**/*.sass', styles); // слідкуємо за sass файлами, при зміні запускаємо функцію styles()
	watch('app/js/*.js', babelGo); // слідкуємо за js файлами, при зміні запуск function babelGo()
	watch('app/**/*.html').on('change', browserSync.reload); // слідкуєм за всіма html файлами , перезавантажуэмо сторінку після зміни.	
}

//компіляція JavaScript коду  до старіших стандартів EcmaScript
function babelGo() {
	return gulp.src('app/js/main.js')//беремо main.js
    .pipe(babel({presets: ["@babel/preset-env"]}))//компіляція в старіші версії Ecma Script
    .pipe(gulp.dest('app/jsOld/'))	//вигружаємо результат в папку "jsOld/"
	.pipe(browserSync.stream()) 	// звертаємось до browserSync для перезапуску сторінки
}

//
function styles() {
	return src('app/sass/main.sass') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
	.pipe(eval('sass')()) // 
	.pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
	.pipe(dest('app/')) 		// вигружаємо результат в папку "app/"
	.pipe(browserSync.stream()) // звертаємось до browserSync для перезапуску сторінки
}

exports.default = parallel(styles, browsersync, startwatch); // вішаємо функції на базовий таск "gulp"