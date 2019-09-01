const useSassExpr = /sass-loader/i;

exports.getSassLoader = function ({ request, loaders }) {
  if (useSassExpr.test(request)) {
    for(let i = 0; i < loaders.length; i++) {
      if (useSassExpr.test(loaders[i].loader)) {
        return loaders[i];
      }
    }
  }
}

exports.semaphore = (function() {
  let locked = false;
  let waiters = [];

  function acquire(callback) {
    if (locked) {
      waiters.push(callback)
    } else {
      locked = true;
      callback();
    }
  }

  function release() {
    if (waiters.length > 0) {
      let callback = waiters.pop();
      process.nextTick(callback);
    } else {
      locked = false;
    }
  }

  return { acquire, release };
})();

