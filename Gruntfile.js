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
                files: ['front/scripts/{,*/}*.js', 'docs/**/*.html','_includes/**/*.shtml'],
                tasks: ['ssi', 'copy']
            },
            less: {
                files: ['bootstrap-gisp/less/**/*.less', 'front/styles/**/*.less'],
                tasks: ['less', 'usebanner', 'autoprefixer']
            }
        },

        // Clean out gen'd folders
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= paths.tmp %>',
                        '<%= paths.assets %>'
                        // '<%= paths.downloads %>'
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
                files: [                
                {
                    expand: true,
                    cwd: 'front/styles',
                    src: ['docs.less'],
                    dest: '<%= paths.assets %>/css',
                    ext: '.css'
                }]
                
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
                }
                //  {
                //     expand: true,
                //     cwd: '<%= paths.downloads %>/css/',
                //     src: 'bootstrap-gisp.min.css',
                //     dest: '<%= paths.downloads %>/css/',
                // }
                ]
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
                    'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.js',
                    'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.extensions.js',
                    'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.date.extensions.js',
                    'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.numeric.extensions.js',
                    'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.phone.extensions.js',
                    'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.regex.extensions.js',
                    // 'bower_components/nouislider/distribute/jquery.nouislider.all.min.js',
                    'front/vendor/jquery-ui-1.11.1.custom/jquery-ui.js',
                    'front/vendor/prism/prism.js'
                ],
                dest: '<%= paths.assets %>/js/vendor/vendor.js'
            },            
            // vendor css
            vendorcss: {
                src: [
                    'front/vendor/jquery-ui-1.11.1.custom/jquery-ui.structure.css',
                    // 'bower_components/nouislider/distribute/jquery.nouislider.min.css',
                    // 'bower_components/nouislider/distribute/jquery.nouislider.pips.min.css'
                ],
                dest: '<%= paths.assets %>/css/vendor.css'
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
                    src: ['<%= paths.assets %>/css/docs.css'],
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [                
                { // fonts to fonts folder
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
                },                 
                {
                    expand: true,
                    cwd: 'front/scripts',
                    src: '*.js',
                    dest: '<%= paths.assets %>/js'
                }, {
                    expand: true,
                    cwd: 'front/images',
                    src: '**/*.*',
                    dest: '<%= paths.assets %>/images'
                }]
            },
             // Do things for a full releas
            // release: {
            //     files: [{e
            //         cwd: '_site/',
            //         src: ['**/*', '!**/1.x/**'],
            //         dest: '1.x/',
            //         expand: true
            //     }]
            // }
        }        
    });

    grunt.registerTask('build', [
        'clean:dist',
        'less',
        'usebanner',
        'ssi',
        'concat',
        'autoprefixer',
        'copy:dist'
    ]);    

    grunt.registerTask('default', [
        'build'
    ]);
};
