
//declare globals
const col = 10;
const row = 20;
const sq = 40;
const vacant = 'black';
const cvs = document.querySelector('#canvas');
const ctx = cvs.getContext('2d');
let gameOver = false;

//create and draw the board
let board = [];
for(let r = 0; r < row; r++) {
	board[r] = [];
	for(let c = 0; c < col; c++) {
		board[r][c] = vacant;
		draw(c, r, board[r][c]);
	}
}

//create a blueprint function to draw to the board
function draw(x, y, color) {
	//set the drawing specifications
	ctx.fillStyle = color;
	ctx.fillRect(x * sq, y * sq, sq, sq);
	ctx.strokeStyle = 'white';
	ctx.strokeRect(x * sq, y * sq, sq, sq);
}

//create a blueprint object for the tetrominos
function Piece(tetromino, color) {
	//create the properties
	this.tetromino = tetromino;
	this.color = color;
	this.tetrominoN = 0;
	this.activeTetromino = this.tetromino[this.tetrominoN];
	this.x = 0;
	this.y = -1;
	if (this.tetromino === pieces[5][0]) this.y = -2;
}

//create an array to hold all of the tetrominos
const pieces = [
	[Z, 'red'],
	[S, 'limegreen'],
	[T, 'yellow'],
	[O, 'blue'],
	[L, '#b938ff'],
	[I, 'cyan'],
	[J, 'orange']
]

function randomPiece() {
	let r = Math.floor(Math.random()*pieces.length);
	return new Piece(pieces[r][0], pieces[r][1]);
}

//grab a piece
let p = randomPiece();

//draw a piece to the board
// drawPiece(p.activeTetromino, p.color);

//create a blueprint function to draw tetrominos to the board
function drawPiece(piece, color) {
	for(let r = 0; r < piece.length; r++) {
		for(let c = 0; c < piece.length; c++) {
			if (!piece[r][c]) continue;
			draw(c + p.x, r + p.y, color);
		}
	}
}


//control the piece
document.addEventListener('keydown', (e) => {
	//check user's input
	if(e.keyCode === 37) p.moveLeft();
	else if(e.keyCode === 38) p.rotate();
	else if(e.keyCode === 39) p.moveRight();
	else if (e.keyCode === 40) p.moveDown();
});

Piece.prototype.moveDown = function() {
	if(!this.collision(0, 1, this.activeTetromino)) {
		drawPiece(this.activeTetromino, vacant);
		this.y++;
		drawPiece(this.activeTetromino, this.color);		
	} else {
		this.lockPiece(this.activeTetromino);
		checkForPoints();
		p = randomPiece();
	}
}

Piece.prototype.moveLeft = function() {
	if(!this.collision(-1, 0, this.activeTetromino)) {
		drawPiece(this.activeTetromino, vacant);
		this.x--;
		drawPiece(this.activeTetromino, this.color);
	}
}

Piece.prototype.moveRight = function() {
	if(!this.collision(1, 0, this.activeTetromino)) {
		drawPiece(this.activeTetromino, vacant);
		this.x++;
		drawPiece(this.activeTetromino, this.color);
	}
}

Piece.prototype.rotate = function() {
	let nextPattern = this.tetromino[(this.tetrominoN + 1) % 4];

	let kick = 0;
	if (this.collision(0, 0, nextPattern)) {
		if(this.x < col/2) {
			if(this.x === -2) {
				kick = 2;
			} else {
				kick = 1; //kick from right
			}
		} 
		if(this.x > col/2) {
			if(this.tetromino === pieces[5][0]) {
				kick = -2;
			} else {
				kick = -1; //kick from left
			}
		}	
	}

	if(!this.collision(kick, 0, nextPattern)) {
		drawPiece(this.activeTetromino, vacant);
		this.x += kick;
		this.tetrominoN = (this.tetrominoN + 1) % 4;
		this.activeTetromino = this.tetromino[this.tetrominoN];
		drawPiece(this.activeTetromino, this.color);
	} 
}

Piece.prototype.collision = function(x, y, piece) {
	for (let r = 0; r < piece.length; r++) {
		for(let c = 0; c < piece.length; c++) {
			if(!piece[r][c]) continue;

			let newX = this.x + c + x;
			let newY = this.y + r + y;

			if(newX < 0 || newX >= col || newY >= row) return true;
			if(board[newY][newX] !== vacant) return true;
		}
	}
	return false;
}

Piece.prototype.lockPiece = function(piece) {
	for (let r = 0; r < piece.length; r++) {
		for(let c = 0; c < piece.length; c++) {
			if(!piece[r][c]) continue;
			if(this.y + r <= 0) {
				alert('Game Over');
				gameOver = true;
				break;
			}

			board[this.y + r][this.x + c] = this.color;
		}
	}
}

function checkForPoints() {
	for(let r = 0; r < row; r++) {
		let new_rows = [];
		if(board[r].every(squareCheck)) { // board[r].forEach((sq) => {});
			for(let c = 0; c < col; c++) {
				new_rows.unshift(vacant);
			}
			board.splice(r, 1);
			board.unshift(new_rows);
			reDraw();
		}
	}

	function squareCheck(sq) {
		if(sq !== vacant) return true;
		else return false;
	}

	function reDraw() {
		for(let r = 0; r < row; r++) {
			for(let c = 0; c < col; c++) {
				draw(c, r, board[r][c]);
			}
		}
	}
}

//start a time to set as a refrence for the dropstart
let dropStart = Date.now();
//create a blueprint function to drop the piece
function drop() {
	//grab the current time
	let now = Date.now();
	//create a var to hold the difference of the current time
	let delta = now - dropStart; //------Why can't these be switched------
	if(delta > 800) {
		dropStart = Date.now();
		p.moveDown();
		//------put request animation here------
	}

	if (!gameOver) requestAnimationFrame(drop);
}

drop();

 // 	var test_arr = [['red'],['white'],['blue'],['green']];

	// var result = test_arr.filter(function(v,i) { 
	//      if (v




	//       === 'blue'){ test_arr.splice(i,1) } 
	// }); 

	// console.log(test_arr);

// var array = [
// [0, 'yo', 3.21],
// ["yellow", "yellow", "yellow", "yellow"],
// [3, 6, 4, 2],
// [4, 54, 21], 
// ["array", "black"]
// ];

// let new_array = array.splice(1, 3);
