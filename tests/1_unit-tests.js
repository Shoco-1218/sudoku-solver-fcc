const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {

  test('Valid string of 81 characters', function(done) {
    const input = 
    '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const outcome = solver.validate(input);
    assert.equal(outcome.result, true);
    done();
  });

  test('Invalid characters', function(done) {
    const input = 
    'aa..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const outcome = solver.validate(input);
    assert.equal(outcome.result, false);
    assert.equal(outcome.message, 'Invalid characters in puzzle');
    done();
  });

  test('Not 81 characters length', function(done) {
    const input = 
    '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.';
    const outcome = solver.validate(input);
    assert.equal(outcome.result, false);
    assert.equal(outcome.message, 'Expected puzzle to be 81 characters long');
    done();
  });

  test('Valid row placement', function(done) {
    const puzzle = 
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const outcome = solver.checkRowPlacement()
  })
});
