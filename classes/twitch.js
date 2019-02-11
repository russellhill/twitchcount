const TwitchAPI = require('twitch-api-v5');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

TwitchAPI.clientID = TWITCH_CLIENT_ID;
TwitchAPI.debug = false;

const TwitchClass = function () {};

TwitchClass.prototype.getGameDetails = (gameName) => {
    return new Promise((resolve, reject) => {
        TwitchAPI.search.games({query: gameName}, (error, response) => {
            if (error) {
                return reject(error);
            }
            return resolve(response);
        });    
    });
}

TwitchClass.prototype.getLiveStreamsForGame = (gameName, offset, limit) => {
    const query = {
        game: gameName,
    }
    query.offset = offset || 0;
    query.limit = limit || 10;

    return new Promise((resolve, reject) => {
        TwitchAPI.streams.live(query, (error, response) => {
            if (error) {
                return reject(error);
            }
            return resolve(response);
        });
    });
}

TwitchClass.prototype.getStreamSummaryForGame = (gameName, offset, limit) => {
    const query = {
        game: gameName,
    }
    query.offset = offset || 0;
    query.limit = limit || 10;

    return new Promise((resolve, reject) => {
        TwitchAPI.streams.summary(query, (error, response) => {
            if (error) {
                return reject(error);
            }
            return resolve(response);
        });
    });
}

exports.TwitchClass = TwitchClass;