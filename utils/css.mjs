import gulp from "gulp";
import rename from "gulp-rename";
import postcss from "gulp-postcss";

const PCSS_DEST = "./";
const PCSS_SRC = "pcss/illior.pcss";
const PCSS_WATCH = ["pcss/*.pcss"];

/**
 * Compile the PostCSS sources into a single CSS file.
 *
 * @returns {NodeJS.ReadWriteStream} The compiled CSS stream.
 */
function compilePCSS() {
  return gulp
    .src(PCSS_SRC)
    .pipe(postcss())
    .pipe(rename({ extname: ".css" }))
    .pipe(gulp.dest(PCSS_DEST));
}

export const compile = compilePCSS;

/**
 * Update the CSS if any of the PostCSS sources are modified.
 */
export function watchUpdates() {
  gulp.watch(PCSS_WATCH, compile);
}
