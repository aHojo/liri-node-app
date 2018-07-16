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
/* TODO commands from command line
* help
* `my-tweets`
* `spotify-this-song`
* `movie-this`
* `do-what-it-says
*/

switch(command) {
    case 'help':
    //TODO Display a list of commands and their uses.
    break;
    case 'my-tweets':
    //TODO This will show your last 20 tweets and when they were created at in your terminal/bash window.
    break;
    case "spotify-this-song":
    /*TODO This will show the following information about the song in your terminal/bash window
     * Artist(s)
     * The song's name
     * A preview link of the song from Spotify
     * The album that the song is from
     * If no song is provided then your program will default to "The Sign" by Ace of Base
     */
    break;
    case 'movie-this':
    /* TODO
    * This will output the following information to your terminal/bash window:
    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.' 
    */
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