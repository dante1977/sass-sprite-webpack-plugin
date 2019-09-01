const _ = require('lodash');
const images = require('images');
const layout = require('layout');
const globby = require('globby');
const utils = require('loader-utils');
const { dirname, basename, extname, resolve } = require('path');
const { readFile } = require('fs-extra');
const { getSassLoader, semaphore } = require('./utils');

const caches = new Map();
const patternExpr = /(\w+)\/\*\.[\{\}\w,\s]+$/;

module.exports = class SassSpritePlugin {
  constructor (
    filename = '[name].png',
    margin = 3,
    algorithm = 'binary-tree',
  ) {
    this.filename = filename;
    this.margin = margin;
    this.algorithm = algorithm;
  }

  apply (compiler) {
    let self = this;
    // let context = compiler.context;
    // 每次构建前清空缓存
    compiler.plugin('this-compilation', () => caches.clear());

    compiler.plugin('compilation', compilation => {
      compilation.plugin('normal-module-loader', (context, module) => {
        let loader = getSassLoader(module);
        if (loader) {
          let options = loader.options;
          if (_.isString(options)) {
            options = JSON.parse(options);
          }
          // set loader options
          loader.options = _.assign({}, options, {
            importer (url, prev, done) {
              if (patternExpr.test(url)) {
                self._doImport(url, dirname(prev), context)
                  .then(contents => done({ contents })).catch(() => done({ file: url }))
              } else {
                return null;
              }
            }
          });
        }
      });
    });
  }

  _doImport (request, dir, context) {
    return new Promise((_resolve, reject) => {
      let id = resolve(dir, request);
      if (caches.has(id)) {
        return _resolve(caches.get(id));
      }
      // 处理node-sass的同步编译问题
      semaphore.acquire(() => {
        this._getFiles(request, dir, context.addDependency)
          .then(files => this._layout(files))
          .then(layer => this._genSpritePng(layer))
          .then(layer => {
            semaphore.release();
            let contents = this._genContents(request, layer, context);
            caches.set(id, contents);
            _resolve(contents);
          })
          .catch(() => {
            semaphore.release();
            reject();
          });
      })
    })
  }

  _genContents(request, layer, context) {
    let m2x = this.margin * 2;
    let {
      path,
      name,
      publicPath,
    } = this._getAssetPath(request, layer.png, context);
    context.emitFile(path, layer.png);
    return `$${ name }-url:${ JSON.stringify(publicPath + path) };
      $${ name }-width:${ layer.width }px;
      $${ name }-height:${ layer.height }px;
      ${ layer.items.map(item => {
        return `$${name}-${ item.name }-width:${ item.width - m2x }px;
          $${name}-${ item.name }-height:${ item.height - m2x }px;
          $${name}-${ item.name }-x:${ item.x + this.margin }px;
          $${name}-${ item.name }-y:${ item.y + this.margin }px;`
      }).join('') }`;
  }

  _getAssetPath(request, png, { _compilation }) {
    let name = patternExpr.exec(request)[1];
    let mainTemplate = _compilation.mainTemplate;
    return {
      name,
      publicPath: mainTemplate.getPublicPath({}),
      path: mainTemplate.applyPluginsWaterfall('asset-path', this.filename, {
        chunk: {
          name,
          hash: utils.getHashDigest(png, null, null)
        }
      })
    }
  }

  _genSpritePng({ width, height, items }) {
    let m = this.margin;
    let img = images(width, height);
    items.forEach(({ image, x, y }) => img.draw(image, x + m, y + m));
    return {
      width,
      height,
      items,
      png: img.encode('png')
    }
  }

  _getFiles (pattern, cwd, addDependency) {
    return globby(pattern, {cwd, absolute: true, onlyFiles: true })
      .then(files => {
        files.forEach(file => addDependency(file));
        return files;
      })
  }

  _layout(files) {
    let layer = layout(this.algorithm);
    return Promise.all(files.map(file => this._readImage(file)))
      .then(imageList => {
        imageList.forEach(item => layer.addItem(item));
        return layer['export']();
      });
  }

  _readImage(file) {
    let m2x = this.margin * 2;
    return readFile(file).then(buf => {
      let image = images(buf);
      return {
        image,
        width: image.width() + m2x, // margin
        height: image.height() + m2x, // margin
        name: basename(file, extname(file))
      }
    })
  }
}
