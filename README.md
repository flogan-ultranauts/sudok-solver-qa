# [Sudoku Solver](#)
# Wrote the following tests in js:

* Logic handles a valid puzzle string of 81 characters
* Logic handles a puzzle string with invalid characters (not 1-9 or .)
* Logic handles a puzzle string that is not 81 characters in length
* Logic handles a valid row placement
* Logic handles an invalid row placement
* Logic handles a valid column placement
* Logic handles an invalid column placement
* Logic handles a valid region (3x3 grid) placement
* Logic handles an invalid region (3x3 grid) placement
* Valid puzzle strings pass the solver
* Invalid puzzle strings fail the solver
* Solver returns the expected solution for an incomplete puzzle
* Solve a puzzle with valid puzzle string: POST request to /api/solve
* Solve a puzzle with missing puzzle string: POST request to /api/solve
* Solve a puzzle with invalid characters: POST request to /api/solve
* Solve a puzzle with incorrect length: POST request to /api/solve
* Solve a puzzle that cannot be solved: POST request to /api/solve
* Check a puzzle placement with all fields: POST request to /api/check
* Check a puzzle placement with single placement conflict: POST request to /api/check
* Check a puzzle placement with multiple placement conflicts: POST request to /api/check
* Check a puzzle placement with all placement conflicts: POST request to /api/check
* Check a puzzle placement with missing required fields: POST request to /api/check
* Check a puzzle placement with invalid characters: POST request to /api/check
* Check a puzzle placement with incorrect length: POST request to /api/check
* Check a puzzle placement with invalid placement coordinate: POST request to /api/check
* Check a puzzle placement with invalid placement value: POST request to /api/check

To initialize project run ``npm start``

