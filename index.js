const TwitchClass = require('./classes/twitch').TwitchClass;
const express = require('express');
const app = express();

app.get('/get-data', (req, res) => {
    const twitchClass = new TwitchClass();
    const gameName = req.query.game;
    twitchClass.getGameDetails(gameName).then((gameDetails) => {
        if (gameDetails && gameDetails.games) {
            let gameDetailInfo = gameDetails.games[0];
            twitchClass.getStreamSummaryForGame(gameDetailInfo.name).then((streamList) => {
                gameDetailInfo = Object.assign(gameDetailInfo, streamList);
                res.send(gameDetailInfo);
            }).catch((error) => {
                return res.status(500).send(error);
            });
        } else {
            return res.status(200).send({ name: gameName, status: 'not found' });
        }
    }).catch((error) => {
        return res.status(500).send(error);
    });
});

app.listen(3000);