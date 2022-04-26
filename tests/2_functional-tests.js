import {puzzlesAndSolutions} from '../controllers/puzzle-strings';
const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	test("valid puzzle string: POST request to /api/solve", (done)=>{
		chai.request(server)
			.post("/api/solve")
			.send({puzzle: puzzlesAndSolutions[0][0]})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {solution: puzzlesAndSolutions[0][1]});
				done();
			});
	});
	test("missing puzzle string: POST request to /api/solve", (done)=>{
		chai.request(server)
			.post("/api/solve")
			.send({})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, { "error": "Required field missing" });
				done();
			});
	});
	test("invalid characters: POST request to /api/solve", (done)=>{
		chai.request(server)
			.post("/api/solve")
			.send({puzzle: puzzlesAndSolutions[0][0].replace('.', '?')})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
				done();
			});
	});
	test("incorrect length: POST request to /api/solve", (done)=>{
		chai.request(server)
			.post("/api/solve")
			.send({puzzle: puzzlesAndSolutions[0][0].replace('.', '..')})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {"error": "Expected puzzle to be 81 characters long"});
				done();
			});
	});
	test("cannot be solved: POST request to /api/solve", (done)=>{
		chai.request(server)
			.post("/api/solve")
			.send({puzzle: puzzlesAndSolutions[0][0].replace('5', '2')})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {error: 'Puzzle cannot be solved'});
				done();
			});
	});
	test("puzzle placement with all fields: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0],
				coordinate: 'A1',
				value: '1'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {valid: true});
				done();
			});
	});
	test("puzzle placement with single placement conflict: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0],
				coordinate: 'A2',
				value: '9'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {valid: false, conflict: ['column']});
				done();
			});
	});
	test("puzzle placement with multiple placement conflicts: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0],
				coordinate: 'A2',
				value: '6'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {valid: false, conflict: ['column', 'region']});
				done();
			});
	});
	test("puzzle placement with all placement conflicts: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0],
				coordinate: 'A2',
				value: '2'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {valid: false, conflict: ['row', 'column', 'region']});
				done();
			});
	});
	test("puzzle placement with missing required fields: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0],
				coordinate: 'A2',
				value: ''
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, { "error": "Required field(s) missing" });
				done();
			});
	});
	test("puzzle placement with invalid characters: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0].replace('.', '?'),
				coordinate: 'A2',
				value: '3'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" });
				done();
			});
	});
	test("puzzle placement with incorrect length: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0].replace('.', '..'),
				coordinate: 'A2',
				value: '3'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {"error": "Expected puzzle to be 81 characters long"});
				done();
			});
	});
	test("puzzle placement with invalid placement coordinate: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0],
				coordinate: 'AA2',
				value: '3'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {error: 'Invalid coordinate'});
				done();
			});
	});
	test("puzzle placement with invalid placement value: POST request to /api/check", (done)=>{
		chai.request(server)
			.post("/api/check")
			.send({
				puzzle: puzzlesAndSolutions[0][0],
				coordinate: 'A2',
				value: '33'
			})
			.end((err, res)=>{
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.deepEqual(res.body, {error: 'Invalid value'});
				done();
			});
	});
});

