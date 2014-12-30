/*
 * grunt-init-template
 *
 * Copyright (c) 2014  shengjie.yu
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = '基于Grunt构建工具的web项目初始化';

// Template-specific notes to be displayed before question prompts.
exports.notes = '此项目基于Grunt构建，请输入各项对应的值';

// Template-specific notes to be displayed after question prompts.
exports.after = '现在续输入"npm install"安装相关node模块，安装完成后可以输入"grunt/grunt build"等命令。'+
    '\n' + 
    '开发模式用"grunt"命令，构建模式用"grunt build"命令。更多grunt文档请参考：' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({type: 'empty'}, [
    // Prompt for these values.
    init.prompt('name', 'myproject'),
    init.prompt('title' ,'Myproject'),
    init.prompt('keywords', 'keywords.'),
    init.prompt('description', 'My web project.'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url')
  ], function(err, props) {

    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    done();
  });

};
