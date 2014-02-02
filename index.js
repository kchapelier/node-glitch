var
  fs = require('fs'),
  util = require('util'),
  stream = require('stream');

/**
 * GlitchedStream, a Transform stream to intentionally corrupt data
 * @param {Object} options
 * @constructor
 */
var GlitchedStream = function(options) {
  "use strict";
  stream.Transform.call(this, options);

  options = options || {};

  this.probability = options.probability || 0;
  this.deviation = Math.abs(options.deviation || 0);

  this.whiteList = options.whiteList || [];
  this.blackList = options.blackList || [];
  this.func = options.func;
};

util.inherits(GlitchedStream, stream.Transform);

GlitchedStream.prototype.probability = null;
GlitchedStream.prototype.deviation = null;
GlitchedStream.prototype.whiteList = null;
GlitchedStream.prototype.blackList = null;
GlitchedStream.prototype.func = null;

/**
 * Apply the deviation
 * @param {Number} value - Value
 * @returns {Number} New value
 * @private
 */
GlitchedStream.prototype.deviate = function(value) {
  "use strict";

  return value + Math.round((Math.random() * 2 - 1) * this.deviation);
};

/**
 * Transformation method
 * @param {Buffer} chunk - Binary buffer
 * @param {String} enc - Encoding
 * @param {Function} callback - Callback
 * @private
 */
GlitchedStream.prototype._transform = function(chunk, enc, callback) {
  "use strict";

  var deviate = this.func || this.deviate.bind(this);

  for(var i = 0, l = chunk.length; i < l; i++) {
    var currentValue = chunk[i];

    if(this.whiteList.length > 0 && this.whiteList.indexOf(currentValue) < 0) {
      continue;
    }

    if(this.blackList.length > 0 && this.blackList.indexOf(currentValue) >= 0) {
      continue;
    }

    if(Math.random() >= this.probability) {
      continue;
    }

    chunk[i] = Math.max(0, Math.min(255, deviate(currentValue, this.deviation)));
  }

  this.push(chunk);
  callback();
};

/**
 * Read the content of a file, corrupt it and write it into another file
 * @param {String} fileSrc - Path of the source file
 * @param {String} fileDst - Path of the destination file
 * @param {Number} probability - Probability of deviation per byte (between 0 and 1)
 * @param {Number} deviation - Maximum value difference between each byte of the source and of the destination
 * @param {Number} mode
 */
var glitch = function(fileSrc, fileDst, probability, deviation, mode) {
  "use strict";
  var rstream = fs.createReadStream(fileSrc);
  var woptions = mode ? { 'mode' : mode } : {};
  var wstream = fs.createWriteStream(fileDst, woptions);
  var gstream = new GlitchedStream({
    'probability' : probability,
    'deviation' : deviation
  });

  rstream.pipe(gstream).pipe(wstream);
};

glitch.GlitchedStream = GlitchedStream;
module.exports = glitch;