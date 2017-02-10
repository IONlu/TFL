import * as mobiliteit      from '../../source/stoppoint/mobiliteit';
import * as stoppoint       from '../stoppoint';
import config               from '../../config';
import moment               from 'moment';
import {redis, redisPubSub} from '../../redis';
import Boom                 from 'boom';

const STREAM_NAME = config('NAME_VERSION', true) + '_stoppoint_departures_';
const CACHE_TABLE = config('NAME_VERSION', true) + '_cache_stoppoint_departures';

export const get = async stopPoint => {
    return redis.get(CACHE_TABLE)
        .then(
            function (result) {
                if (result && result !== '') {
                    var departures = JSON.parse(result)[stopPoint];
                    if (!departures) {
                        throw new Boom.notFound('No departures from stoppoint [' + stopPoint + '] found');
                    }
                    return departures;
                } else {
                    throw new Boom.serverUnavailable('Departures from stoppoint [' + stopPoint + '] are temporarily unavailable');
                }
            }
        );
};

export const load = async (stopPoint, limit) => {
    var departuresRaw = await mobiliteit.departures(stopPoint, limit);
    var departures = [];
    var rawDepartures = departuresRaw.Departure;
    if (rawDepartures) {
        for (var i = 0; i < rawDepartures.length; i++) {
            var departure = {};
            departure.id = rawDepartures[i].JourneyDetailRef.ref;
            if (!rawDepartures[i].Product.operatorCode) {
                departure.type = 'bus';
                departure.trainId = null;
            } else {
                switch (rawDepartures[i].Product.operatorCode.toLowerCase()) {
                case 'cfl':
                    departure.type = 'train';
                    departure.trainId = rawDepartures[i].Product.name.replace(/ +/g,' ');
                    break;
                default:
                    departure.type = 'bus';
                    departure.trainId = null;
                    break;
                }
            }
            departure.line = rawDepartures[i].Product.line.trim();
            departure.number = parseInt(rawDepartures[i].Product.num.trim(), 10);

            var time = Math.round(Date.parse(rawDepartures[i].date + ' ' + rawDepartures[i].time) / 1000);
            if (rawDepartures[i].rtDate) {
                var realTime = Math.round(Date.parse(rawDepartures[i].rtDate + ' ' + rawDepartures[i].rtTime) / 1000);
                departure.departure = realTime;
                departure.delay = realTime - time;
                departure.live = true;
            } else {
                departure.departure = time;
                departure.delay = 0;
                departure.live = false;
            }
            departure.departureISO = moment.unix(departure.departure).format();
            departure.destination = rawDepartures[i].direction;
            var destination = await stoppoint.getByName(departure.destination);
            if (typeof destination !== 'undefined') {
                departure.destinationId = destination.properties.id;
            } else {
                departure.destinationId = null;
            }
            departures.push(departure);
        }
    }

    departures.sort((a,b) => a.departure - b.departure);

    return departures;
};

export const all = () => {
    return redis.get(CACHE_TABLE)
        .then(
            function (result) {
                if (result && result !== '') {
                    return JSON.parse(result);
                } else {
                    throw new Boom.serverUnavailable('all /StopPoint/Departures endpoints are temporarily unavailable');
                }
            }
        );
};

redisPubSub.psubscribe(STREAM_NAME + '*');
export const fireHose = callback => {
    const messageCallback = (pattern, channel, message) => {
        callback(JSON.parse(message));
    };
    all().then(data => {
        callback({
            type: 'new',
            data: data
        });
    });
    redisPubSub.on('pmessage', messageCallback);

    return {
        off: function () {
            redisPubSub.removeListener('pmessage', messageCallback);
        }
    };
};

export const streamSingle = (stopPoint, callback) => {
    const messageCallback = (pattern, channel, message) => {
        if (channel === STREAM_NAME + stopPoint) {
            callback(JSON.parse(message));
        }
    };
    all().then(data => {
        for (var key in data) {
            if (key == stopPoint) {
                callback({
                    type: 'new',
                    data: {
                        [key]: data[key]
                    }
                });
            }
        }
    });
    redisPubSub.on('pmessage', messageCallback);

    return {
        off: function () {
            redisPubSub.removeListener('pmessage', messageCallback);
        }
    };
};
