module.exports = function(grunt) {
  
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', './**.js', './test/**.js', './utils/**.js'],
      options: {
        globals: {
          jquery: true,
          console: true,
          module: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'jasmine']
    }
  });

  grunt.registerTask('default', ['watch']);          // run with 'grunt'
  grunt.registerTask('test', ['jshint', 'jasmine']); // run with 'grunt test'
};