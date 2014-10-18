<div style="text-align:center"><img src="https://www.loadso.me/static/assets/images/logo.png"></div>

# grunt-loadsome
[![NPM version](https://nodei.co/npm/grunt-loadsome.png?compact=true)](https://nodei.co/npm/grunt-loadsome/) [![Build Status](https://travis-ci.org/eikaramba/grunt-loadsome.svg)](https://travis-ci.org/eikaramba/grunt-loadsome) [![dependencies](https://david-dm.org/eikaramba/grunt-loadsome.png)](https://david-dm.org/eikaramba/grunt-loadsome)

> Replaces references of [loadso.me](https://loadso.me) to their downloaded and concenated local counterparts

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-loadsome --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('loadsome');
```

## The "loadsome" task

### Overview
In your project's Gruntfile, add a section named `loadsome` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  loadsome: {
    options: {
      encoding,
      mode:false,
    },
    your_target: {
      files: [{
            expand: true,
            downloadPath:".tmp",
            cwd: 'path/to/your/sources',
            src: ['*.html','someother.file'],
            dest: 'path/to/output'
          }]
    },
  },
})
```

### Options

#### mode
Type: `Boolean` or `Number`  
Default: `false`

Whether to copy or set the existing file permissions. Set to `true` to copy the existing file permissions. Or set to the mode, i.e.: `0644`, that copied files will be set to.

#### encoding
Type: `String`  
Default: `grunt.file.defaultEncoding`

The file encoding to copy files with.

#### downloadPath
Type: `String`
Default value: `assets`

Path to the folder, where all the ressources should be downloaded to. This folder should be accessible from your html files, so that the link references inside the html files can point to this new location.

#### cwd
Type: `String`
Default value: `/`

This is the root directory from where the input files (via src) and the output files(via dest) are beeing searched.


#### dest
Type: `String`
Default value: `dest`

All the transformed files are copied to this folder. The path structures to your input files are preserved, so if you have `['example.html,sub/directory/example2.html']` as the input files, and `output` as your destination folder, the script will output a `example.html` in the root folder as well as one at `sub/directory/example2.html`.



### Usage Examples

#### Default Options
The following example shows a basic replacement for your html files. In this case the loadso.me references inside your regular html files are just replaced with downloaded local assets, that are to be found in `.tmp`

```js
grunt.initConfig({
  loadsome: {
    options: {},
    files: [{
            downloadPath:".tmp",
            src: 'client/*.html',
            dest: 'client/'
          }],
  },
})
```

## Contributing
Feel free to contribute to this project or just post bugreports as well as suggestions for improvement. Sorry that test cases are missing, they're coming.

## Release History
_1.0.0_ Public Release

## License
Copyright (c) 2014 Eike Thies. Licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/grunt-loadsome
[npm-image]: https://badge.fury.io/js/grunt-loadsome.png

[travis-url]: http://travis-ci.org/eikaramba/grunt-loadsome
[travis-image]: https://secure.travis-ci.org/eikaramba/grunt-loadsome.png?branch=master

[coveralls-url]: https://coveralls.io/r/eikaramba/grunt-loadsome
[coveralls-image]: https://coveralls.io/repos/eikaramba/grunt-loadsome/badge.png

[depstat-url]: https://david-dm.org/eikaramba/grunt-loadsome
[depstat-image]: https://david-dm.org/eikaramba/grunt-loadsome.png
