const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// Пути к файлам
const paths = {
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**/*.{jpg,jpeg,png,svg,gif}',
        dest: 'dist/img/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    includes: {
        src: 'src/include/**/*.html',
        dest: 'dist/'
    },
    components: {
        src: 'src/components/**/*.html',
        dest: 'dist/'
    },
    fonts: {
        src: 'src/fonts/**/*',
        dest: 'dist/fonts/'
    }
};

// Компиляция SCSS в CSS
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Обработка и минификация JavaScript
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Минификация HTML и включение компонентов
function html() {
    return gulp.src(['src/base.html'])
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// Перемещение шрифтов
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream());
}

// Перемещение изображений
function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}

// Наблюдение за изменениями файлов и запуск BrowserSync
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch([paths.html.src, paths.includes.src, paths.components.src], html).on('change', browserSync.reload);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.images.src, images);
}

// Определение задач Gulp
const build = gulp.series(gulp.parallel(styles, scripts, html, fonts, images), watchFiles);

// Экспорт задач
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.fonts = fonts;
exports.images = images;
exports.watch = watchFiles;
exports.build = build;
exports.default = build;
