const TwitchClass = require('./classes/twitch').TwitchClass;
const express = require('express');
const app = express();
const NodeCache = require( "node-cache" );

const CACHE_TTL = process.env.CACHE_TTL || 10;
const CACHE_CHECK = process.env.CACHE_CHECK || 120;

const myCache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_CHECK });

app.get('/get-data', (req, res) => {
    const twitchClass = new TwitchClass();
    const gameName = req.query.game;

    if (!gameName) {
        return res.status(400).send({ status: 'no game name specified' });
    }

    myCache.get(gameName, (cacheGetError, cachedGameData) => {
        if (!cachedGameData) {
            twitchClass.getGameDetails(gameName).then((gameDetails) => {
                if (gameDetails && gameDetails.games) {
                    let gameDetailInfo = gameDetails.games[0];
                    twitchClass.getStreamSummaryForGame(gameDetailInfo.name).then((streamList) => {
                        gameDetailInfo = Object.assign(gameDetailInfo, streamList);
                        gameDetailInfo.from_cache = false;
                        myCache.set(gameName, gameDetailInfo, (cacheError, cacheSuccess) => {
                            res.send(gameDetailInfo);
                        });
                    }).catch((error) => {
                        return res.status(500).send(error);
                    });
                } else {
                    return res.status(200).send({ name: gameName, status: 'not found' });
                }
            }).catch((error) => {
                return res.status(500).send(error);
            });    
        } else {
            cachedGameData.from_cache = true;
            res.send(cachedGameData);
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port);