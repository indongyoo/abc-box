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
  root.createBox = root.create_box = makeConstructorBox(root);
}(typeof global == 'object' && global.global == global && (global.G = global) || window, function makeBox(root) {
  function make_selector(el) {
    return root.C.isString(el) ? el : (root.C.isArrayLike(el) ? el[0] : el).getAttribute('box_selector');
  }
  return function (key, value) {
    var _box_data = {}, _box_cache = {};
    var is_string = root.C.isString(key), k;
    if (is_string && arguments.length == 2) _box_data[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) _box_data[k] = key[k];
    function select(el, is_init_cache) {
      if (!el || root.C.isArrayLike(el) && !el.length) return ;
      var selector = make_selector(el);
      var _data = root.C.select(_box_data, selector);
      var _cache_val = _box_cache[selector];
      return (is_init_cache || !_cache_val) ? (_box_cache[selector] = _data) : _cache_val;
    }
    return {
      _: function () { return _box_data; },
      select: select,
      sel: select,
      set: function (el, value) {
        if (arguments.length == 1 &&  root.C.isObject(el)) return root.C.extend(_box_data, el);
        var selector = make_selector(el);
        var result = root.C.sel.set(_box_data, selector, value);
        _box_cache[selector] = result[0];
        return result;
      },
      unset: function(el) {
        var selector = make_selector(el);
        var result = root.C.sel.unset(_box_data, selector);
        _box_cache[selector] = result[0];
        return result;
      },
      remove: function(el) {
        var selector = make_selector(el);
        var result  = root.C.sel.remove(_box_data, selector);
        _box_cache[selector] = result[0];
        return result;
      },
      extend: function(el) {
        var selector = make_selector(el);
        return _box_cache[selector] = root.C.sel.extend.apply(null, [_box_data, selector].concat(root.C.toArray(arguments).slice(1, arguments.length)));
      },
      defaults: function(el) {
        var selector = make_selector(el);
        return _box_cache[selector] = root.C.sel.defaults.apply(null, [_box_data, selector].concat(root.C.toArray(arguments).slice(1, arguments.length)));
      },
      pop: function(el) {
        var selector = make_selector(el);
        return root.C.sel.pop(_box_data, selector);
      },
      push: function(el, item) {
        var selector = make_selector(el);
        return root.C.sel.push(_box_data, selector, item);
      },
      shift: function(el) {
        var selector = make_selector(el);
        return root.C.sel.shift(_box_data, selector);
      },
      unshift: function(el, item) {
        var selector = make_selector(el);
        return root.C.sel.unshift(_box_data, selector, item);
      }
    };
  };
});