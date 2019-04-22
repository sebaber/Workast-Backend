const mongoose = require('mongoose');
const Article = require('../models/article');

/*
 * POST /article to save a new article.
 */
function postArticle(req, res) {
    const newArticle = new Article(req.body);

    newArticle.save()
    .then(article => res.json({message: "Article successfully added!", article:article}))
    .catch(err => res.send(err))
}


/*
 * GET /article/:id route to retrieve a article given its id.
 */
function getArticle(req, res) {
    Article.findById(req.params.id)
    .populate('userId')
    .then(article => res.json(article))
    .catch(err => res.send(err))
}


/*
 * GET /article route to retrieve all articles.
 */
function getArticles(req, res) {

    var searchFilters = {};

    if ( req.query.tags !== undefined ){
        const tags = req.query.tags.split(',');
        searchFilters.tags= {$in: tags};
    }

    Article.find(searchFilters)
    .populate('userId')
    .then(articles => res.json(articles))
    .catch(err => res.send(err))
}

/*
 * DELETE /article/:id to delete an article given its id.
 */
function deleteArticle(req, res) {
    Article.deleteOne({_id : req.params.id})
    .then(article => res.json(article))
    .catch(err => res.send(err))
}


/*
 * PUT /article/:id to update an article given its id
 */
function updateArticle(req, res) {
    Article.findOneAndUpdate({"_id": req.params.id}, req.body, {new: true})
    .then(article => res.json(article))
    .catch(err => res.send(err))  
}


module.exports = {
    getArticles: getArticles,
    getArticle: getArticle,
    postArticle: postArticle,
    deleteArticle: deleteArticle,
    updateArticle: updateArticle
};