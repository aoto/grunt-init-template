/**
 * 项目基础Grunt构建，包含以下功能：
 *      build目录清理，
 *      css,js,html格式化
 *      js语法检查，
 *      less编译成css，
 *      css合并压缩，
 *      图片压缩，
 *      js合并压缩，
 *      监听css,less,js修改，自动进行合并，less编译，
 *      修改了watch目录文件自动刷新浏览器,livereload
 * @author: yushengjie
 * @since: 2014-10-10
 * @desc: 请预先安装Node.js，grunt-cli。进到该目录以后cmd输入npm install，等待安装node模块。
 *        $> grunt：默认命令，包含js合并压缩，css合并压缩，watch等操作
 *
 */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: grunt.file.readJSON('config.json'),

    /**
     * 清理目录
     */
    clean: {
      options: {
        force: true
      },
      target: ['_build', 'build']
    },

    /**
     * js，css，html格式化
     */
    jsbeautifier: {
      files: ['<%= config.jsdir %>/**/*.js', 'Gruntfile.js', 'less/<%= pkg.name %>.less', '<%= config.cssdir %>/**/*.css', '<%= config.tpldir %>/**/*.html'],
      options: {
        js: {
          fileTypes: ['.js'],
          indentSize: 2
        },
        css: {
          fileTypes: ['.less', '.css'],
          indentSize: 2
        },
        html: {
          fileTypes: ['.html'],
          indentSize: 2
        }
      }
    },

    /**
     * js语法检查
     */
    jshint: {
      options: {
        jshintrc: true
          //reporterOutput: 'jshint.txt' 如果要输出文件
      },
      files: {
        src: ['<%= config.jsdir %>/lib/*.js', '<%= config.jsdir %>/module/*.js', '<%= config.jsdir %>/page/*.js']
      }
    },

    /**
     * less
     */
    less: {
      options: {
        sourceMap: true,
        outputSourceFiles: true,
        sourceMapURL: '<%= pkg.name %>.css.map',
        sourceMapFilename: '_build/css/<%= pkg.name %>.css.map'
      },
      compile: {
        src: 'less/<%= pkg.name %>.less',
        dest: '_build/css/<%= pkg.name %>.css'
      }
    },

    /**
     * 拷贝图片到中间目录
     */
    copy: {
      images: {
        expand: true,
        cwd: '<%= config.imgdir %>/',
        src: '**',
        dest: '_build/images/'
      }
    },

    /**
     * css,js合并
     */
    concat: {
      options: {
        sourceMap: true
      },
      //如果没用less等预编译CSS，则需要下面的目录
      //css: {
      //  src: ['<%= config.cssdir %>/global/*.css','<%= config.cssdir %>/module/*.css','<%= config.cssdir %>/page/*.css'],
      //  dest: '_build/css/<%= pkg.name %>.css'
      //},
      js: {
        src: ['<%= config.jsdir %>/lib/*.js', '<%= config.jsdir %>/module/*.js', '<%= config.jsdir %>/page/*.js'],
        dest: '_build/js/<%= pkg.name %>.js'
      }
    },

    /**
     * css合并压缩
     */
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      target: {
        src: ['_build/css/<%= pkg.name %>.css'],
        dest: 'build/css/<%= pkg.name %>.css'
      }
    },

    /**
     * 图片搬位置，压缩
     */
    imagemin: {
      images: {
        files: [{
          expand: true,
          cwd: '<%= config.imgdir %>/',
          src: ['**'],
          dest: 'build/images/'
        }]
      }
    },

    /**
     * js压缩
     */
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      target: {
        src: ['<%= config.jsdir %>/lib/*.js', '<%= config.jsdir %>/module/*.js', '<%= config.jsdir %>/page/*.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      }
    },

    /**
     * 监听img,less,css,js修改，自动刷新浏览器
     */
    watch: {
      options: {
        spawn: false,
        //livereload端口自定义，在需要自动刷新的html页面加上一个脚本:
        //<script src="http://localhost:8888/livereload.js"></script>
        livereload: 8888
      },
      img: {
        files: ['<%= config.imgdir %>/**'],
        tasks: ['copy']
      },
      less: {
        files: ['less/**/*.less'],
        tasks: ['less']
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  /**
   * 默认命令：grunt
   */
  grunt.registerTask('default', ['clean', 'jsbeautifier', 'jshint', 'less', 'copy', 'concat', 'cssmin', 'imagemin', 'uglify']);

  /**
   * 监听css，js，less，image的修改，自动合并压缩编译并刷新浏览器
   */
  grunt.registerTask('w', ['watch']);

};
