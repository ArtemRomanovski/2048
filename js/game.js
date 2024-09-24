import { MessageDialog } from './message-dialog.js';
import { MovementControl } from './movement-controls.js';

import { Tile } from './tile.js';
import { Score } from './score.js';

function restartGame() {
	game.restart();
}

class GameField {
	constructor(size = 4) {
		this.size = size;
		this.messageDialog = new MessageDialog();
		this.initControls = new MovementControl();
		this.score = new Score();
		this.initRestartControl();
		this.setup();
	}

	initRestartControl() {
		this.restartBtn = document.getElementById('restart-btn').addEventListener('click', restartGame);
	}

	restart() {
		this.score.resetScore();
		this.messageDialog.close()
		this.setup();
	}

	setup() {
		this.isAnimating = false;
		this.moved = false;
		this.winStatus = false;
		this.grid = this.createGrid();
		this.score.updateScore();
		this.initControls.updateStatus(true);
		this.spawnTile();
		this.spawnTile();
		this.draw();
	}

	createGrid() {
		return Array.from({ length: this.size }, () =>
			Array.from({ length: this.size }, () => new Tile())
		);
	}

	spawnTile() {
		let emptyTiles = [];
		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				if (this.grid[row][col].isEmpty()) {
					emptyTiles.push({ row, col });
				}
			}
		}

		if (emptyTiles.length > 0) {
			const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
			this.grid[row][col] = new Tile(Math.random() > 0.9 ? 4 : 2);
		}
	}

	slideAndMerge(tiles) {
		tiles = tiles.filter(tile => !tile.isEmpty());
		
		for (let i = 0; i < tiles.length - 1; i++) {
			if (tiles[i].value === tiles[i + 1].value) {
				tiles[i].merge(tiles[i + 1]);
				this.score.updateScore(tiles[i + 1].value);
				tiles[i + 1] = new Tile();
				this.winStatus = this.winStatus || tiles[i].isMaxValue();
				this.moved = true;
			}
		}
		
		tiles = tiles.filter(tile => !tile.isEmpty());
		while (tiles.length < this.size) {
			tiles.push(new Tile());
		}
		
		return tiles;
	}

	hasMoves() {
		return this.grid.some((row, i) => {
			return row.some((tile, j) => {
				if (row[j + 1]) {
					return tile.value === row[j + 1].value;
				} 
				if (this.grid[i + 1]) {
					return tile.value === this.grid[i + 1][j].value;
				}
			});
		});
	}

	hasEmptyTiles() {
		return this.grid.some(((colums) => {
			return colums.some((tile) => tile.isEmpty());
		}));
	}

	move(direction) {
		if (this.isAnimating) {
			return;
		}

		this.initControls.updateStatus(false);
		this.isAnimating = true;
		this.moved = false;
		this.resetMergeStatus();

		for (let i = 0; i < this.size; i++) {
			let rowOrCol;
			switch (direction) {
				case 'left':
					rowOrCol = this.grid[i];
					break;
				case 'right':
					rowOrCol = [...this.grid[i]].reverse();
					break;
				case 'up':
					rowOrCol = this.grid.map(row => row[i]);
					break;
				case 'down':
					rowOrCol = this.grid.map(row => row[i]).reverse();
					break;
			}
			
			const newRowOrCol = this.slideAndMerge(rowOrCol);

			if (direction === 'right' || direction === 'down') newRowOrCol.reverse();

			for (let j = 0; j < this.size; j++) {
				if (direction === 'left' || direction === 'right') {
					if (this.grid[i][j].value !== newRowOrCol[j].value) {
						this.moved = true;
					}
					this.grid[i][j] = newRowOrCol[j];
				} else {
					if (this.grid[j][i].value !== newRowOrCol[j].value) {
						this.moved = true;
					}
					this.grid[j][i] = newRowOrCol[j];
				}
			}
		}

		if (this.moved) {
			this.spawnTile();
			this.draw();

			this.isAnimating = false;

			if (this.winStatus) {
				this.setGameStatus(true);
			}
		} else {
			if (!this.hasEmptyTiles() && !this.hasMoves()) {
				this.setGameStatus(false);
			}

			this.isAnimating = false;
		}

		this.initControls.updateStatus(true);
	}

	setGameStatus(success) {
		this.initControls.updateStatus(false);
		this.messageDialog.getMessage(success);
	}

	resetMergeStatus() {
		for (let row of this.grid) {
			for (let tile of row) {
				tile.merged = false;
			}
		}
	}

	draw() {
		const canvas = document.getElementById('gameCanvas');
		const ctx = canvas.getContext('2d');
		const size = canvas.width / this.size;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				const tile = this.grid[row][col];
				tile.drawTile(ctx, tile, row, col, size);
			}
		}
	}
}

export const game = new GameField();
