const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const config = require('../config/config');

const mongoose = require("mongoose");
const Article = require('../models/article');
const User = require('../models/user');

chai.use(chaiHttp);

describe('ARTICLE',function(){

    beforeEach(function(done){ //Before each test we empty the database
        Article.deleteMany({}, function(err){
            done();
        });
    });

    describe('/GET article', function() {

        it('it should GET all the articles', function(done){
        chai.request(app)
            .get('/article')
            .set('Authorization', config.TOKEN_CLI)
            .then(res =>{
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            })
            .catch(err => done(new Error(err)));
        });

        it('it should GET title T-Shirt',function(done){
            var user = new User({
                name:"Sebastian"
            });


            user.save()
            .then(user => {
                var article = new Article({
                    title:"T-Shirt",
                    tags: [
                        "CLOTHES",
                        "SPORT"
                    ],
                    text: "Football T-Shirt",
                    userId: user.id
                });
                article.save()
                .then(article => {
                    chai.request(app)
                    .get('/article')
                    .set('Authorization', config.TOKEN_CLI)
                    .then(res =>{
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        res.body[0].title.should.be.eql('T-Shirt');
                        res.body[0].userId.name.should.be.eql('Sebastian');
                        done();
                    })
                    .catch(err => done(new Error(err)));
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });

        it('it should GET only one Article with title T-Shirt',function(done){
            var user = new User({
                name:"Sebastian"
            });


            user.save()
            .then(user => {
                var article = new Article({
                    title:"T-Shirt",
                    tags: [
                        "CLOTHES",
                        "SPORT"
                    ],
                    text: "Football T-Shirt",
                    userId: user.id
                });

                var article1 = new Article({
                    title:"Ball",
                    tags: [
                        "SPORT"
                    ],
                    text: "Football item",
                    userId: user.id
                });

                Promise.all([article.save(), article1.save()])
                .then(result => {
                    chai.request(app)
                    .get('/article?tags=CLOTHES')
                    .set('Authorization', config.TOKEN_CLI)
                    .then(res =>{
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        res.body[0].title.should.be.eql('T-Shirt');
                        res.body[0].userId.name.should.be.eql('Sebastian');
                        done();
                    })
                    .catch(err => done(new Error(err)));
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });

        it('it should GET two articles',function(done){
            var user = new User({
                name:"Sebastian"
            });


            user.save()
            .then(user => {
                var article = new Article({
                    title:"T-Shirt",
                    tags: [
                        "CLOTHES",
                        "SPORT"
                    ],
                    text: "Football T-Shirt",
                    userId: user.id
                });

                var article1 = new Article({
                    title:"Ball",
                    tags: [
                        "SPORT"
                    ],
                    text: "Football item",
                    userId: user.id
                });

                Promise.all([article.save(), article1.save()])
                .then(result => {
                    chai.request(app)
                    .get('/article?tags=SPORT')
                    .set('Authorization', config.TOKEN_CLI)
                    .then(res =>{
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(2);
                        res.body[0].title.should.be.eql('T-Shirt');
                        res.body[0].userId.name.should.be.eql('Sebastian');
                        res.body[1].title.should.be.eql('Ball');
                        res.body[1].userId.name.should.be.eql('Sebastian');
                        done();
                    })
                    .catch(err => done(new Error(err)));
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });


    });

    
    describe('/POST article', function() {

        it('it should not POST a article without userId field', function (done) {
            var article = {
                title:"T-Shirt",
                tags: [
                    "CLOTHES",
                    "SPORT"
                ],
                text: "Football T-Shirt"
            };

            chai.request(app)
                .post('/article')
                .set('Authorization', config.TOKEN_CLI)
                .send(article)
                .then(res=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('userId');
                    res.body.errors.userId.should.have.property('kind').eql('required');
                    done();
                })
                .catch(err => done(new Error(err)));
        });

        it('it should POST an article ', function(done){
            var user = new User({
                name:"Sebastian"
            });

            user.save()
            .then(user => {
                var article = {
                    title:"T-Shirt",
                    tags: [
                        "CLOTHES",
                        "SPORT"
                    ],
                    text: "Football T-Shirt",
                    userId: user.id
                };
                chai.request(app)
                .post('/article')
                .set('Authorization', config.TOKEN_CLI)
                .send(article)
                .then(res =>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Article successfully added!');
                    res.body.article.should.have.property('title');
                    done();
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });
    });


    describe('/GET/:id article', function() {
        it('it should GET a article by the given id', function(done){
            
            var user = new User({
                name:"Sebastian"
            });

            user.save()
            .then(user => {
                var article = new Article({
                    title:"T-Shirt",
                    tags: [
                        "CLOTHES",
                        "SPORT"
                    ],
                    text: "Football T-Shirt",
                    userId: user.id
                });
                article.save()
                .then(article => {
                    chai.request(app)
                    .get('/article/' + article.id)
                    .set('Authorization', config.TOKEN_CLI)
                    .then(res =>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('_id').eql(article.id);
                        done();
                    })
                    .catch(err => done(new Error(err)));
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });
    });

    describe('/DELETE/:id article', function() {
        it('it should DELETE a article by the given id', function(done){
            
            var user = new User({
                name:"Sebastian"
            });

            user.save()
            .then(user => {
                var article = new Article({
                    title:"T-Shirt",
                    tags: [
                        "CLOTHES",
                        "SPORT"
                    ],
                    text: "Football T-Shirt",
                    userId: user.id
                });
                article.save()
                .then(article => {
                    chai.request(app)
                    .delete('/article/' + article.id)
                    .set('Authorization', config.TOKEN_CLI)
                    .then(res =>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('n').eql(1);
                        res.body.should.have.property('ok').eql(1);
                        res.body.should.have.property('deletedCount').eql(1);
                        done();
                    })
                    .catch(err => done(new Error(err)));
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });
    });

    describe('/PUT/:id article', function() {
        it('it should PUT a article by the given id', function(done){
            
            var user = new User({
                name:"Sebastian"
            });

            user.save()
            .then(user => {
                var article = new Article({
                    title:"T-Shirt",
                    tags: [
                        "CLOTHES",
                        "SPORT"
                    ],
                    text: "Football T-Shirt",
                    userId: user.id
                });
                article.save()
                .then(article => {
                    var changeTiTleArticle = {
                        title: "Ball",
                        tags: [
                            "CLOTHES",
                            "SPORT"
                        ],
                        text: "Football T-Shirt",
                        userId: user.id
                    };
                    chai.request(app)
                    .put('/article/' + article.id)
                    .set('Authorization', config.TOKEN_CLI)
                    .send(changeTiTleArticle)
                    .then(res =>{
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('title').eql('Ball');
                        done();
                    })
                    .catch(err => done(new Error(err)));
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });
    });

});
