import * as bikepoint from '../service/bikepoint';
import config         from '../config';
import deepClone      from 'deep-clone';
import Redis          from 'ioredis';
var redis = new Redis();

var newData = [];
var cache;

const crawl = async () => {
    var startTime = new Date().getTime();
    if (!cache) {
        cache = await bikepoint.load();
        await redis.set(
            config('NAME_VERSION', true) + '_cache_bikepoint',
            JSON.stringify(cache),
            'EX',
            config('CACHE_TTL', true)
        );
        console.log('set   ', config('NAME_VERSION', true) + '_cache_bikepoint');
        setTimeout(crawl, config('CRAWL_TTL_BIKEPOINT', true));
        return;
    }
    newData = await bikepoint.load();

    // update
    var updatedBikePoints = cache.features.filter(row => {
        var oldRow = newData.features.find(row2 => row2.properties.id === row.properties.id);
        var tmpRow    = deepClone(row);
        delete tmpRow.properties.last_update;
        var tmpOldRow = deepClone(oldRow);
        delete tmpOldRow.properties.last_update;

        return oldRow && (JSON.stringify(tmpRow) !=  JSON.stringify(tmpOldRow));
    });

    // update
    if (updatedBikePoints.length) {
        redis.publish(
            config('NAME_VERSION', true) + '_bikepoint',
            JSON.stringify({
                type: 'update',
                data: updatedBikePoints.map(compileStream)
            })
        );
        console.log('update', config('NAME_VERSION', true) + '_bikepoint');
    }

    // new
    var newBikePoints = newData.features.filter(row => {
        return !cache.features.find(row2 => row2.properties.id === row.properties.id);
    });

    if (newBikePoints.length) {
        redis.publish(
            config('NAME_VERSION', true) + '_bikepoint',
            JSON.stringify({
                type: 'new',
                data: newBikePoints.map(compileStream)
            })
        );
        console.log('new   ', config('NAME_VERSION', true) + '_bikepoint');
    }

    // deleted
    var deletedBikePoints = cache.features.filter(row => {
        return !newData.features.find(row2 => row2.properties.id === row.properties.id);
    });
    if (deletedBikePoints.length) {
        redis.publish(
            config('NAME_VERSION', true) + '_bikepoint',
            JSON.stringify({
                type: 'delete',
                data: deletedBikePoints.map(compileStream)
            })
        );
        console.log('delete', config('NAME_VERSION', true) + '_bikepoint');
    }

    cache = newData;

    await redis.set(
        config('NAME_VERSION', true) + '_cache_bikepoint',
        JSON.stringify(cache)
    );
    console.log('set   ', config('NAME_VERSION', true) + '_cache_bikepoint');

    var diffTime = new Date().getTime() - startTime;
    var timeOut = config('CRAWL_TTL_BIKEPOINT', true) - diffTime < 0 ? 0 : config('CRAWL_TTL_BIKEPOINT', true) - diffTime;
    setTimeout(crawl, timeOut);
};

const compileStream = bikePoint => {
    return {
        id: bikePoint.properties.id,
        data: bikePoint,
    };
};

// Run crawler
crawl();
