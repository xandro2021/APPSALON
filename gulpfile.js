// gulpfile.js (ESM, Gulp 5)

import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

import { src, dest, watch, series, parallel } from 'gulp';
import * as dartSass from 'sass';

import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import terser from "gulp-terser";
import rename from "gulp-rename";
import sharp from 'sharp';
import concat from "gulp-concat";

const sass = gulpSass(dartSass);

// Rutas
const paths = {
  scss: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
  images: "src/img/**/*.{png,jpg,jpeg,svg,gif}",
};

// Compilar SCSS → CSS
export function css() {
  return src(paths.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./public/build/css", { sourcemaps: "." }));
}

// Minificar JS
// export function js() {
//   return src(paths.js)
//     .pipe(terser())
//     .pipe(rename({ suffix: ".min" }))
//     .pipe(dest("build/js", { sourcemaps: "." }));
// }
export function js() {
  return src([
    "src/js/modernizr.js",
    "src/js/**/*.js"
  ])
    .pipe(concat("bundle.js"))
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./public/build/js", { sourcemaps: "." }));
}

export async function imagenes(done) {
  const srcDir = './src/img';
  const buildDir = './public/build/img';
  // const images =  await glob('./src/img/**/*{jpg,png}')
  const images = await glob('./src/img/**/*')

  images.forEach(file => {
    const relativePath = path.relative(srcDir, path.dirname(file));
    const outputSubDir = path.join(buildDir, relativePath);
    procesarImagenes(file, outputSubDir);
  });
  done();
}

function procesarImagenes(file, outputSubDir) {
  if (!fs.existsSync(outputSubDir)) {
    fs.mkdirSync(outputSubDir, { recursive: true })
  }
  const baseName = path.basename(file, path.extname(file))
  const extName = path.extname(file)

  if (extName.toLowerCase() === '.svg') {
    // If it's an SVG file, move it to the output directory
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
    fs.copyFileSync(file, outputFile);
  } else {
    // For other image formats, process them with sharp
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);

    const options = { quality: 80 };

    sharp(file).jpeg(options).toFile(outputFile);
    sharp(file).webp(options).toFile(outputFileWebp);
    sharp(file).avif().toFile(outputFileAvif);
  }
}

// Vigilar cambios
export function dev() {
  watch(paths.scss, css);
  watch(paths.js, js);
  watch(paths.images, imagenes);
}

// Tareas disponibles
export const build = series(parallel(css, js, imagenes));
export default series(build, dev);
