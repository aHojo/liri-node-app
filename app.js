//Docs https://www.npmjs.com/package/dotenv
require('dotenv').config();

//Work with the filesystem
const fs = require("fs");

//Docs https://www.npmjs.com/package/request
const request = require("request");

//Docs https://www.npmjs.com/package/twitter
const Twitter = require('twitter');

//Docs https://www.npmjs.com/package/node-spotify-api https://developer.spotify.com/dashboard/
const Spotify = require('node-spotify-api');

// Our api keys file
const keys = require("./keys.js");


let command = process.argv[2];

let firstArg = process.argv[3];
let secondArg = process.argv[4];


/* TODO commands from command line
 * help
 * `my-tweets`
 * `spotify-this-song`
 * `movie-this`
 * `do-what-it-says
 */


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

            process.stdout.write(`\n\n${tweets[0].user.name} tweets:\n`);
            process.stdout.write('##############################################\n');
            for (let i = 0; i < tweets.length; i++) {
                process.stdout.write(`${tweets[i].created_at}: ${tweets[i].text}\n`);
            }
        } else {
            return console.log(err);
        }

        return 0;
    });
};


const spotifyThisSong = function (song, artist) {
    /**
     * Displays spotify song information, otherwise defaults to  "The Sign" by Ace of Base
     * @param {song} Song to be searched
     * @param {artist} optional artist name.
    */
    let spotSong = song
    .toUpperCase()
    .split(" ")
    .join("+");

    let url = '';

    if (typeof artist === 'undefined') {
        url = `https://api.spotify.com/v1/search?q=${spotSong}&type=track&limit=1`;
    } else {
        let spotArtist = artist
        .toUpperCase()
        .split(" ")
        .join("+");

        url = `https://api.spotify.com/v1/search?q=${spotSong}%20artist:${spotArtist}&type=track&limit=1`;
    }
    console.log(url);
    const spotify = new Spotify({
        'id': keys.spotify.id,
        'secret': keys.spotify.secret
    });

    spotify.request(url).then(function (data) {
        let spotArtist = data.tracks.items[0].artists[0].name;
        let songQuery = data.tracks.items[0].name;
        let previewUrl = data.tracks.items[0].preview_url;
        let album = data.tracks.items[0].album.name;
        let spotUrl = data.tracks.items[0].external_urls.spotify;

        if (previewUrl !== null) {
            process.stdout.write(`\nArtist: ${spotArtist}\nSong: ${songQuery}\nURL: ${previewUrl}\nAlbum: ${album}\n`);
        } else {
            process.stdout.write(`\nArtist: ${spotArtist}\nSong: ${songQuery}\nURL: ${spotUrl}\nAlbum: ${album}\n`);
        }

    });
};


const getMovie = function (title) {
    /**
     * Search for a movie on omdb
     * @param {title} Name of movie to be searched.
    */

    let key = process.env.OMDB_API_KEY;
    let url = `http://www.omdbapi.com/?t=${title}&apikey=${key}`;

    request(url, function (err, response, body) {

        if (!err && response.statusCode === 200) {
            //Working
            let data = JSON.parse(body);
            let movie = data.Title;
            let release = data.Year;
            let rating = data.imdbRating;
            let country = data.Country;
            let Language = data.Language;
            let plot = data.Plot;
            let actors = data.Actors;

            process.stdout.write(`Title: ${movie}\nRelease Year: ${release}\nRating: ${rating}\nCountry: ${country}\nLanguage: ${Language}\nSummary: ${plot}\nActors: ${actors}`);
        }

    });
};


const randomCommand = function () {
    fs.readFile("./logs/random.txt", "UTF-8", function (err, data) {
    let commands = [
        'movie-this',
        'spotify-this-song',
        'my-tweets'
    ];
    let storedData = data.split("\n");

    storedData = storedData.toString().split(",");

    let randCmd = commands[Math.floor(Math.random() * commands.length)];

    if(err) {
        console.log(err);
    }
    if(randCmd === "spotify-this-song") {
        let index = storedData.indexOf("spotify-this-song");
        let songName = storedData[index + 1];
        let artistName = storedData[index + 2];

        spotifyThisSong(songName, artistName);
    } else if (randCmd === "movie-this") {
        let index = storedData.indexOf('movie-this');
        let movie = storedData[index + 1];

        getMovie(movie);
    } else {
        displayTweets();
    }

    });
};

switch (command) {
    case 'help':
        //TODO Display a list of commands and their uses.
        break;
    case 'my-tweets':
        //TODO format the time of the tweets
        displayTweets('KidLiri', '20');
        break;
    case "spotify-this-song":
        /*TODO This will show the following information about the song in your terminal/bash window
         * Artist(s)
         * The song's name
         * A preview link of the song from Spotify
         * The album that the song is from
         * If no song is provided then your program will default to "The Sign" by Ace of Base
         */
        if (firstArg && secondArg) {
            process.stdout.write(`Searching for ${firstArg} by ${secondArg}....\n\n`);
            spotifyThisSong(firstArg, secondArg);
        } else if (firstArg) {
            process.stdout.write(`Searching for ${firstArg}....\n\n`);
            spotifyThisSong(firstArg);
        } else {
            process.stdout.write(`No song  given defaulting to The Sign by Ace of Base....\n\n`);
            spotifyThisSong("the sign", "ace of base");
        }
        break;
    case 'movie-this':

        if(firstArg) {
            getMovie(firstArg);
        } else {
            getMovie("Mr. Nobody");
        }

        break;
    case 'do-what-it-says':
        /* TODO
         * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
         * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
         * Feel free to change the text in that document to test out the feature for other commands.
         */
        randomCommand();
        break;
    default:
    //TODO Display list of commands if not in this list
}

/*
### BONUS
* In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
* Make sure you append each command you run to the `log.txt` file.
* Do not overwrite your file each time you run a command.
### Reminder: Submission on BCS
* Please submit the link to the Github Repository!
*/