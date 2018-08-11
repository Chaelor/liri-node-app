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
var songSearch;


//Loop to log functions
function logThis() {
    if (nodeArgs.length > 3) {
        logArgs = nodeArgs.slice(3).join(" ");
    }

    //Append file
    fs.appendFile("log.txt", "\n========================\nCommand ran: " + userInput + ",\nWith args: '" + logArgs + "'\n\n", "utf8", (err) => {
        if (err) throw err;
    });
}

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

        var name = res.tracks.items[0].album.artists[0].name,
            album = res.tracks.items[0].album.name,
            song = res.tracks.items[0].name,
            url = res.tracks.items[0].external_urls.spotify;

        fs.appendFile("log.txt",
            `Name: ${name}
Album: ${album}
Song: ${song}
URL: ${url}
========================`, "utf8", (err) => {
                if (err) throw err;
            });

        console.log(`========================================\n
Artist's Name: ${res.tracks.items[0].album.artists[0].name}
Album Name: ${res.tracks.items[0].album.name}
Song Name: ${res.tracks.items[0].name}
Song Url: ${res.tracks.items[0].external_urls.spotify}\n
========================================`
        )
    });
}

function spotifyThat(whatThisQuery) {

    if (userQuery === undefined) {
        userQuery = "The Sign";
    }

    if (nodeArgs[3] === undefined) {
        userQuery = whatThisQuery;
    }

    spotify.search({ type: 'track', query: userQuery, limit: 1 }, function (err, res) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var name = res.tracks.items[0].album.artists[0].name,
            album = res.tracks.items[0].album.name,
            song = res.tracks.items[0].name,
            url = res.tracks.items[0].external_urls.spotify;

        fs.appendFile("log.txt",
            `
Name: ${name}
Album: ${album}
Song: ${song}
URL: ${url}
========================`, "utf8", (err) => {
                if (err) throw err;
            });
        console.log(`========================================\n
Artist's Name: ${res.tracks.items[0].album.artists[0].name}
Album Name: ${res.tracks.items[0].album.name}
Song Name: ${res.tracks.items[0].name}
Song Url: ${res.tracks.items[0].external_urls.spotify}\n
========================================`
        )
    });
}

function movieThis(whatThisQuery) {
    if (!userQuery) {
        userQuery = "Jaws";
    }

    if (nodeArgs[3] === undefined) {
        userQuery = whatThisQuery;
    }

    if (nodeArgs.length > 4) {
        userQuery = nodeArgs.slice(3).join("+");
    } else {
        userQuery = process.argv[3];
    }
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

        fs.appendFile("log.txt",
            `Title: ${JSON.parse(body).Title}
Release Year: ${JSON.parse(body).Year}
IMDB Rating: ${IMDBRating}
RT Rating: ${RTRating}
Country of origin: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}
========================}`, "utf8", (err) => {
                if (err) throw err;
            });

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

function movieThat(whatThisQuery) {

    userQuery = whatThisQuery;

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

        fs.appendFile("log.txt",
        `Title: ${JSON.parse(body).Title}
Release Year: ${JSON.parse(body).Year}
IMDB Rating: ${IMDBRating}
RT Rating: ${RTRating}
Country of origin: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}
========================}`, "utf8", (err) => {
            if (err) throw err;
        });
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

        if (data[1]) {
            var whatThisQuery = data[1].trim();
        }


        var commandChoice = data[0];


        if (data.length > 1) {
            logArgs = nodeArgs.slice(1).join(" ");
        }

        //Append file
        fs.appendFile("log.txt", "Command ran: " + commandChoice + ",\nWith args: '" + data.slice(1).join("") + "'\n\n", "utf8", (err) => {
            if (err) throw err;
        });

        switch (commandChoice) {
            //Twitter API
            case 'my-tweets':
                tweetThis();
                break;

            //Spotify API
            case 'spotify-this-song':
                spotifyThat(whatThisQuery);
                console.log(whatThisQuery);
                break;

            //OMDB API
            case 'movie-this':

                //If data is > 1, do this
                if (data.length > 1) {
                    whatThisQuery = data.slice(1).join(" ");
                }

                movieThat(whatThisQuery);
                break;
        }
    }
    )
};

//Logic
switch (userInput) {

    //Twitter API
    case 'my-tweets':
        logThis();
        tweetThis();
        break;

    //Spotify API
    case 'spotify-this-song':
        logThis();
        spotifyThis();
        break;

    //OMDB API
    case 'movie-this':
        logThis();
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