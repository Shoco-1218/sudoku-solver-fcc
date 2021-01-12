const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('Routing tests', function() {
    
    suite("POST /api/solves => crate an object", function() {

      test('Test POST /api/solve with valid puzzle string', function(done) {
        const input = 
        '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
        const output = 
        '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
        chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, output);
          done();
        });
      });

      test('Test POST /api/solve with missing puzzle string', function(done) {
        chai.request(server)
        .post('/api/solve')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
      });

      test('Test POST /api/solve with invalid characters', function(done) {
        const input = 
        'aa..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
        chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
      });

      test('Test POST /api/solve with incorrect length', function(done) {
        const input = 
        '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.';
        chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
      });

      test('Test POST /api/solve that cannot be solved', function(done) {
        const input = 
        '22..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
        chai.request(server)
        .post('/api/solve')
        .send({ puzzle: input })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
      });

    });





  });
}); 

