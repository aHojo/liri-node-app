require('dotenv').config();
const Twitter = require('twitter');
const keys = require("./keys.js");
// var fs = require('fs');

let LOG = require("./logit.js");
let log = new LOG();

const displayTweets = function (name, numTweets) {
    /**
     * Displays tweets when called
     * @param {name} name of the user
     * @param {count} how many tweets to display
     */
    let params = {
        'screen_name': name,
        'count': numTweets
    };

    let client = new Twitter({
        'consumer_key': keys.twitter.consumer_key,
        'consumer_secret': keys.twitter.consumer_secret,
        'access_token_key': keys.twitter.access_token_key,
        'access_token_secret': keys.twitter.access_token_secret
    });

    client.get("statuses/user_timeline", params, function (err, tweets, response) {
        if (!err && response.statusCode === 200) {
            let twitters = []
            process.stdout.write('\n----------------------------------------------------------');
            twitters.push(`\n\n${tweets[0].user.name} tweets:`);
            for (let i = 0; i < tweets.length; i++) {
                // process.stdout.write(`${tweets[i].created_at}: ${tweets[i].text}\n`);
                twitters.push(`${tweets[i].created_at}: ${tweets[i].text}`);
            }
            console.log(twitters.join("\n"));
            process.stdout.write('\n----------------------------------------------------------');
            
            log.logData(twitters.join("\n"));
        } else {
            return console.log(err);
        }

        return 0;
    });
};

module.exports = Twitter;
module.exports = keys;
module.exports = displayTweets;