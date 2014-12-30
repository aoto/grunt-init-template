/**
 * grunt boilerplate
 */

var LIVERELOAD_PORT = 35729;

"use strict";
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: grunt.file.readJSON('config.json'), // config

    /**
     * 清理目录
     */
    clean: {
      options: {
        force: true
      },
      dev: ['_build'],
      build: ['build']
    },

    /**
     * js，css，html格式化
     */
    jsbeautifier: {
      files: ['<%= config.jsdir %>/**/*.js', 'Gruntfile.js'],
      options: {
        js: {
          fileTypes: ['.js'],
          indentSize: 2
        },
        html: {
          fileTypes: ['.html'],
          indentSize: 2
        }
      }
    },

    validation: {
      options: {
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
        reset: true,
        relaxerror: [
          'Section lacks heading. Consider using h2-h6 elements to add identifying headings to all sections.',
          'Bad value tpl for attribute type on element script: Subtype missing.',
          'Element dl is missing a required instance of child element dd.',
          'Element head is missing a required instance of child element title.'
        ]
      },
      files: {
        src: ['<%= config.tpldir %>/**/*.html']
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 8",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6"
        ]
      },
      css: {
        options: {
          map: true,
          diff: true
        },
        src: '_build/css/*.css'
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      css: [
        '_build/css/*.css'
      ]
    },

    /**
     * js语法检查
     */
    jshint: {
      options: {
        jshintrc: true,
        ignores: ['<%= config.jsdir %>/lib/*.js', '<%= config.jsdir %>/plugin/*.js']
          //reporterOutput: 'jshint.txt' 如果要输出文件
      },
      files: {
        src: ['<%= config.jsdir %>/**/*.js', 'Gruntfile.js']
      }
    },

    /**
     * less
     */
    /*less: {
      options: {
        sourceMap: true,
        outputSourceFiles: true,
        sourceMapURL: '<%= pkg.name %>.css.map',
        sourceMapFilename: '_build/css/<%= pkg.name %>.css.map'
      },
      compile: {
        src: '<%= config.lessdir %>/<%= pkg.name %>.less',
        dest: '_build/css/<%= pkg.name %>.css'
      }
    },*/

    /**
     * sass
     */
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '_build/css/common.css': '<%= config.sassdir %>/common.scss',
          '_build/css/<%= pkg.name %>.css': '<%= config.sassdir %>/<%= pkg.name %>.scss'
        }
      }
    },

    sprite: {
      icons: {
        src: '<%= config.imgdir %>/sprites/*.png',
        dest: '_build/images/icons-sprite.png',
        destCss: '_build/css/icons-sprite.css'
      }
    },

    /**
     * 拷贝图片
     */
    copy: {
      images: {
        expand: true,
        cwd: '<%= config.imgdir %>/',
        src: ['**', '!sprites/**'],
        dest: '_build/images/'
      }
    },

    imagemin: {
      images: {
        files: [{
          expand: true,
          cwd: '_build/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'build/images/'
        }]
      }
    },

    /**
     * css,js合并
     */
    concat: {
      options: {
        sourceMap: true
      },
      //如果没用less,sass等预编译CSS，则需要下面的目录
      //common_css: {
      //  src: ['<%= config.cssdir %>/global/*.css'],
      //  dest: '_build/css/common.css'
      //},
      //page_css: {
      //  src: '<%= config.cssdir %>/global/*.css','<%= config.cssdir %>/module/*.css','<%= config.cssdir %>/page/*.css'],
      //  dest: '_build/css/<%= pkg.name %>.css'
      //},
      common_js: {
        src: ['<%= config.jsdir %>/lib/*.js', '<%= config.jsdir %>/plugin/*.js'],
        dest: '_build/js/common.js'
      },
      page_js: {
        src: ['<%= config.jsdir %>/config/*.js', '<%= config.jsdir %>/util/*.js', '<%= config.jsdir %>/module/*.js', '<%= config.jsdir %>/page/*.js'],
        dest: '_build/js/<%= pkg.name %>.js'
      }
    },

    /**
     * css合并压缩
     */
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */'
      },
      common_css: {
        src: ['_build/css/common.css'],
        dest: 'build/css/common.css'
      },
      page_css: {
        src: ['_build/css/<%= pkg.name %>.css'],
        dest: 'build/css/<%= pkg.name %>.css'
      }
    },

    /**
     * js压缩
     */
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
      },
      common_js: {
        src: ['_build/js/common.js'],
        dest: 'build/js/common.js'
      },
      page_js: {
        src: ['_build/js/<%= pkg.name %>.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      }
    },

    replace: {
      dev: {
        options: {
          patterns: [{
            match: 'build_dir',
            replacement: '_build'
          }, {
            match: 'version',
            replacement: '<%= pkg.version %>'
          }, {
            match: 'timestamp',
            replacement: '<%= new Date().getTime() %>'
          }, {
            match: /include(\w+)/,
            replacement: function(match, p1) {
              var url = grunt.config.get('config').tpldir + "/includes/include" + p1 + ".html";
              return grunt.file.read(url);
            }
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= config.tpldir %>/index.html'],
          dest: './'
        }]
      },
      pro: {
        options: {
          patterns: [{
            match: 'build_dir',
            replacement: 'build'
          }, {
            match: 'version',
            replacement: '<%= pkg.version %>'
          }, {
            match: 'timestamp',
            replacement: '<%= new Date().getTime() %>'
          }, {
            match: /include(\w+)/,
            replacement: function(match, p1) {
              var url = grunt.config.get('config').tpldir + "/includes/include" + p1 + ".html";
              return grunt.file.read(url);
            }
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= config.tpldir %>/index.html'],
          dest: './'
        }]
      }
    },

    /**
     * create HTTP Server
     */
    connect: {
      server: {
        options: {
          port: 8000,
          protocol: 'http',
          hostname: '127.0.0.1',
          livereload: true,
          base: '.'
        }
      }
    },

    /**
     * Opens the web server in the browser
     */
    open: {
      server: {
        path: 'http://127.0.0.1:<%= connect.server.options.port %>/index.html'
      }
    },

    /**
     * 监听img,less,css,js修改，自动刷新浏览器
     */
    watch: {
      options: {
        spawn: false,
        livereload: LIVERELOAD_PORT
      },
      img: {
        files: ['<%= config.imgdir %>/**'],
        tasks: ['copy']
      },
      //      less: {
      //        files: ['<%= config.lessdir %>/**/*.less'],
      //        tasks: ['less']
      //      },
      sass: {
        files: ['<%= config.sassdir %>/**/*.scss'],
        tasks: ['sass']
      },
      css: {
        files: ['<%= config.cssdir %>/**/*.css'],
        tasks: ['concat']
      },
      js: {
        files: ['<%= config.jsdir %>/**/*.js'],
        tasks: ['jshint', 'concat']
      }
    }

  });

  /**
   * 加载grunt插件
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  //grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  /**
   *
   * 默认命令：grunt
   */
  grunt.registerTask('default', [
    'clean:dev',
    'validation',
    'sass',
    'autoprefixer',
    'csslint',
    'jsbeautifier',
    'jshint',
    'copy',
    'sprite',
    'concat',
    'replace:dev',
    'connect',
    'open',
    'watch'
  ]);

  /**
   * grunt build命令
   */
  grunt.registerTask('build', [
    'clean:build',
    'validation',
    'sass',
    'autoprefixer',
    'jsbeautifier',
    'jshint',
    'imagemin',
    'concat',
    'cssmin',
    'uglify',
    'replace:pro',
    'connect',
    'open',
    'watch'
  ]);

};
