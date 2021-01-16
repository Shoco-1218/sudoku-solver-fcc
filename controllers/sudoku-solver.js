
class SudokuSolver {

  // Validation
  validate(puzzleString) {
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
    return ({ result: true });
  };


  // Recursive function to find the answer
  converter(puzzle) {
    
    let array = [];
    for(let i = 0; i < puzzle.length; i++) {
      if(puzzle[i] == '.') {
        let zero = parseInt(puzzle[i]);
        zero = 0;
        array.push(zero);
      } else {
        let int = parseInt(puzzle[i]);
        array.push(int);
      }
    }
    const solution = this.solve(array);
    return (solution == null) 
    ? ({ result: false, message: 'Puzzle cannot be solved' }) 
    : ({ result: true, puzzle : solution.join('') });
  };
  
  solve(puzzle) {
    if(this.checkEmpty(puzzle)) {
      return puzzle;
    } else {
      let index = puzzle.indexOf(0);
      for(let number= 1; number < 10; number++) {
        let newPuzzle = [...puzzle];
        newPuzzle[index] = number;
        let validation = this.validateSection(newPuzzle, index);
        if(!validation) {
          continue;
        } else {
          let solution = this.solve(newPuzzle);
          if(!solution) {
            continue;
          } else {
            return solution;
          }
        };
      };
      return null;
    };
  };
  
  checkEmpty(puzzle) {
    const result = puzzle.includes(0);
    return !result;
  };
  
  validateSection(puzzle, index) {
    return (this.row(puzzle, index) 
    && this.col(puzzle, index) 
    && this.region(puzzle, index)) ? true : false;
  };
  
  checkDuplicate(array, element) {
    for (let i = 0; i < array.length; i++) {
      if(element !== 0 && array[i] == element) {
        return true;
      };
    };
    return false;
  };
  
  row(puzzle, index) {
    const rowIndex = Math.floor(index/9);
    const start = rowIndex*9;
    let store =[];
    for(let j = 0; j < 9; j++) {
      let duplicate = this.checkDuplicate(store, puzzle[start + j]);
      if(duplicate) {
        return false;
      };
      store.push(puzzle[start + j]);
    };
    return true;
  };
  
  col(puzzle, index) {
    const colIndex = index % 9;
    let store =[];
    for(let j = 0; j < puzzle.length; j += 9) {
      let duplicate = this.checkDuplicate(store, puzzle[colIndex + j]);
      if(duplicate) {
        return false;
      };
      store.push(puzzle[colIndex + j]);
    };
    return true;
  };
  
  getIndex(row, column) {
    let index;
    switch(row) {
      case 0:
        index = 0;
        break;
      case 1:
        index = 27;
        break;
      case 2:
        index = 54;
        break;
    };
  
    switch(column) {
      case 0:
        return index;
      case 1:
        return index += 3;
      case 2:
        return index += 6;
    };
  };
  
  region(puzzle, index) {
    const rowGroup = Math.floor((index /9) / 3);
    const colGroup = Math.floor((index % 9) /3);
    const start = this.getIndex(rowGroup, colGroup);
    let store =[];
    for(let i = 0; i <= 18; i += 9) {
      for(let j = 0; j < 3; j++) {
        let duplicate = this.checkDuplicate(store, puzzle[start + j + i]);
        if(duplicate) {
          return false;
        }
        store.push(puzzle[start + j + i]);
      }
    };
    return true;
  };  


  // Individual search
  findMatching(group, value) {
    for(let i = 0; i < group.length; i++) {
      if(group[i] !== '.') {
        if(value === group[i]) {
          return false;
        }
      }
    };
    return true;
  };

  getRowNumber(row) {
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

  validateInput(row, column, value) {
    const regNum = /^[0-9]+$/;
    const regAlpha = /^[a-zA-Z]$/;
    if(!regAlpha.test(row) || !regNum.test(column)) {
      return ({ result: false, message: 'Invalid coordinate'});
    };
    if(!regNum.test(value)) {
      return ({ result: false, message: 'Invalid value' });
    };
    return ({ result: true});
  };

  checkRowPlacement(puzzleString, row, column, value) {
    const numberRow = this.getRowNumber(row);
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
  };

  
  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = this.getRowNumber(row);
    const rowGroup = Math.floor(rowIndex / 3);
    const colGroup = Math.floor(column / 3);
    const startIndex = this.getIndex(rowGroup, colGroup);
    let targetColumn = '';
    for(let i = 0; i < 3; i++) {
      let times = i*9;
      let start = startIndex + times;
      let end = startIndex + 3 + times;
      targetColumn += puzzleString.slice(start, end);
    };

    return this.findMatching(targetColumn, value);
  };

}

module.exports = SudokuSolver;

