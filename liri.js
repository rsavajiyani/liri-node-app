require("dotenv").config();
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

var userChoice = function(choice, data) {
    switch (choice) {
        case 'my-tweets':
            tweets();
            break;
        case 'spotify-this-song':
            getMusic(data);
            break;
        case 'movie-this':
            getMovie(data);
            break;
        case 'do-what-it-says':
            doWhatItSays();
        default:
            console.log('LIRI is unable to do that');
    }
}

var tweets = function() {
    var params = { screen_name: 'testbot35001' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(' ');
                console.log(tweets[i].text);
            }
        } else { console.log(error) }
    });
}

var getMusic = function(song) {
    if (!song) song = "The Sign Ace of Base";
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('artist: ' + songs[i].artists.map(artistName));
            console.log('song name: ' + songs[i].name);
            console.log('preview: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('*********************')
        }
    });
}

var artistName = function(artist) {
    return artist.name;
}

var getMovie = function(movieName) {
    if (!movieName) movieName = "Mr. Nobody";

    request('http://www.omdbapi.com/?t=' + movieName + '&r=json&apikey=trilogy', function(error, response, body) {
        var movieData = JSON.parse(body);
        // console.log(JSON.stringify(movieData, null, 2));

        console.log('Title: ' + movieData.Title);
        console.log('Year: ' + movieData.Year);
        console.log('Rated: ' + movieData.Rated);
        console.log('Country: ' + movieData.Country);
        console.log('Language: ' + movieData.Language);
        console.log('Plot: ' + movieData.Plot);
        console.log('Actors: ' + movieData.Actors);
        console.log('IMDB Rating: ' + movieData.Ratings[0].Value);
        console.log('RT Rating: ' + movieData.Ratings[1].Value);
        


    });
}

var doWhatItSays = function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) throw err;

        var dataArr = data.split(',');
        if (dataArr.length == 2) {
            userChoice(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            userChoice(dataArr[0]);
        }
    });
}

var run = function(argOne, argTwo) {
    userChoice(argOne, argTwo);
};

run(process.argv[2], process.argv[3]);