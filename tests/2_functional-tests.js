const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('Routing tests', function() {
    
    suite("POST /api/solves => create an object", function() {

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

    suite("POST /api/check => create an object", function() {

      test('Test POST /api/check with all fields', function(done) {
        const puzzle = 
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '7';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isBoolean(res.body.valid, true);
          done();
        });
      });

      test('Test with single placement confict', function(done) {
        const puzzle = 
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '6';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isBoolean(res.body.valid, false);
          assert.property(res.body, 'conflict');
          assert.equal(res.body.conflict, 'column');
          done();
        });
      });

      test('Test with multiple placement confict', function(done) {
        const puzzle = 
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '8';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isBoolean(res.body.valid, false);
          assert.property(res.body, 'conflict');
          assert.lengthOf(res.body.conflict, 2);
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'region');
          done();
        });
      });

      test('Test with all placement confict', function(done) {
        const puzzle = 
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '5';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isBoolean(res.body.valid, false);
          assert.property(res.body, 'conflict');
          assert.lengthOf(res.body.conflict, 3);
          assert.include(res.body.conflict, 'column');
          assert.include(res.body.conflict, 'row');
          assert.include(res.body.conflict, 'region');
          done();
        });
      });

      test('Test with missing required fields', function(done) {
        const puzzle = 
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
      });

      test('Test with invalid characters', function(done) {
        const puzzle = 
        'aa9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '7';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
      });

      test('Test with incorrect length', function(done) {
        const puzzle = 
        '.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '7';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
      });

      test('Test with invalid placement coordinate', function(done) {
        const puzzle = 
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = '11';
        const value = '7';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
      });

      test('Test with invalid placement value', function(done) {
        const puzzle = 
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = 'A';
        chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: coordinate, value: value })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
      });
    });

  });
}); 

