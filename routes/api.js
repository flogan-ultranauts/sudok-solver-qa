'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
		//check if all the fields are filled in
		if(!req.body.puzzle || !req.body.coordinate || !req.body.value){
			res.send({ "error": "Required field(s) missing" });
			return;
		}
		
		//get the puzzle check it's validity
		let puzzleString = req.body.puzzle;
		let validate = solver.validate(puzzleString);
		
		if(typeof validate === 'object'){
			res.send(validate);
			return;
		}
		
		//get the cooridinates and value
		let [row, column] = [req.body.coordinate.match(/[A-Z]/ig).join(''), req.body.coordinate.match(/[^A-Z]/ig).join('')];
		let value = req.body.value;
		
		//check row, column, and region
		let checkRow = solver.checkRowPlacement(puzzleString, row, column, value);
		let checkCol = solver.checkColPlacement(puzzleString, row, column, value);
		let checkRegion = solver.checkRegionPlacement(puzzleString, row, column, value);
		
		//if coordinate or value is invalid
		if(typeof checkRow === 'object'){
			res.send(checkRow);
			return;
		}
		//the placement of value is fine
		if(checkRow && checkCol && checkRegion){
			res.send({valid: true});
			return;
		}
		
		let check = [];
		
		if(!checkRow){
			check.push('row');
		}
		if(!checkCol){
			check.push('column');
		}
		if(!checkRegion){
			check.push('region');
		}
		
		res.send({valid: false, conflict: check});
		return;
    });
    
  app.route('/api/solve')
    .post((req, res) => {
		//check if all the fields are filled in
		if(!req.body.puzzle){
			res.send({ "error": "Required field missing" });
			return;
		}
		
		//get the puzzle check it's validity
		let puzzleString = req.body.puzzle;
		let validate = solver.validate(puzzleString);
		//check validity
		if(typeof validate === 'object'){
			res.send(validate);
			return;
		}
		
		//get the cooridinates and value
		let solvedPuzzle = solver.solve(puzzleString);
		
		//if it's not an array
		if(!Array.isArray(solvedPuzzle)){
			res.send(solvedPuzzle);
			return;
		}
		
		//if the puzzle has been solved...
		let solvedPuzzleObj = {solution: ''};
		for(let i=0; i<solvedPuzzle.length; i++){
			solvedPuzzleObj.solution += solvedPuzzle[i].join('');
		}
		
		res.send(solvedPuzzleObj);
		return;
    });
};
