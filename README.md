# sass-sprite-webpack-plugin

webpack plugin that takes sprites with Sass

## Getting Started

```
  ├── icons                    # 待合成的图片目录
  |   ├── i1.png
  │   └── i2.png
  ├── style.scss
  └── webpack.config.js
```

Add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const SassSpriterPlugin = require('sass-sprite-webpack-plugin');

module.exports = {
  plugins: [
    new SassSpriterPlugin('/img/[name].[hash].png')
  ],
};
```

**style.scss**

```scss
// 生成以文件夹命名及图片名的 $icons-url 等变量
@import "./icons/*.png";
.bg-sprite {
  display: block;
  background: url($icons-url) 0 0 no-repeat; // 合成后图片的url
  background-size: $icons-width, $icons-height; // 合成后图片的宽高 
  &.icon-i1 {
    width: $icons-i1-width; // 注入i1.png文件的宽
    height: $icons-i1-height; // 注入i1.png文件的高
    background-position: -$icons-i1-x, -$icons-i2-y; //注入i1.png文件的x,y坐标的变量
  }
}
//============== 编译后 ==============
.bg-sprite {
  display:block;
  background:url("/icons.png") 0 0 no-repeat;
  background-size:86px,48px
}
.bg-sprite.icon-i1 {
  width:37px;
  height:42px;
  background-position:-3px,-3px
}
```

## Arguments

The plugin's signature:

**webpack.config.js**

```js
module.exports = {
  plugins: [new CopyPlugin(filename, margin, algorithm)],
};
```

|               Name                |         Type          |                     Default                     | Description                                                                                           |
| :-------------------------------: | :-------------------: | :---------------------------------------------: | :---------------------------------------------------------------------------------------------------- |
|          `filename`          |  `{String}`   |                   `[name].png`                   | Name of the result file. May contain [name],[hash]                                                               |
|           `margin`            |      `{Integer}`       |                   `3`                   | Output path.                                                                                          |
|       [`algorithm`](#algorithm)       |      `{String}`       | `binary-tree` | Organize and layout items based on various algorithms.                                              |

#### `algorithm`

Type: `String`
Default: `binary-tree`

Currently `layout` supports 5 different layout types which are listed below.

See the [layout](https://github.com/twolfson/layout) for more details. 

|         `top-down`        |          `left-right`         |         `diagonal`        |           `alt-diagonal`          |          `binary-tree`          |
|---------------------------|-------------------------------|---------------------------|-----------------------------------|---------------------------------|
| ![top-down][top-down-img] | ![left-right][left-right-img] | ![diagonal][diagonal-img] | ![alt-diagonal][alt-diagonal-img] | ![binary-tree][binary-tree-img] |

[top-down-img]: https://raw.githubusercontent.com/twolfson/layout/master/docs/top-down.png
[left-right-img]: https://raw.githubusercontent.com/twolfson/layout/master/docs/left-right.png
[diagonal-img]: https://raw.githubusercontent.com/twolfson/layout/master/docs/diagonal.png
[alt-diagonal-img]: https://raw.githubusercontent.com/twolfson/layout/master/docs/alt-diagonal.png
[binary-tree-img]: https://raw.githubusercontent.com/twolfson/layout/master/docs/binary-tree.png

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/copy-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/copy-webpack-plugin
[node]: https://img.shields.io/node/v/copy-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/copy-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack-contrib/copy-webpack-plugin
[tests]: https://dev.azure.com/webpack-contrib/copy-webpack-plugin/_apis/build/status/webpack-contrib.copy-webpack-plugin?branchName=master
[tests-url]: https://dev.azure.com/webpack-contrib/copy-webpack-plugin/_build/latest?definitionId=5&branchName=master
[cover]: https://codecov.io/gh/webpack-contrib/copy-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/copy-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[size]: https://packagephobia.now.sh/badge?p=copy-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=copy-webpack-plugin
