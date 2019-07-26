// node 
 var fs = require("fs");
 var inquirer = require("inquirer");
 require("dotenv").config();

 var axios = require("axios");
 var keys = require ("./keys.js");
 var Spotify = require("node-spotify-api")
 var spotify = new Spotify(keys.spotify);
 var moment = require('moment');
 moment().format();

 //function for liri user input

 function runLiri(){
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "liriQuestions",
                    message: "This is Liri! What would you like to search?",
                    choices: ["concert-this","spotify-this-song","movie-this","liri-says"]
                }
            ]) .then(function(answers){
                console.log(answers.liriQuestions)
                var liriQuestions =answers.liriQuestions

                if(liriQuestions === "concert-this"){
                   // console.log("test");
                    concertThis();
                }if(liriQuestions === "spotify-this-song"){
                   // console.log("test");
                  spotifyThis();
                }if(liriQuestions === "movie-this"){
                   // console.log("test");
                    movieThis();
                }if(liriQuestions === "liri-says"){
                   // console.log("test");
                   liriThis();
                 }//else {
                //     console.log("please use given comands");
                // }

            })

// function grabs the CONCERT info
            function concertCall(artistValue,concertSearch) {
                axios.get(concertSearch,{
                    params:{app_id:"codingbootcamp"}
            
            }).then(function(response){
                var eventArray = [];
                response.data.forEach(function(element) {
                    var momentDate = moment(element.datetime)
                    var dateFormatted = momentDate.format("MM/DD/YYYY")
                    var concertOutput = `${artistValue} Upcoming Show:
                    City: ${element.venue.city}
                    Venue Name: ${element.venue.name}
                    Date (Powered by momentJS): ${dateFormatted}
                    `
                    console.log(concertOutput)
                    eventArray.push(concertOutput)

            })
            fs.appendFile("log.txt" , eventArray , function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("No Save Error")
                }
            })
        }).catch(function (error) {
            console.log(error);
        });
                
    }//end of function

    function concertThis() {
        inquirer.prompt([
            {
                type: "input",
                name: "artistQuery",
                message: "What Artist would you like to search?"
            }
        ]).then(function(answers) {
            var artistArg = answers.artistQuery
            var bandsURL = `https://rest.bandsintown.com/artists/${artistArg}/events?`;
            concertCall(artistArg , bandsURL);
        }).catch(function (error) {
            console.log (error.status)
        })
    }

    //call for info from spotify
    function spotifyCall(spotifySearch) {
        spotify.search({
            type:'track',
            query: spotifySearch
        }).then(function(response) {
            var track = response.tracks.items[0];
            var artistArray =[];

            for(var i =0; i < track.artist; i++){
                artistArray.push(track.artist[i].name)
            }
            var Output = `Spotify This Song Result:
        Song: ${track.name}
        Artists: ${artistArray}
        Album: ${track.album.name}
        Preview Link: ${track.preview_url}
        `
        console.log(Output)  
            
            
        })
        
    }

    function spotifyThis(){
        inquirer.prompt([
            {
                type:"input",
                name:"spotifyQuery",
                message:"What song would you like to search for?"
            }
        ]).then(function (answers) {
            var spotValue = answers.spotifyQuery
            if (spotValue === "") {
                spotValue = "The Sign"
                spotifyCall(spotValue)
            }else{
                spotifyCall(spotValue)
            }
          })
    }//end of spotify function


    // spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
    // .then(function(data) {
    //   console.log('Artist information', data.body);
    // }, function(err) {
    //   console.error(err);
    // });

    // movie call function
    function movieCall(movieSearch) {
        axios.get(movieSearch,{params:{
            apikey:"trilogy"
        }
    }).then(
        function(response) {
            var data =response.data
            var output = `Movie This Result:
            Movie Name: ${data.Title}
        Release Year: ${data.Year}
        IMDB Rating: ${data.imdbRating}
        RT Rating: ${data.Ratings[1].Value}
        Country: ${data.Country}
        Language: ${data.Language}
        Plot Summ: ${data.Plot}
        Actors: ${data.Actors}`
        console.log(output)

        fs.appendFile("log.txt",output,function(err){
            if (err) {
                console.log(err)
            }else {
                console.log("No error")
            }
        })
            
        }
    );
        
    }

    function movieThis() {
         inquirer.prompt([
             {
                 type:"input",
                 name:"movieQuery",
                 message: "What movie would you like to search for?"
             }
         ]).then(function(answers){
             var movieVal = answers.movieQuery

             if (movieVal === "") {
                 movieVal = "Tokyo Drift"
                 var movieArg =movieVal.split(" ").join("+")
                 var movieURL = `http://www.omdbapi.com/?t=${movieArg}&y=&plot=short&`
            movieCall(movieURL);
             }else{
                var movieArg =movieVal.split(" ").join("+")
                var movieURL = `http://www.omdbapi.com/?t=${movieArg}&y=&plot=short&`
                movieCall(movieURL);
             }
         })
    }

    function liriThis() {
        fs.readFile( __dirname+"random.txt", "utf8", function(error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
              return console.log(error);
            }
          
            // We will then print the contents of data
            console.log(data);
          
            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");
          
            // We will then re-display the content as an array for later use.
            console.log(dataArr);
          
          });
         
          liriThis();
        //spotifyThis();
    }

 }
// run liri appa
 runLiri();