'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _monitor = require('./monitor');

var _monitor2 = _interopRequireDefault(_monitor);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();
const router = new _koaRouter2.default();

router.get('/', _controller2.default.home.index);
router.get('/BikePoint', _controller2.default.bikepoint.index);
router.get('/BikePoint/:bikePoint', _controller2.default.bikepoint.show);
router.get('/Occupancy', _controller2.default.occupancy.index);

app.use(_monitor2.default).use(router.routes()).use(router.allowedMethods());

app.listen((0, _config2.default)('SERVER_PORT', true));