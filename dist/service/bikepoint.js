'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.box = exports.around = exports.get = exports.all = exports.compileStation = undefined;

var _velok = require('../source/bikepoint/velok');

var velok = _interopRequireWildcard(_velok);

var _veloh = require('../source/bikepoint/veloh');

var veloh = _interopRequireWildcard(_veloh);

var _distance = require('../helper/distance');

var _distance2 = _interopRequireDefault(_distance);

var _inbox = require('../helper/inbox');

var _inbox2 = _interopRequireDefault(_inbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const compileStation = exports.compileStation = function (provider, bikePoint) {
    bikePoint.id = provider + ':' + bikePoint.id;
    return bikePoint;
};

const all = exports.all = () => {

    const sources = {
        'velok': velok.all(),
        'veloh': veloh.all()
    };

    var providers = Object.keys(sources);

    return Promise.all(
    //TODO: replace when Issue #2 is closed
    Object.keys(sources).map(key => sources[key])).then(results => {

        var stations = [];

        for (let i = 0; i < results.length; i++) {
            stations = [...stations, ...results[i].map(station => compileStation(providers[i], station))];
        }

        return stations;
    });
};

const get = exports.get = (() => {
    var _ref = _asyncToGenerator(function* (bikePoint) {
        var bikePointSplit = bikePoint.split(':');
        switch (bikePointSplit[0]) {
            case 'veloh':
                bikePoint = yield veloh.get(bikePointSplit[1]);
                break;
            case 'velok':
                bikePoint = yield velok.get(bikePointSplit[1]);
                break;
        }
        return compileStation(bikePointSplit[0], bikePoint);
    });

    return function get(_x) {
        return _ref.apply(this, arguments);
    };
})();

const around = exports.around = (() => {
    var _ref2 = _asyncToGenerator(function* (lon, lat, radius) {
        var bikePoints = yield all();

        var dist = 0;
        var bikePointsAround = [];

        for (var i = 0; i < bikePoints.length; i++) {
            dist = (0, _distance2.default)(parseFloat(lon), parseFloat(lat), bikePoints[i].position.longitude, bikePoints[i].position.latitude);

            if (dist <= radius) {
                var temp = bikePoints[i];
                temp.distance = parseFloat(dist.toFixed(2));
                bikePointsAround.push(temp);
            }
        }
        return bikePointsAround;
    });

    return function around(_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

const box = exports.box = (() => {
    var _ref3 = _asyncToGenerator(function* (swlon, swlat, nelon, nelat) {
        var bikePoints = yield all();
        return bikePoints.filter(function (bikePoint) {
            return (0, _inbox2.default)(swlon, swlat, nelon, nelat, bikePoint.position.longitude, bikePoint.position.latitude);
        });
    });

    return function box(_x5, _x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
    };
})();