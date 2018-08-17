ellabook-h5
-----------
版本 v1.0

基于vue2.x系列 - vux-ui 

前言
--
为了便于多人协作开发，以及后期易于维护，将对整体项目架构及技术栈做一些说明。作为一款移动互联网产品，架构的设计应遵守**易用性、易维护、易扩展、稳定性、高性能**等原则。

关于选型
----
**vue**  vue和react作为前端界的两大框架。不管是哪种框架，都可以完全胜任项目需求，框架只是工具，形式不同而已。如果你习惯用react，那我相信你花费少许时间就能胜任vue的开发，vue相对来说比较容易入手。我选择vue的理由有

 - vue与微信小程序语法相近，如果将来做小程序，将很快移入。
 - 小而快，渲染性能强

**vux** 一个基于vux2.x ui框架，github 13k+ star，基于vux最受欢迎ui，没有之一。选择的理由是

 - vux组件全面
 - 支持按需加载
 - 基于weui
 - 样式漂亮
 - 社区强大
 - 持续维护，稳定
 - 功能齐全

官方文档`https://vux.li/`

关于技术
----
**webpack3.6.0 + vue2.5.2 + vue-router + vuex + axios**

**webpack3.6.0** 构建工具
**vue-router** 前端路由，不做解释
**vuex** 状态管理器，主要记录一些全局属性（如用户登录状态）
**axios** 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中；为了兼容性各个浏览器，比较稳定。暂不推荐fetch

关于目录结构
------
文件目录是通过vue-cli生成，进行少许配置，支持less，es6,结合vux的一些配置

    |-- build                            // webpack配置文件
    |-- config                           // 项目打包路径
    |-- src                              // 源码目录
    |   |-- assets                       // 静态资源（css/js）
    |       |-- common                   // 公共组件
    |            |-- common.css           // 公共css样式文件
    |   |-- components                   // 组件
    |       |-- list.vue           	     // 公共组件文件
    |   |-- pages                   	 // 主要路由页面
    |       |-- 404.vue                  // 404页面
    |       |-- home.vue                 // 主页面
    |       |-- main.vue                 // 我的页面
    |   |-- router                   	 // 路由配置文件夹
    |       |-- index.js                  // 路由配置文件
    |   |-- App.vue                      // 页面入口文件
    |   |-- main.js                      // 程序入口文件，加载各种公共组件
    |--static                            // 静态资源（图片/json）
    |--test                              // 测试文件夹
    |-- .babelrc                         // ES6语法编译配置
    |-- .editorconfig                    // 代码编写规格
    |-- .gitignore                       // 忽略的文件
    |-- index.html                       // 入口html文件
    |-- package.json                     // 项目及工具的依赖配置文件
    |-- README.md                        // 说明

关于命名
----
有句话说：难倒程序员的不是代码，是命名

 - 命名一律采用英文，切不可使用拼音（很low对不对）
 - css命名class采用'el-book',id采用'el_book',两个英文字母或者缩写中间class采用 '-',id采用'_'
 - js命名采用'el_book',两个英文字母或者缩写中间采用 '_',也可以是驼峰命名
 - 常量采用全大写，如const EL_BOOK = 'el_book';尽可能语义化如has、is、set、get、list等等

关于组件化开发
-------
vue的核心内容有两项**双向绑定**和**组件化**

在构建页面之前，把页面分成块，有相同功能的块抽离，放在./src/component文件夹下，尽可能复用这些代码块

注意：组件的命名规则 参照

    <template>
      <div id="app">
         <component-a></component-a>  // 这里用'-'号分割，全部采用小写
      </div>
    </template>
    import ComponentA from './ComponentA.vue' // 这里采用驼峰大写 文件扩展名可省略
    
    export default {
      components: {
        ComponentA
      },
      // ...
    }

关于JavaScript
------------

 - 要遵从函数命名规范易读，减少全局变量，减少HTTP请求，简洁宜读，注重性能，代码复用率高，避免冗余代码
 - webpack已配置了es6语法编译，小伙伴们可尽情使用es6语法
 - 增加了eslint语法检测，刚开始可能不太适应，但这是养成良好开发习惯很好的办法，保证统一的代码规范，对今后更加易于维护很有帮助

js代码规范，例如：

 1. 用===和!==代替==和!=
 2. 用 4 个空格做为一个缩进层级，不允许使用 2 个空格 或 tab 字符
 3. 二元运算符两侧必须有一个空格，一元运算符与操作对象之间不允许有空格
 4. 用作代码块起始的左花括号 { 前必须有一个空格
 5. if / else / for / while / function / switch / do / try / catch /
    finally 关键字后，必须有一个空格
 6. 在对象创建时，属性中的 : 之后必须有空格，: 之前不允许有空格
 7. 函数声明、具名函数表达式、函数调用中，函数名和 ( 之间不允许有空格
 8. 行尾不在写 ;

更多规范，请参照`https://blog.csdn.net/heliumlau/article/details/70833270`

关于图片
-----

 - 所有图片都要经过压缩，压缩图片地址`https://tinypng.com/`

关于css
-----

 - 要遵从层次清晰，标注简介明了，复用率高，避免冗余代码
 - webpack配置了less预处理语言的编译，小伙伴们可尽情使用less语法。因为vux是采用less，所以框架也采用less
 - 如一种样式出现多次，请把样式写入公共样式文件.src/assets/common/common.css,以便样式的复用，命名请以'el-cm-'开头,如'el-cm-btn'

关于rem
-----

- 为了适应移动端各种宽度设备，项目中引用了px2rem-loader，可把px转换成rem，webpack已经配好，可按照750px设计图，按照px进行样式编写，本方案也是本人觉得目前最好的解决方案


关于router
--------
前端路由统一配置在.src/router/index.js文件，以路由按需加载方式来组织，以便分割打包代码

    export default new Router({
      mode: 'history',
      routes: [
        {
          path: '/',
          name: 'home',
          component: function (resolve) {
            require(['@/pages/Home'], resolve)
          }
        },
        {
          path: '/main',
          name: 'main',
          component: function (resolve) {
            require(['@/pages/Main'], resolve)
          }
        }
      ]
    })

关于第三方依赖
-------
原则上谨慎添加，如果是协同开发，请与小伙伴们商议


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
