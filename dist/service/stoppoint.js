'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = exports.box = exports.around = exports.get = exports.all = undefined;

var _mobiliteit = require('../source/stoppoint/mobiliteit');

var mobiliteit = _interopRequireWildcard(_mobiliteit);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const all = exports.all = (() => {
    var _ref = _asyncToGenerator(function* () {
        return yield mobiliteit.all();
    });

    return function all() {
        return _ref.apply(this, arguments);
    };
})();

const get = exports.get = (() => {
    var _ref2 = _asyncToGenerator(function* (stopPoint) {
        return yield mobiliteit.get(stopPoint);
    });

    return function get(_x) {
        return _ref2.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref3 = _asyncToGenerator(function* (lon, lat, radius) {
        return yield mobiliteit.around(lon, lat, radius);
    });

    return function around(_x2, _x3, _x4) {
        return _ref3.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref4 = _asyncToGenerator(function* (swlon, swlat, nelon, nelat) {
        return yield mobiliteit.box(swlon, swlat, nelon, nelat);
    });

    return function box(_x5, _x6, _x7, _x8) {
        return _ref4.apply(this, arguments);
    };
})();

const search = exports.search = (() => {
    var _ref5 = _asyncToGenerator(function* (searchString) {
        return yield mobiliteit.search(searchString);
    });

    return function search(_x9) {
        return _ref5.apply(this, arguments);
    };
})();