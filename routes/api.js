'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  const errorMessage = (res, target) => {
    const message = target.message;
    return res.status(200).json({ error: message });
  };

  app.route('/api/check')
  .post((req, res) => {

    const puzzle = req.body.puzzle;
    const validatePuzzle = solver.validate(puzzle);
    if(!validatePuzzle.result) {
      return errorMessage(res, validatePuzzle);
    };

    const value = req.body.value;
    const coordinate = req.body.coordinate;
    if(!value || !coordinate) {
      res.status(200).json({ error: 'Required field(s) missing' });
      return;
    };

    const row = coordinate.split('')[0].toUpperCase();
    const column = coordinate.split('')[1];
    let conflictArray= [];
    
    const validateInput = solver.validateInput(row, column, value);
    if(!validateInput.result) {
      return errorMessage(res, validateInput);
    };

    const resultRow = solver.checkRowPlacement(puzzle, row, column, value);
    if (!resultRow) {
      conflictArray.push("row");
    }
    const resultCol = solver.checkColPlacement(puzzle, row, column, value);
    if (!resultCol) {
      conflictArray.push("column");
    }
    const resultRegion = solver.checkRegionPlacement(puzzle, row, column, value);
    if (!resultRegion) {
      conflictArray.push("region");
    }

    if(resultRow && resultCol && resultRegion) {
      res.status(200).json({ valid: true });
      return;
    }
    res.status(200).json({ valid: false, conflict: conflictArray });
  });

  app.route('/api/solve')
  .post((req, res) => {
    const puzzle = req.body.puzzle;
    const validatePuzzle = solver.validate(puzzle);
    if(!validatePuzzle.result) {
      return errorMessage(res, validatePuzzle);
    };

    const solved = solver.converter(puzzle);
    if(!solved.result) {
      return errorMessage(res, solved);
    }
    const answerPuzzle = solved.puzzle;
    res.status(200).json({ solution: answerPuzzle });
  });
};
