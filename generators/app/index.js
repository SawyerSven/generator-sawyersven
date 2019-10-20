'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');
const downLoadGitRepo = require('download-git-repo');
const ora = require('ora');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  initializing() {
    this.props = {}; //定义这个后面会用到
    this.log('初始化完成');
  }
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the cat"s meow ${chalk.red(
          'generator-sawyersven'
        )} generator!`
      )
    );
    const prompts = [
      {
        type: 'input',
        name: 'appname',
        message: 'give Your project a name',
        default: this.appname //appname是内置对象，代表工程名，这里就是ys
      },
      {
        type: 'confirm',
        name: 'cool',
        message: 'Would you like to enable the Cool feature?'
      },
      {
        type: 'input',
        name: 'projectDesc',
        message: 'Please input project description:'
      },
      {
        type: 'list',
        name: 'projectLicense',
        message: 'Please choose license:',
        choices: ['MIT', 'ISC', 'Apache-2.0', 'AGPL-3.0']
      },
      {
        type: 'input',
        name: 'username',
        message: "What's your GitHub username", //里面的单引号需要转义
        store: true
      }
      //打印出answers回复内容
    ];

    return this.prompt(prompts).then(props => {
      this.log(props);
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }
  defaults() {
    //判断工程名同名文件夹是否存在，不存在则自动创建
    if (path.basename(this.destinationPath()) !== this.props.appname) {
      this.log(
        'Your generator must be inside a folder named ' +
          this.props.appname +
          '\n' +
          "I'll automatically create this folder."
      );
      //mkdirp是我们引用的模块，用来创建文件夹,此时没有设置项目根目录，则在当前目录创建
      mkdirp(this.props.appname);
      //this.destinationRoot则是设置要创建的工程的根目录为工程名文件夹。
      this.destinationRoot(this.destinationPath(this.props.appname));
    }
  }
  writing() {
    //在根目录下创建这些文件夹
    mkdirp('lib/3');
    mkdirp('lib/2');
    mkdirp('lib/1');
    mkdirp('public');
    mkdirp('src');
    //复制templates目录中的index.html、index.js到目标目录（先在templates里创建这两个文件）
    this.fs.copyTpl(
      this.templatePath('public/index.html'),
      // returns './templates/public/index.html'
      this.destinationPath('public/index.html'),
      { title: '首页' } //index.html中绑定了title,html标题设为“首页”
    ),
      this.fs.copy(
        this.templatePath('public/index.js'),
        // returns './templates/public/index.js'
        this.destinationPath('public/index.js')
      ),
      this.fs.copy(
        this.templatePath('package.json'),
        this.destinationPath('package.json')
      );
  }

  downLoad() {
    let done = this.async();
    const o = ora('开始下载模板...').start();
    downLoadGitRepo('sawyersven/sea-admin', this.destinationRoot(), function(
      err
    ) {
      o.stop();
      done(err);
    });
  }

  install() {
    this.yarnInstall();
  }
};
