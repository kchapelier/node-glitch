# glitch

Glitched stream for intentional data corruption.

## install

With [npm](http://npmjs.org) do:

```
npm install glitch
```

## API reference

### glitch(fileSrc, fileDst, probability, deviation, mode)

* fileSrc : Source file.
* fileDst : Destination file.
* probability : Probability of deviation per byte (between 0 and 1).
* deviation : Maximum value deviation per byte.
* mode : File mode

### new glitch.GlitchedStream(options);

Transform stream implementation.

Options :

* probability : Probability of deviation per byte (between 0 and 1).
* deviation : Maximum value deviation per byte.
* whiteList : Array of whitelisted values, if set only bytes with those values will be modified.
* blackList : Array of blacklisted values, no byte with those values will be modified.
* deviationFunction : Replace the default deviation function of the stream, allows to write more complex filtering than whitelisting and blacklisting

## Examples

```js
var glitch = require('glitch');
glitch('test.jpg', 'test.glitched.jpg', 0.0001, 2, 0777);
```

Copy a glitched version of test.jpg as test.glitched.jpg where each byte has probability of 1/10000 of having its value modified by a maximum of 2.

```js
var GlitchedStream = require('glitch').GlitchedStream;
var gstream = new GlitchedStream({
  'deviation' : 1,
  'probability' : 1,
  'whiteList' : [0xcc,0xcd,0xce,0xcf]
});
someMidiStream.pipe(gstream).pipe(someMidiReceiver);
```

Pipe a midi stream into a glitched stream which will modify every bytes matching the whitelist by a maximum value of 1 before piping it into midiReceiver.

## Potential use case

* Glitching text files and images (though you'll end up with a lot of totally unreadable files).
* Testing applications or libraries against failure.
* Celebrating april's fool day at the expense of a grunt/gulp user.

## License

MIT