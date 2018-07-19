//Docs https://www.npmjs.com/package/dotenv
require('dotenv').config();

//Work with the filesystem
const fs = require("fs");

//Docs https://www.npmjs.com/package/request
const request = require("request");

//Docs https://www.npmjs.com/package/node-spotify-api https://developer.spotify.com/dashboard/
const Spotify = require('node-spotify-api');

// Our api keys file
const keys = require("./keys.js");
let tweets = require("./tweets.js");

let command = process.argv[2];

let firstArg = process.argv[3];
let secondArg = process.argv[4];

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
        url = `https://api.spotify.com/v1/search?q="${spotSong}"&type=track&limit=1`;
    } else {
        let spotArtist = artist
        .toUpperCase()
        .split(" ")
        .join("+");

        url = `https://api.spotify.com/v1/search?q="${spotSong}"%20artist:${spotArtist}&type=track&limit=1`;
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
        tweets();
    }

    });
};

switch (command) {
    case 'help':
        process.stdout.write(`\nUSAGE:\nnode command\n\n`);
        process.stdout.write(`COMMANDS:\n`);
        process.stdout.write(`help - Display this message\n\nmy-tweets - Display KidLiri's top 20 tweets\n\n`);
        process.stdout.write(`spotify-this-song 'song' ['artist']\n    Arguments passed must be surrounded in quotations.\n\n`);
        process.stdout.write(`do-what-it-says - performs a random command with a preset search condition\n\n`);
        break;
    case 'my-tweets':
        //TODO format the time of the tweets
        tweets('KidLiri', '20');
        break;
    case "spotify-this-song":

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
        randomCommand();
        break;
    default:
    //TODO Display list of commands if not in this list
        process.stdout.write(`\nUSAGE:\nnode command\n\n`);
        process.stdout.write(`COMMANDS:\n`);
        process.stdout.write(`help - Display this message\n\nmy-tweets - Display KidLiri's top 20 tweets\n\n`);
        process.stdout.write(`spotify-this-song 'song' ['artist']\n    Arguments passed must be surrounded in quotations.\n\n`);
        process.stdout.write(`do-what-it-says - performs a random command with a preset search condition\n\n`);

}

/*
### BONUS
* In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.
* Make sure you append each command you run to the `log.txt` file.
* Do not overwrite your file each time you run a command.
### Reminder: Submission on BCS
* Please submit the link to the Github Repository!
*/