const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
import {puzzlesAndSolutions} from '../controllers/puzzle-strings';
let solver = new Solver();

suite('UnitTests', () => {
	test("#1 valid puzzle string of 81 characters", () => {	
		assert.strictEqual(solver.validate(puzzlesAndSolutions[0][0]), true, "Test 1 failed.");
	});
	test("#2 puzzle string with invalid characters", () => {
		//console.log(puzzlesAndSolutions[0][0].replace('.', '?'));
		assert.deepEqual(solver.validate(puzzlesAndSolutions[0][0].replace('.', '?')), { "error": "Invalid characters in puzzle" }, "Test 2 failed.");
	});
	test("#3 puzzle string that is not 81 characters in length", () => {
		assert.deepEqual(solver.validate(puzzlesAndSolutions[0][0].replace('.', '..')), { "error": "Expected puzzle to be 81 characters long" }, "Test 3 failed.");
	});
	test("#4 valid row placement", () => {
		assert.strictEqual(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 'A', '2', '3'), true, "Test 4 failed.");
	});
	test("#5 invalid row placement", () => {
		assert.strictEqual(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 'A', '2', '2'), false, "Test 5 failed.");
	});
	test("#6 valid Column placement", () => {
		assert.strictEqual(solver.checkColPlacement(puzzlesAndSolutions[0][0], 'A', '2', '3'), true, "Test 6 failed.");
	});
	test("#7 invalid Column placement", () => {
		assert.strictEqual(solver.checkColPlacement(puzzlesAndSolutions[0][0], 'A', '2', '2'), false, "Test 7 failed.");
	});
	test("#8 valid Region placement", () => {
		assert.strictEqual(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 'A', '2', '3'), true, "Test 6 failed.");
	});
	test("#9 invalid Region placement", () => {
		assert.strictEqual(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 'A', '2', '2'), false, "Test 9 failed.");
	});
	test("#10 Valid puzzle strings pass the solver", () => {
		assert.isArray(solver.solve(puzzlesAndSolutions[0][1]), "Test 10 failed.");
	});
	test("#11 Invalid puzzle strings fail the solver", () => {
		assert.deepEqual(solver.solve(puzzlesAndSolutions[0][0].replace('5', '4')), {error: 'Puzzle cannot be solved'}, "Test 11 failed.");
	});
	test("#12 Valid puzzle strings pass the solver", () => {
		assert.isArray(solver.solve(puzzlesAndSolutions[0][0]), "Test 12 failed.");
	});
});
