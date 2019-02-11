# twitchcount

This project is a simple node/express app that hosts one endpoint:

/get-data?game=

You can pass any string as the game - i.e. 'sea of thieves'

You will need to setup an environment variable that the application will pick up and use - this should contain your Twitch client id:

i.e. export TWITCH_CLIENT_ID=<your client id>

To start the app use:

npm start