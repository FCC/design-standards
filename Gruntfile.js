'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Configurable paths
    var paths = {
        tmp: '.tmp',
        assets: '1.x',
        downloads: 'downloads'
    };

    grunt.initConfig({

        // Project settings
        paths: paths,
        config: { version: '1.0.0'},

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['front/scripts/{,*/}*.js', 'docs/**/*.html'],
                tasks: ['jshint', 'ssi', 'concat:mainjs']
            },
            less: {
                files: ['bootstrap-gisp/less/**/*.less', 'front/styles/**/*.less'],
                tasks: ['less', 'usebanner', 'concat:maincss', 'autoprefixer']
            }
        },

        // Clean out gen'd folders
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= paths.tmp %>',
                        '<%= paths.assets %>',
                        '<%= paths.downloads %>'
                    ]
                }]
            },
        },

        // Lint LESS
        lesslint: {
            src: ['bootstrap-gisp/less/**/*.less', 'front/styles/**/*.less'],
            options: {
                csslint: {
                    'box-model': false,
                    'adjoining-classes': false,
                    'qualified-headings': false,
                    'empty-rules': false,
                    'outline-none': false,
                    'unique-headings': false
                }
            }
        },

        // Lint JS
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'front/scripts{,*/}*.js'
            ]
        },

        // LESS -> CSS
        less: {
            options: {
                paths: ['bootstrap-gisp/less', 'bower_components'],
                compress: true,
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'bootstrap-gisp/less',
                    src: ['bootstrap-gisp.less', 'gisp-theme.less'],
                    dest: '<%= paths.downloads %>/css/',
                    ext: '.min.css'
                }, {
                    expand: true,
                    cwd: 'front/styles',
                    src: ['docs.less'],
                    dest: '<%= paths.assets %>/css',
                    ext: '.css'
                }]
                //  {
                //     expand: true,
                //     cwd: 'front/styles/appDemo',
                //     src: ['appDemo.less'],
                //     dest: '<%= paths.assets %>/styles',
                //     ext: '.min.css'
                // }
            }
        },

        // Add vendor prefixed styles to CSS
        autoprefixer: {
            options: {
                browsers: ['> 4%', 'last 4 versions']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.assets %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= paths.assets %>/styles/'
                }, {
                    expand: true,
                    cwd: '<%= paths.downloads %>/css/',
                    src: 'bootstrap-gisp.min.css',
                    dest: '<%= paths.downloads %>/css/',
                }]
            }
        },

        // Compress images
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'front/images',
                    src: '{,*/}*.{png,gif,jpeg,jpg}',
                    dest: '<%= paths.assets %>/images'
                }]
            }
        },

        // Process include files
        ssi: {
            options: {
                cache: 'all',
                ext: '.shtml',
                baseDir: './_includes'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './docs/',
                    src: ['**/*.html'],
                    dest: './1.x/docs'
                }]
            }
        },

        // Bundle JS/CSS files
        concat: {
            // bootstrap plugins
            pluginsjs: {
                src: ['bower_components/bootstrap/js/affix.js',
                    'bower_components/bootstrap/js/alert.js',
                    'bower_components/bootstrap/js/dropdown.js',
                    'bower_components/bootstrap/js/tooltip.js',
                    'bower_components/bootstrap/js/modal.js',
                    'bower_components/bootstrap/js/transition.js',
                    'bower_components/bootstrap/js/button.js',
                    'bower_components/bootstrap/js/popover.js',
                    'bower_components/bootstrap/js/carousel.js',
                    'bower_components/bootstrap/js/scrollspy.js',
                    'bower_components/bootstrap/js/collapse.js',
                    'bower_components/bootstrap/js/tab.js',
                ],
                dest: '<%= paths.assets %>/js/vendor/plugins.js'
            },
            // misc vendor
            vendorjs: {
                src: ['bower_components/jquery/dist/jquery.js',
                    // 'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.js',
                    // 'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.extensions.js',
                    // 'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.date.extensions.js',
                    // 'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.numeric.extensions.js',
                    // 'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.phone.extensions.js',
                    // 'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.regex.extensions.js',
                    // 'bower_components/select2/select2.js',
                    // 'bower_components/nouislider/distribute/jquery.nouislider.all.min.js',
                    'front/vendor/jquery-ui-1.11.1.custom/jquery-ui.js',
                    'front/vendor/prism/prism.js'
                ],
                dest: '<%= paths.assets %>/js/vendor/vendor.js'
            },
            // main js
            mainjs: {
                src: ['front/scripts/docs.js'],
                dest: '<%= paths.assets %>/js/docs.js'
            },
            // appDemo js
            // appDemojs: {
            //     src: ['front/scripts/appDemo.js'],
            //     dest: '<%= paths.assets %>/scripts/appDemo.js'
            // },
            // vendor css
            vendorcss: {
                src: [
                    'front/vendor/jquery-ui-1.11.1.custom/jquery-ui.structure.css',
                    // 'bower_components/font-awesome/css/font-awesome.css',
                    // 'bower_components/select2/select2.css',
                    // 'bower_components/nouislider/distribute/jquery.nouislider.min.css',
                    // 'bower_components/nouislider/distribute/jquery.nouislider.pips.min.css'
                ],
                dest: '<%= paths.assets %>/css/vendor.css'
            },
            // main css
            maincss: {
                src: ['<%= paths.assets %>/styles/pattern-library.css'],
                dest: '<%= paths.assets %>/styles/main.css'
            }
        },

        // Add a banner to the top of the generated LESS file.
        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: '/* FCC GISP Design Standards v<%= config.version %> | http://fcc.github.io/design-standards/ */\n\n',
                    linebreak: true
                },
                files: {
                    src: ['<%= paths.downloads %>/css/bootstrap-gisp.min.css'],
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{ // htmlshiv and matchMedia polyfill for <= IE9
                    dot: true,
                    expand: true,
                    cwd: 'front/vendor/',
                    src: ['html5shiv/*.*', 'matchMedia/*.*'],
                    dest: '<%= paths.assets %>/vendor/'
                }, { // fonts to fonts folder
                    dot: true,
                    expand: true,
                    cwd: 'bower_components/font-awesome/fonts',
                    src: '*.*',
                    dest: '<%= paths.assets %>/fonts'
                }, { // favicon sprite to assets folder
                    dot: true,
                    expand: true,
                    cwd: 'front/',
                    src: 'favicon.ico',
                    dest: '<%= paths.assets %>/'
                }, { // bootstrap-gisp src to downloads folder
                    dot: false,
                    expand: true,
                    cwd: 'bootstrap-gisp',
                    src: '**/*',
                    dest: '<%= paths.downloads %>/'
                }, { // minified css to downloads folders

                }]
            },
            release: {
                files: [{ // Do things for a full release
                    cwd: '_site/',
                    src: ['**/*', '!**/1.x/**'],
                    dest: '1.x/',
                    expand: true
                }]
            }
        },

        // Zips up src less files, images, and minified css
        zip: {
            '<%= paths.downloads %>/fcc-gisp-design-standards-<%= config.version %>.zip': ['<%= paths.downloads %>/**/*']
        },

        //Jekyll Tasks
        /*jekyll: {
            release: {
                options: {
                    config: '_config_release.yml'
                }
            }
        }*/
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'less',
        'imagemin',
        'usebanner',
        'ssi',
        'concat',
        'autoprefixer',
        'copy:dist',
        'zip'
    ]);

    // Use caution, this will overwrite files.
    //This will overwrite the 1x folder
    grunt.registerTask('doversionedrelease', [
        'clean:dist',
        'jshint',
        'less',
        'imagemin',
        'usebanner',
        'concat',
        'autoprefixer',
        'copy:dist',
        'zip',
        'jekyll:release',
        'copy:release'

    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
