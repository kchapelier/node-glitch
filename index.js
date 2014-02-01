var
	fs = require('fs'),
	util = require('util'),
	stream = require('stream');

var GlitchedStream = function(options) {
	stream.Transform.call(this, options);
	
	this.frequency = Math.max(options.frequency || 60, 1);
	this.deviation = Math.max(options.deviation || 30, 1);
};

util.inherits(GlitchedStream, stream.Transform);

GlitchedStream.prototype.deviate = function(value) {
	var newVal = Math.max(0, Math.min(255, value + Math.floor((Math.random() - 0.5) * this.deviation)));
	return newVal
};

GlitchedStream.prototype._transform = function(chunk, enc, callback) {
	for(var i = 0, l = chunk.length; i < l; i++) {
		if(chunk[i] === 0xff && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
		
		if(chunk[i] === 0x0f && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
		
		if(chunk[i] === 0xc0 && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
		
		if(chunk[i] === 0xee && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
		
		if(chunk[i] === 0xe2 && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
		if(chunk[i] === 0xe1 && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
		
		if(chunk[i] === 0xe0 && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
		
		if(chunk[i] === 0x2f && Math.random() * this.frequency > this.frequency - 1) {
			chunk[i] = this.deviate(chunk[i]);
		}
	}
	
	this.push(chunk);
	callback();
};

//TODO clear all hardcoded values
//TODO should try to catch the errors or let the user deal with it ?

var glitch = function(file, num, frequency, deviation, extension) {
	var rstream = fs.createReadStream(file);
	var wstream = fs.createWriteStream('output/test.' +  num + '.' + extension, { 'mode' : 0777 });
	var gstream = new GlitchedStream({
		'frequency' : frequency,
		'deviation' : deviation
	});
	
	rstream.pipe(gstream).pipe(wstream);
};

glitch.GlitchedStream = GlitchedStream;
module.exports = glitch;