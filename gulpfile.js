const {src, dest, series, watch, parallel} = require('gulp')
const scss = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat')
const connect = require('gulp-connect');


const appPath = {
    scss: './app/scss/**/*.scss',
    js: './app/js/*.js',
    img: [
        './app/images/**/*.jpg',
        './app/images/**/*.png',
        './app/images/**/*.svg',
    ]
}
const destPath = {
    webfonts:'./dist/webfonts/',
    css: './dist/css/',
    js: './dist/js/',
    img: './dist/images/'
}

const jsPath = [
    './app/js/script.js'
]


function imageMin() {
    return src(appPath.img)
        .pipe(imagemin())
        .pipe(dest(destPath.img))
        .pipe(connect.reload())
}

function scssCompress() {
    return src(appPath.scss)
        .pipe(scss({
            outputStyle: 'compressed'
        }))
        .pipe(dest(destPath.css))
        .pipe(connect.reload())
}
function icons(){
    return src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(dest(destPath.webfonts))
        .pipe(connect.reload())
}

function copyHtml() {
    return src('./app/*.html')
        .pipe(dest('./dist/'))
        .pipe(connect.reload())
}

function jsMin() {
    return src(jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest(destPath.js))
        .pipe(connect.reload());

}

function server() {
    connect.server({
        name: 'Dev App',
        root: 'dist',
        port: 8080,
        livereload: true
    })
}

function watchCode() {
    watch('app/*.html', copyHtml);
    watch(appPath.scss, scssCompress);
    watch(appPath.js, jsMin);
    watch(appPath.img, {events: 'add'}, imageMin);
}

exports.build = series(copyHtml, imageMin, jsMin,icons, scssCompress)
exports.default = series(copyHtml, imageMin, jsMin, scssCompress, icons, parallel(server, watchCode))
