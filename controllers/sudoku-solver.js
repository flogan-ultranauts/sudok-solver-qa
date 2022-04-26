let regPat = /[^1-9|^\.]+/;
const rowToNum = {
	'a': 0,
	'b': 1,
	'c': 2,
	'd': 3,
	'e': 4,
	'f': 5,
	'g': 6,
	'h': 7,
	'i': 8
}

class SudokuSolver {

  validate(puzzleString) {
	if(puzzleString.length !== 81){
		return { "error": "Expected puzzle to be 81 characters long" };
	}
	if(regPat.test(puzzleString)){
		return { "error": "Invalid characters in puzzle" };
	}
	return true;
  }
  
  checkRowPlacement(puzzleString, row, column, value) {
	if(!/[1-9]/.test(value) || value.length !== 1){
		return {error: 'Invalid value'}; //if value is invalid
	}
	if(!/[A-I]/i.test(row) || !/[1-9]/.test(column) || row.length !==1 || column.length !==1){
		return {error: 'Invalid coordinate'}; //if coordinate is invalid
	}
	//run the rest since nothing is wrong with the corridinate or value
	let board = sudokuBoard(puzzleString);
	let [rowN, colN, valueN] = [rowToNum[row.toLowerCase()], Number(column)-1, Number(value)];
	for(let i=0; i<board[rowN].length; i++){
		if(board[rowN][i] === valueN && i !== colN){
			return false; //there is a conflict
		}
	}
	return true; //there is no conflict
  }

  checkColPlacement(puzzleString, row, column, value) {
	if(!/[1-9]/.test(value) || value.length !== 1){
		return {error: 'Invalid value'};
	}
	if(!/[A-I]/i.test(row) || !/[1-9]/.test(column) || row.length !==1 || column.length !==1){
		return {error: 'Invalid coordinate'};
	}
	//run the rest since nothing is wrong with the corridinate or value
	let board = sudokuBoard(puzzleString);
	let [rowN, colN, valueN] = [rowToNum[row.toLowerCase()], Number(column)-1, Number(value)];
	
	for(let i=0; i<9; i++){
		if(board[i][colN] === valueN && i !== rowN){
			return false; //there is a conflict
		}
	}
	return true; //there is no conflict
  }

  checkRegionPlacement(puzzleString, row, column, value) {
	if(!/[1-9]/.test(value) || value.length !== 1){
		return {error: 'Invalid value'}; //if value is invalid
	}
	if(!/[A-I]/i.test(row) || !/[1-9]/.test(column) || row.length !==1 || column.length !==1){
		return {error: 'Invalid coordinate'}; //if coordinate is invalid
	}
	
	//run the rest since nothing is wrong with the corridinate or value
	let board = sudokuBoard(puzzleString);
	let [rowN, colN, valueN] = [rowToNum[row.toLowerCase()], Number(column)-1, Number(value)];
	//run the rest since nothing is wrong with the corridinate or value
	let k = Math.floor(rowN/3)*3;
	let l = Math.floor(colN/3)*3;
	
	for(let h=k; h<k+3; h++){
		for(let v=l; v<l+3; v++){
			if(board[h][v] === valueN && (h !== rowN || v !== colN)){
				return false; //there is confilt
			}
		}
	}
	return true; //there is no conflict
  }

  solve(puzzleString) {
    let board = sudokuBoard(puzzleString);
	if(isFullAndCorrect(board)){
		return board;
	}
	
	let solvedBoard = sudokuSolver(board);
	
	if(isFullAndCorrect(solvedBoard)){
		return solvedBoard;
	}else{
		return {error: 'Puzzle cannot be solved'};
	}
  }
}

//turn the string into an 2D array
function sudokuBoard(puzzleString){
	let puzzle = puzzleString.split('');
	let board = [];
	
	for(let i=0; i<puzzle.length; i++){
		if(puzzle[i] !== '.'){
			puzzle[i] = Number(puzzle[i]);
		}
	}
	for(let i=0; i+9<=puzzle.length; i+=9){
		board.push(puzzle.slice(i,i+9));
	}
	
	return board;
}

//finding all the possible entries avalible for a square
function possibleEntries(board, i, j){
	let possibilityList = {};
	for(let x=1; x<10; x++){
		possibilityList[x] = '.';
	}
	
	//going horizontal
 	for(let h=0; h<9; h++){
		if(board[i][h] !== '.'){
			possibilityList[board[i][h]] = 0;
		}
	} 
	
	//going vertical
 	for(let v=0; v<9; v++){
		if(board[v][j] !== '.'){
			possibilityList[board[v][j]] = 0;
		}
	}
	
	let k = Math.floor(i/3)*3;
	let l = Math.floor(j/3)*3;
	
	for(let h=k; h<k+3; h++){
		for(let v=l; v<l+3; v++){
			if(board[h][v] !== '.'){
				possibilityList[board[h][v]] = 0;
			}
		}
	}
	
	for(let x=1; x<10; x++){
		if(possibilityList[x] === '.'){
			possibilityList[x] = x;
		}
	}
	
	return possibilityList;
}

function sudokuSolver(board){
	//For coordinations and storing possibilites
	let [i, j, possibilities] = [0, 0, {}];

	//is is the board full and is it valid
	if(isFullAndCorrect(board)){
		return board;
	}else{//the board is not full of numbers
		
		//Find the first vacant(.) spot
		for(let x=0; x<9; x++){
			for(let y=0; y<9; y++){
 				if(board[x][y] === '.'){
					i = x;
					j = y;
					x = 100;
					break;
				}
			}
		}
		
		//find the possibilities
		possibilities = possibleEntries(board, i, j);
		
		for(let x=1; x<10; x++){
			if(possibilities[x] !== 0){
				board[i][j] = possibilities[x];
				sudokuSolver(board);
			}
			if(isFullAndCorrect(board)) break;
		}
		if(!isFullAndCorrect(board)){
			//console.log("i'm in here");
			board[i][j] = '.';
		}
	}
	return board;
}

function checkRow(board, value, row, col){ //row and cols are indexes
	for(let i=0; i<board[row].length; i++){
		if(board[row][i] === value && i !== col){
			return false;
		}
	}
	return true;
}
function checkCol(board, value, row, col){ //row and cols are indexes
	for(let i=0; i<9; i++){
		//value in col somewhere other than the current row
		if(board[i][col] === value && i !== row){
			return false;
		}
	}
	return true;
}
function checkRegion(board, value, row, col){ //row and cols are indexes
	let k = Math.floor(row/3)*3;
	let l = Math.floor(col/3)*3;

	for(let h=k; h<k+3; h++){
		for(let v=l; v<l+3; v++){
			if(board[h][v] === value && (h !== row || v !== col)){
				return false;
			}
		}
	}
	return true;
}
function isFullAndCorrect(board){
	
	//is the board full of numbers?
	let isFull = board.every(ele=>{
		return ele.every(e=>{
			return e !== '.';
		});
	});
	if(!isFull){//no need to go on if it's not full
		return false;
	}
	
	//check that every number doesn't contradict with other numbers in the board
	let isCorrect = board.every((row, rowIndex)=>{
		return row.every((value, colIndex)=>{
			return checkRow(board, value, rowIndex, colIndex) && checkCol(board, value, rowIndex, colIndex) && checkRegion(board, value, rowIndex, colIndex);
		});
	});
	
	if(isFull && isCorrect){
		return true;
	}
	
	return false;
}

module.exports = SudokuSolver;