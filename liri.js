const env = require('dotenv').config();
const req = require('request');
const keys = require('./keys');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
const fs = require('fs');

//Spotify keys
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);


//What operation the user wants to do
var userInput = process.argv[2];
var userQuery = process.argv[3];
var params = "";
var tweetNumber = 1;
var nodeArgs = process.argv;
var logArgs = "";


//Loop to log functions
if (nodeArgs.length>3){
    logArgs = nodeArgs.slice(3).join(" ");
}

//Append file
fs.appendFile("log.txt", "Command ran: " + userInput + ",\nWith args: '" + logArgs + "'\n\n", "utf8", (err) => {
    if (err) throw err;
});

//Twitter function
function tweetThis() {
    params = { screen_name: userQuery };
    //You can search for a specific user
    twitter.get("statuses/user_timeline", params, function (err, tweets, res) {
        if (err) throw err;

        for (var i in tweets) {
            console.log(
                `================
${tweetNumber}: ${tweets[i].text}
================\n`);
            tweetNumber++;
        }
    });
}

function spotifyThis() {
    var params = "";

    if (userQuery === undefined) {
        params = "The Sign";
    } else {
        params = userQuery;
    }

    spotify.search({ type: 'track', query: params, limit: 1 }, function (err, res) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`========================================\n
Artist's Name: ${res.tracks.items[0].album.artists[0].name}
Album Name: ${res.tracks.items[0].album.name}
Song Name: ${res.tracks.items[0].name}
Song Url: ${res.tracks.items[0].external_urls.spotify}\n
========================================`
        )
    });
}

function movieThis() {
    if (userQuery === "") {
        userQuery = "Mr.Nobody";
    }

    if (nodeArgs.length > 4) {
        for (let i = 4; i < nodeArgs.length; i++) {
            userQuery = userQuery + "+" + nodeArgs[i];
        }
    } else {
        userQuery = process.argv[3];
    }
    console.log(userQuery);

    req(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`, function (err, res, body) {
        if (err) throw err;

        var RTRating;
        var IMDBRating;

        if (JSON.parse(body).Ratings[0]) {
            IMDBRating = JSON.parse(body).Ratings[0].Value;
        } else {
            IMDBRating = "No rating found";
        }

        if (JSON.parse(body).Ratings[1]) {
            RTRating = JSON.parse(body).Ratings[1].Value;
        } else {
            RTRating = "No rating found";
        }

        console.log(`========================================\n
Title: ${JSON.parse(body).Title}
Release Year: ${JSON.parse(body).Year}
IMDB Rating: ${IMDBRating}
RT Rating: ${RTRating}
Country of origin: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}\n
========================================
        `);
    });
}

function movieThat(movieSearch) {

    userQuery = movieSearch;

    req(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`, function (err, res, body) {
        if (err) throw err;

        var RTRating;
        var IMDBRating;

        if (JSON.parse(body).Ratings[0]) {
            IMDBRating = JSON.parse(body).Ratings[0].Value;
        } else {
            IMDBRating = "No rating found";
        }

        if (JSON.parse(body).Ratings[1]) {
            RTRating = JSON.parse(body).Ratings[1].Value;
        } else {
            RTRating = "No rating found";
        }

        console.log(`========================================\n
Title: ${JSON.parse(body).Title}
Release Year: ${JSON.parse(body).Year}
IMDB Rating: ${IMDBRating}
RT Rating: ${RTRating}
Country of origin: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}\n
========================================
        `);
    });
}
//Function for do-what-it-says
function whatThis() {
    fs.readFile("random.txt", "utf8", function (err, res) {
        if (err) throw err;

        var data = res.split(",");
        var movieSearch = data[1].trim();

        var commandChoice = data[0];
        if (data.length > 1) {
            for (let i = 2; i < data.length; i++) {
                movieSearch += "+" + data[i].trim();
            }
        }

        switch (commandChoice) {
            //Twitter API
            case 'my-tweets':
                tweetThis();
                break;

            //Spotify API
            case 'spotify-this-song':
                spotifyThis();
                break;

            //OMDB API
            case 'movie-this':
                movieThat(movieSearch);
                break;
        }
    }
    )
};

//Logic
switch (userInput) {

    //Twitter API
    case 'my-tweets':
        tweetThis();
        break;

    //Spotify API
    case 'spotify-this-song':
        spotifyThis();
        break;

    //OMDB API
    case 'movie-this':
        movieThis();
        break;

    //DO WHAT IT SAYS
    case 'do-what-it-says':
        whatThis();
        break;
    default:
        console.log("");
        console.log(`
==========================
  Please enter an option
==========================\n
    my-tweets
    spotify-this-song
    movie-this
    do-what-it-says\n
==========================`);

}