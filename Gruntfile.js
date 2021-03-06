var DOC_ROOT = 'example';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  grunt.initConfig({
    docRoot: DOC_ROOT,
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true
      },
      beforeuglify: ['<%= pkg.name %>.js'],
      gruntfile: ['Gruntfile.js']
    },
    uglify: {
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      },
      options: {
        mangle: true,
        compress: {},
        banner: 
          '/*! <%= pkg.name %>\n' + 
          'version: <%= pkg.version %>\n' +
          'build date: <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
          'author: <%= pkg.author %>\n' + 
          '<%= pkg.repository.url %> */\n'
      }
    },
    copy: {
      example: {
        src: '<%= pkg.name %>.js',
        dest: '<%= docRoot %>/lib/<%= pkg.name %>.js'
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
      },
      src: {
        files: '<%= pkg.name %>.js',
        tasks: ['newer:jshint:beforeuglify', 'copy:example'],
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= pkg.name %>.js',
          '<%= docRoot %>/{,**/}*.{html,js,css}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, DOC_ROOT),
              connect.directory(DOC_ROOT)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('example', ['connect:livereload', 'open', 'watch']);

  grunt.registerTask('default', ['jshint:beforeuglify', 'uglify']);
};

