/*
 * loadsome
 * https://loadso.me
 *
 * Copyright (c) 2014 Eike Thies
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/.tmp']
    },
    nodeunit: {
      all: ['test/*.js']
    },
    // Configuration to be run (and then tested).
    loadsome: {
      custom_options: {
        options: {
          mode:false
        },
        files: [{
            expand: true,
            downloadPath:"test/.tmp",
            cwd: 'test/fixtures',
            src: ['testing.html','testing2.html'],
            dest: 'test/output'
          }]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('build', ['clean', 'loadsome']);

  // By default, lint and run all tests.
  grunt.registerTask('test', ['jshint','nodeunit']);

};
