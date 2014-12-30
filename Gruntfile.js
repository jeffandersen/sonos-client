var grunt = require('grunt');

grunt.initConfig({
  jshint: {
    all: [
      'Gruntfile.js',
      'lib/**/*.js',
      'index.js'
    ]
  },
  uglify: {
    bundle: {
      files: {
        'bundle/sonos.min.js': ['bundle/sonos.js']
      }
    }
  },
  browserify: {
    dev: {
      options: {
        browserifyOptions: {
          debug: true
        }
      },
      files: {
        'bundle/sonos.js': 'index.js'
      }
    },
    release: {
      files: {
        'bundle/sonos.js': 'index.js'
      }
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-contrib-jshint');

grunt.registerTask('default', ['jshint', 'browserify:release', 'uglify']);
grunt.registerTask('build', ['browserify:dev', 'uglify']);
