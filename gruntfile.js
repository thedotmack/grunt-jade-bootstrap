module.exports = function(grunt) {
 
    // Dynamically loads all required grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                compress: true,
                preserveComments: 'some',
                sourceMap: false,
            },
            js: {
                files: {
                    'build/assets/js/main.min.js': ['assets/js/main.js']
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'assets/js/main.js']
        },
        less: {
            options: {
                sourceMap: false,
                paths: ["build/assets/css"],
                plugins: [
                    new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                    new (require('less-plugin-clean-css'))()
                ],                
            },
            css: {
                files: {
                    'build/assets/css/main.min.css': 'assets/less/main.less'
                }
            }
        },
        imagemin: {                                // Task
            dynamic: {                             // Another target
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'assets/images/',         // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'build/assets/images/'    // Destination path prefix
                }]
            }
        },        
        jade: {
            dist: {
                files: [{
                    expand  : true, 
                    cwd     : 'layouts', 
                    src     : ['**/*.jade'], 
                    dest    : 'build',
                    ext     : '.html'
                }]
            }
        },
        copy: {
          assets: {
            files: [{
                expand  : true, 
                cwd     : 'assets/images/', 
                src     : ['**/*.jpg','**/*.png','**/*.gif','**/*.svg'], 
                dest    : 'build/assets/images/'
            }]
          }
        },
		watch: {
			build: {
				files: [
					'gruntfile.js',
				],
				tasks: ['build'],
				options: {
					livereload: true
				}
			},
            js: {
                files: [ 'assets/js/*.js' ],
                tasks: [ 'uglify:js', 'jshint:all' ],
                options: {
                    livereload: true
                }
            },
            css: {
                files: [ 'assets/less/*.less' ],
                tasks: [ 'less' ],
                options: {
                    livereload: true
                }
            },
            images: {
                files: [ 
                    'assets/images/*.png',
                    'assets/images/*.jpg',
                    'assets/images/*.gif',
                    'assets/images/*.svg' 
                ],
                tasks: [ 'newer:imagemin:dynamic', 'copy' ],
                options: {
                    livereload: true
                }
            },
            jade: {
                files: [ 'layouts/*.jade' ],
                tasks: [ 'jade' ],
                options: {
                    livereload: true
                }
            }
		},
        open: {
          server: {
            url: 'http://<%= connect.options.url %>:<%= connect.options.port %>'
          }
        },
        connect: {
            livereload: {
                options: {
                    open: true,
                    base: [
                        'build'
                    ]
                }
            }
        }
   	});

    grunt.registerTask('default', [
        'build',
        'connect',
        'watch'
    ]);

    grunt.registerTask('build', [
        'less',
        'jshint',
        'uglify',
        'newer:imagemin:dynamic',
        'copy',
        'jade',
    ]);

};