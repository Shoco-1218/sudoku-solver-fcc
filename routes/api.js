'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      const puzzle = req.body.puzzle;
      const validatePuzzle = solver.validate(puzzle, true);
      if(!validatePuzzle.result) {
        const message = validatePuzzle.message;
        res.status(200).json({ error: message });
        return;
      }

      const value = req.body.value;
      const reg = /^[0-9]+$/;
      if(!reg.test(value)) {
        res.status(200).json({ error: 'Invalid value' });
        return;
      };
      
      const coordinate = req.body.coordinate;
      const reg2 = /^[a-iA-I]{1}[0-9]{1}$/;
      if(!reg2.test(coordinate)) {
        res.status(200).json({ error: 'Invalid coordinate' });
        return;
      }

      const row = coordinate.split('')[0].toUpperCase();
      const column = coordinate.split('')[1];
      let conflictArray= [];

      const resultRow = solver.checkRowPlacement(puzzle, row, column, value);
      if (!resultRow) {
        conflictArray.push("row");
      }
      const resultCol = solver.checkColPlacement(puzzle, row, column, value);
      if (!resultCol) {
        conflictArray.push("col");
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
      const validatePuzzle = solver.validate(puzzle, false);
      if(!validatePuzzle.result) {
        const message = validatePuzzle.message;
        res.status(200).json({ error: message });
        return;
      }
      const answerString = solver.solve(puzzle);
      res.status(200).json({ solution: answerString });
    });
};
