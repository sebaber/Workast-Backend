const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const config = require('../config/config');

chai.use(chaiHttp);

describe('WELCOME',function(){

    describe('/GET index screen without Access Token',function(){

        it('It should return a Forbidden page',function(done){

            chai.request(app)
                .get('/')
                .end(function(err,res){
                    res.should.have.status(403);
                    res.should.have.property('type').equal('text/html');
                    done();
                });
        });
    });

    describe('/GET index screen with Access Token',function(){

        it('It should return a welcome page',function(done){

            chai.request(app)
                .get('/')
                .set('Authorization', config.TOKEN_CLI)
                .end(function(err,res){
                    res.should.have.status(200);
                    res.should.have.property('type').equal('text/html');
                    done();
                });
        });
    });

    describe('/GET page dont exist',function(){

        it('It should return a 404 not found page',function(done){

            chai.request(app)
                .get('/pagenotexist')
                .set('Authorization', config.TOKEN_CLI)
                .end(function(err,res){
                    res.should.have.status(404);
                    res.should.have.property('type').equal('text/html');
                    done();
                });
        });
    });
});
