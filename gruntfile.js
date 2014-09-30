module.exports = function(grunt) {
 
    // Dynamically loads all required grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		todo: {
			options: {
				marks: [
				{
					name: "FIX",
					pattern: /FIX/,
					color: "red"
				},
				{
					name: "TODO",
					pattern: /TODO/,
					color: "magenta"
				},
				{
					name: "NOTE",
					pattern: /NOTE/,
					color: "yellow"
				}
				],
			},
			src: ['assets/less/**/*.less']
		},
        jshint: {
            all: ['Gruntfile.js', 'assets/js/main.js']
        },		
        // To use TinyPNG, get an API key from https://tinypng.com/developers
        // Don't forget to uncomment the task at the bottom of this file
        tinypng: {
            options: {
                apiKey: 'INSERT_YOUR_API_KEY_HERE', // rogExNnK0ONyPnlJ33LQJSfaNwP15zFO
                checkSigs: true,
                sigFile: 'assets/images/file_sigs.json',
                summarize: true,
                showProgress: true
            },
            compress: {
                src: '*.png',
                cwd: 'assets/images/',
                dest: 'assets/images/',
                expand: true
            }
        },
		uglify: {
			options: {
				mangle: false,
                beautify: false, // set true for readable JS
				compress: {
					drop_console: false
				}
			},
			js: {
				files: {
					'build/assets/js/main.min.js': 
					[
						'bower_components/jquery/dist/jquery.min.js',
						'bower_components/bootstrap/dist/js/bootstrap.min.js',
						'assets/js/main.js'
					]
				}
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
        less: {
            options: {
                compress: true,
                yuicompress: true,
                optimization: 2,
                sourceMap: true,
            },
            style: {
                files: {
                    'build/assets/css/main.min.css': 'assets/less/main.less',
                }
            }
        },
		autoprefixer: {
			options: {
				map: true
			},
			// prefix the specified file
			main: {
				options: {
					// Target-specific options go here.
				},
				src:  'build/assets/css/main.min.css',
				dest: 'build/assets/css/main.min.css'
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
				tasks: ['todo','tinypng','copy','less:style','autoprefixer','uglify:js','jade'],
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
                tasks: [ 'less:style', 'autoprefixer:main' ],
                options: {
                    livereload: true
                }
            },
            png: {
                files: [ 'assets/images/*.png' ],
                tasks: [ 'tinypng', 'copy' ],
                options: {
                    livereload: true
                }
            },
            images: {
                files: [ 'assets/images/*.jpg','assets/images/*.gif','assets/images/*.svg' ],
                tasks: [ 'copy' ],
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
            options: {
                keepalive: true
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        'build'
                    ]
                }
            }
        },
        concurrent: {
          dev: {
            tasks: [ 'connect', 'watch' ],
            options: {
              logConcurrentOutput: true
            }
          }
        },
   	});

    // Compiles LESS/JS and checks for todos
    grunt.registerTask('default', [
        'less',
        'autoprefixer',
        'jshint',
        'uglify',
        'todo',
        'jade'
    ]);

    grunt.registerTask( 'server', [ 'build', 'concurrent' ]);
    grunt.registerTask( 'build', ['todo','tinypng','copy','less:style','autoprefixer','uglify:js','jade']);

};