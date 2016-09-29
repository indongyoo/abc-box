// ABC project
//  - https://github.com/marpple/abc-functional-javascript
//  - https://github.com/marpple/abc-box
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Byeongjin Kim, Joeun Ha, Hoonil Kim

// abc.js, abc.box.js
// (c) 2015-2016 Marpple. MIT Licensed.

//-------------------- abc.box.js -----------------------
!function (root, makeConstructorBox) {
  root.Box = makeConstructorBox(root, C.lambda);
}(typeof global == 'object' && global.global == global && (global.G = global) || window, function makeBox(root, cLambda) {
  var Box = function Box(key, value) {
    var data = {}, cache = {};
    var is_string = root.C.isString(key), k;
    if (is_string && arguments.length == 2) data[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) data[k] = key[k];
    this._ = function () { return data; }; // 괜찮은 이름 추천해주세요~
    this.__cache__ = function () { return cache; };
  };

  Box.prototype.find = function (el, is_init_cache) {
    if (!el || root.C.isArrayLike(el) && !el.length) return ;
    var str = (root.C.isString(el) ? el : (root.C.isArrayLike(el) ? el[0] : el).getAttribute('box_selector'));
    var _data = root.C.reduce(str.split(/\s*->\s*/), this._(), function (mem, key) {
      return !key.match(/([a-z]+)?\((.+)\)/) ? mem[key] : C[RegExp.$1 || 'find'](mem, cLambda(RegExp.$2));
    });
    var cache = this.__cache__(), _cache_val = cache[str];
    return (is_init_cache || !_cache_val) ? (cache[str] = _data) : _cache_val;
  };

  Box.prototype.set = function (key, value) {
    var k, is_string = root.C.isString(key);
    if (is_string && arguments.length == 2) this._()[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) this._()[k] = key[k];
    return this;
  };

  Box.prototype.unset = function(selector, key) {
    if (!key && arguments.length == 1) return root.C.unset(this._(), selector);
    else if (root.C.isString(key)) return root.C.unset(this.find(selector, true), key);
  };

  Box.prototype.remove = function(selector) {
    var _arr = selector.split(/\s*->\s*/);
    return root.C.remove(this.find(_arr.slice(0, _arr.length - 1).join('->'), true), this.find(selector, true));
  };

  return Box;
});