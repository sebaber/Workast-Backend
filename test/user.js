const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const config = require('../config/config');

const mongoose = require("mongoose");
const User = require('../models/user');

chai.use(chaiHttp);

describe('USER',function(){

    beforeEach(function(done){ //Before each test we empty the database
        User.deleteMany({}, function(err){
            done();
        });
    });

    describe('/GET user', function() {

        it('it should GET all the users', function(done){
        chai.request(app)
            .get('/user')
            .set('Authorization', config.TOKEN_CLI)
            .then(res =>{
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            })
            .catch(err => done(new Error(err)));
        });

        it('it should GET name Sebastian',function(done){

            var user = new User({
                name:"Sebastian"
            });


            user.save()
            .then(user => {
                chai.request(app)
                .get('/user')
                .set('Authorization', config.TOKEN_CLI)
                .then(res =>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    res.body[0].name.should.be.eql('Sebastian');
                    done();
                })
                .catch(err => done(new Error(err)));
            })
            .catch(err => done(new Error(err)));
        });

    });

    
    describe('/POST user', function() {

        it('it should not POST a user without name field', function (done) {
            var user = {
                avatar: "http://imageserver.com/test.png"
            };

            chai.request(app)
                .post('/user')
                .set('Authorization', config.TOKEN_CLI)
                .send(user)
                .then(res=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name');
                    res.body.errors.name.should.have.property('kind').eql('required');
                    done();
                })
                .catch(err => done(new Error(err)));
        });

        it('it should POST a user ', function(done){
            var user = {
                name: "Sebastian",
                avatar: "wwww.example.com"
            };

            chai.request(app)
            .post('/user')
            .set('Authorization', config.TOKEN_CLI)
            .send(user)
            .then(res =>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully added!');
                res.body.user.should.have.property('name');
                done();
            })
            .catch(err => done(new Error(err)));
        });
    });


    describe('/GET/:id user', function() {
        it('it should GET a user by the given id', function(done){

            var user = new User({
                name: "Sebastian",
                avatar: "wwww.example.com"
            });

            user.save(function(err, user) {
                chai.request(app)
                .get('/user/' + user.id)
                .set('Authorization', config.TOKEN_CLI)
                .send(user)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('_id').eql(user.id);
                    done();
                });
            });
        });
    });

});
