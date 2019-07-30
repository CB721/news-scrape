var express = require("express");
var router = express.Router();
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
// Get articles
router.get("/api/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        // save response to empty object
        var result = [];

        // h2 that the content is in
        $(".css-8atqhb").each(function (i, element) {
            // set results
            result.title = $(this).children(".esl82me0").text();
            result.author = $(this).children("e1god9m10").text();
            result.link = $(this).children("a").attr("href");
            result.summary = $(this).children(".e1n8kpyg0").text();
        })
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
            });
        res.send("Scrape Complete");
    });
});

// Look at all scraped articles
router.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Get specific article by id
router.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Get saved articles
router.get("saved", function (req, res) {
    db.Article.find({ isSaved: true })
        .then(function (data) {
            var hbsObject;
            hbsObject = {
                articles: data
            };
            res.render("saved", hbsObject);
        })
})

// Add note to article
router.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Save article
router.put("/saved/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {
            res.json(err);
        });
})

module.exports = router;