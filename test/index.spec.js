const path = require('path');
const { expect } = require('chai');
const rm = require('rimraf').sync;
const run = require('./utils/run');

const distPath = path.resolve(__dirname, 'mock-app/dist');

let assets;

function teardown() {
  assets = null;
  rm(distPath);
}

describe('build an app', function () {
  before(function (done) {
    run().then(_assets => {
      assets = _assets;
      done();
    });
  });
  
  after(teardown);

  it('build with expected files', function () {
    expect(Object.keys(assets).length).to.equal(3);
    expect(assets['icons.png'].source()).to.be.instanceof(Buffer);
    expect(assets['style.css'].source()).to.be.a('string');
  });
});
