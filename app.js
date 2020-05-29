// MY FIRST PROJECT WORKING WITH APIs

// =====================================
// KNOWN ISSUES
// =====================================





// =====================================
// DEPENDENCIES
// =====================================
const express = require("express");
const app = express();
const request = require("request");
const parser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(parser.urlencoded({extended: true}));





// =====================================
// ROUTES
// =====================================
let pageNum = 1;

// routes to homepage - search
app.get("/", (req, res) => {
    res.render("search");
});

// routes to search results by deafult page 1 first 10 results
app.get("/results", (req, res) => {
    pageNum = 1;
    let searchTerm = req.query.movieTitle;
    let url = "http://www.omdbapi.com/?apikey=f4de5974&s=" + searchTerm;
        request(url, (error, response, body) => {
            let datas = JSON.parse(body);
            if (datas.Response) {
                res.render("results", { 
                    movies: datas.Search, 
                    term: searchTerm, 
                    pageNumber: pageNum,
                    totalResults: datas.totalResults})
            } else {
                res.render("searchError");
                // is there a way that we can already display an error upon searching? 
                // instead of redirecting the user to another page that has an error
        }
    });
});

// routes to next page of the search results
// declared as global variable not local to function for it not to be reassigned
// declraed the page variable on top before  the /resutls route
//  for it to be visible once user searched again
app.get("/:searchTermNextPage/page/:pgNumber", (req, res) => {
    pageNum = pageNum + 1;
    let searchTerm = req.params.searchTermNextPage;
    let url = "http://www.omdbapi.com/?apikey=f4de5974&s=" + searchTerm + "&page=" + pageNum;
        request(url, (error, response, body) => {
        if(!error || response.statusCode === 200) {
            let datas = JSON.parse(body);
            if (datas.hasOwnProperty("Search")) {
                res.render("results", { 
                    movies: datas.Search, 
                    term: searchTerm, 
                    pageNumber: pageNum, 
                    totalResults: datas.totalResults});
            } else {
                res.render("searchError");
            }
        } 
    });
});

//routes to an individual movie
app.get("/:id/:moviename", (req, res) => {
    let id = req.params.id;
    let url = "http://www.omdbapi.com/?apikey=f4de5974&i=" + id;
    request(url, (error, response, body) => {
        if(!error || response.statusCode === 200) {
            let data = JSON.parse(body);
            res.render("chosenMovie", { chosenMovie: data});
        } else {
            console.error(error);
        }
    });
});


app.get("*", (req, res) => {
    res.send("ERROR 404: Sorry the page you are requesting is not exisiting yet. Come visit after 3months and the developer will be so much better by that time")
});

// YOUR LINK: http://www.omdbapi.com/?apikey=f4de5974

// =====================================
// SERVER START
// =====================================
app.listen(process.env.PORT || 8000, () => {
    if (process.env.PORT !== undefined){
        console.log(`Server started at Heroku PORT:${process.env.PORT}`)
    } else  {
        console.log(`Server started at http://localhost:8000`);
    }
});