const env = require('dotenv').config();
const req = require('request');
const keys = require('./keys');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
const fs = require('fs');

//Spotify keys
var spotify =
    new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

//Twitter keys
var twitter =
    new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });


//What operation the user wants to do
var userInput = process.argv[2];
var userQuery = process.argv[3];

switch (userInput) {
    //Twitter API
    case 'my-tweets':
        var params = { screen_name: userQuery };
        var tweetNumber = 1;
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
        break;
    //Spotify API
    case 'spotify-this-song':
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
        break;
    //OMDB API
    case 'movie-this':
        if (userQuery === "") {
            userQuery = "Mr. Nobody";
        }

        req(`http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`, function (err, res, body) {
            if (err) throw err;

            console.log(`========================================\n
Title: ${JSON.parse(body).Title}
Release Year: ${JSON.parse(body).Year}
IMDB Rating: ${JSON.parse(body).Ratings[0].Value}
RT Rating: ${JSON.parse(body).Ratings[1].Value}
Country of origin: ${JSON.parse(body).Country}
Language: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}\n
========================================
            `);
        });
        break;
    //DO WHAT IT SAYS
    case 'do-what-it-says':
        fs.readFile("random.txt", "utf8", function (err, res) {
            if (err) throw err;

            spotify.search({ type: 'track', query: res, limit: 1 }, function (error, response) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                console.log(`========================================\n
    Artist's Name: ${response.tracks.items[0].album.artists[0].name}
    Album Name: ${response.tracks.items[0].album.name}
    Song Name: ${response.tracks.items[0].name}
    Song Url: ${response.tracks.items[0].external_urls.spotify}\n
========================================`
                )
            });

        });

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