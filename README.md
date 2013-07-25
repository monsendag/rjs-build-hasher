# rjs-build-hasher [![Build Status](https://secure.travis-ci.org/monsendag/rjs-build-hasher.png?branch=master)](http://travis-ci.org/monsendag/rjs-build-hasher)

Append hashes to bundles built by require.js optimizer. Very influenced by [rjs-build-analysis](https://github.com/iammerrick/rjs-build-analysis) by Merrick Christensen.

## Installation

	npm install --save rjs-build-hasher

## Documentation

Options: 

removeOld: 



## Examples

**Used with grunt-contrib-requirejs **

```javascript
grunt.initConfig({
	requirejs: {
		compile: {
			options: {		
				done: function (done, output) {
				
					require('rjs-build-hasher')(output, {
						removeOld: true
					});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
See HISTORY.md


## License
Copyright (c) 2013 Dag Einar Monsen. Licensed under the MIT license.
