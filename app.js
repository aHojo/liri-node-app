//Docs https://www.npmjs.com/package/dotenv
require('dotenv').config();

//Docs https://www.npmjs.com/package/request
const request = require("request");

//Docs https://www.npmjs.com/package/twitter
const Twitter = require('twitter');

//Docs https://www.npmjs.com/package/node-spotify-api https://developer.spotify.com/dashboard/
const Spotify = require('node-spotify-api');

//Our api keys file
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

/** Displays tweets when called */
const displayTweets = function (name, count) {
    var params = {
        'screen_name': name,
        'count': count,
    }

    let client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    client.get("statuses/user_timeline", params, function (err, tweets, response) {
        if (err) {
            return console.log(err);
        }

        process.stdout.write(`\n\n${tweets[0].user.name} tweets:\n`);
        process.stdout.write('##############################################\n');
        for (let i = 0; i < tweets.length; i++) {
            process.stdout.write(`${tweets[i].created_at}: ${tweets[i].text}\n`);
        }

        return 0;
    });
}

/**Displays spotify song information, otherwise defaults to  "The Sign" by Ace of Base*/
const spotifyThisSong = function (song, artist) {

    let spotSong = song.toUpperCase().split(" ").join("+");
    let url = '';
    
    if(typeof artist === 'undefined'){
        url = 'https://api.spotify.com/v1/search' + '?q=' + spotSong + '&type=track' + '&limit=1';
    } else {
        let spotArtist = artist.toUpperCase().split(" ").join("+");
        url = 'https://api.spotify.com/v1/search' + '?q=' + spotSong + '%20' + 'artist:' + spotArtist + '&type=track' + '&limit=1';
    }
    console.log(url);
    const spotify = new Spotify({
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_SECRET,
    });

    spotify.request(url).then(function (data) {
        let artist = data.tracks.items[0].artists[0].name;
        let song = data.tracks.items[0].name;
        let preview_url = data.tracks.items[0].preview_url;
        let album = data.tracks.items[0].album.name;
        let spotUrl = data.tracks.items[0].external_urls.spotify;
        
        if(preview_url !== null) {
            process.stdout.write(`\n Artist: ${artist}\nSong: ${song}\nURL: ${preview_url}\nAlbum: ${album}\n`);
        } else {
            process.stdout.write(`\n Artist: ${artist}\nSong: ${song}\nURL: ${spotUrl}\nAlbum: ${album}\n`);
        }

    });
}

/**Search for a movie on omdb*/
const getMovie = function(title) {
    
    let key = process.env.OMDB_API_KEY;
    let url = "http://www.omdbapi.com/?t=" + title + "&apikey=" + key //&y=2017"
    
    request(url, function(err, response, body) {

        if(!err && response.statusCode === 200){
            //working
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
}

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
        if(firstArg && secondArg){
            process.stdout.write(`Searching for ${query} by ${query2}....\n\n`);
            spotifyThisSong(query, query2);
        } else if(query) {
            process.stdout.write(`Searching for ${query}....\n\n`);
            spotifyThisSong(query);
        }   else {
            process.stdout.write(`No song  given defaulting to The Sign by Ace of Base....\n\n`);
            spotifyThisSong("the sign", "ace of base");
        }
        break;
    case 'movie-this':
        /* TODO
         * This will output the following information to your terminal/bash window:
         * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
         */
        getMovie(firstArg);
        
        break;
    case 'do-what-it-says':
        /* TODO
         * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
         * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
         * Feel free to change the text in that document to test out the feature for other commands.
         */
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