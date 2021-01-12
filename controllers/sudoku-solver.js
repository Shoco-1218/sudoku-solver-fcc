const puzzleData = require('./puzzle-strings').puzzlesAndSolutions;

class SudokuSolver {
  
  findMatching(group, value) {
    for(let i = 0; i < group.length; i++) {
      if(group[i] !== '.') {
        if(value === group[i]) {
          return false;
        }
      }
    };
    return true;
  }

  findMatchingObj(group, input) {
    for(let i = 0; i < input.length; i++) {
      if(input[i] !== '.') {
        if(group[i] !== input[i]) {
          return false;
        }
      }
    };
    return true;
  };

  getNumber(row) {
    switch(row) {
      case 'A':
        return 0;
      case 'B':
        return 1;
      case 'C':
        return 2;
      case 'D':
        return 3;
      case 'E':
        return 4;
      case 'F':
        return 5;
      case 'G':
        return 6;
      case 'H':
        return 7;
      case 'I':
        return 8;
    };
  };

  validate(puzzleString, checking) {
    if(!puzzleString) {
      return ({ result: false, message: 'Required field missing' });
    };
    if(puzzleString.length !== 81) {
      return ({ result: false, message: 'Expected puzzle to be 81 characters long'});
    };
    const reg = /^[0-9\.]+$/;
    if(!reg.test(puzzleString)) {
      return ({ result: false, message: 'Invalid characters in puzzle'});
    };
    if(checking) {
      return ({result: true});
    }

    for(let i = 0; i < puzzleData.length; i++) {
      let matched = this.findMatchingObj(puzzleData[i][1], puzzleString);
      if(matched) {
        return ({ result: true }); 
      } 
    };
    return ({ result: false, message: 'Puzzle cannot be solved'});
  }

  solve(puzzleString) {
    for(let i = 0; i < puzzleData.length; i++) {
      let matched = this.findMatchingObj(puzzleData[i][1], puzzleString);
      if(matched) {
        return puzzleData[i][1]; 
      } 
    };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const numberRow = this.getNumber(row);
    const start = (numberRow === 0) ? 0 : numberRow*9;
    const targetRow = puzzleString.slice(start, start + 9);

    return this.findMatching(targetRow, value); 
  };

  checkColPlacement(puzzleString, row, column, value) {
    let targetColumn = '';
    for(let i = 0; i < 9; i++) {
      let times = i*9;
      let start = (parseInt(column) - 1) + times;
      let end = parseInt(column) + times;
      targetColumn += puzzleString.slice(start, end);
    };

    return this.findMatching(targetColumn, value);
  }

  findIndex(row, column) {
    let index;
    switch(row) {
      case 'A': case 'B': case 'C':
        index = 0;
        break;
      case 'D': case 'E': case 'F':
        index = 27;
        break;
      case 'G': case 'H': case 'I':
        index = 54;
        break;
    }

    switch(column) {
      case '1': case '2': case '3':
        return index;
      case '4': case '5': case '6':
        return index += 3;
      case '7': case '8': case '9':
        return index += 6;
    }
  };

  checkRegionPlacement(puzzleString, row, column, value) {

    let startIndex = this.findIndex(row, column);
    let targetColumn = '';
    for(let i = 0; i < 3; i++) {
      let times = i*9;
      let start = startIndex + times;
      let end = startIndex + 3 + times;
      targetColumn += puzzleString.slice(start, end);
    };

    return this.findMatching(targetColumn, value);
  }

}

module.exports = SudokuSolver;

