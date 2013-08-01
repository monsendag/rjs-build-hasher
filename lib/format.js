/**
 * Formats a filename string
 * @param str
 * @param basename
 * @param ext
 * @param hash
 * @returns string
 */
module.exports = function format(str, basename, ext, hash) {
  return str.replace(/{base}/g, basename)
    .replace(/{ext}/g, ext)
    .replace(/{hash}/g, hash);
};