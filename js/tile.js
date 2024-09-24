import { colors } from './constans.js';

export class Tile {
	constructor(value = 0) {
		this.value = value;
		this.merged = false;
	}

	isEmpty() {
		return this.value === 0;
	}

	isMaxValue() {
		return this.value === 2048;
	}

	merge(tile) {
		if (this.value === tile.value && !this.merged && !tile.merged) {
			this.value *= 2;
			this.merged = true;
		}
	}

	drawTile(ctx, tile, row, col, size) {
		const radius = 10;
		
		if (tile.value) {
			ctx.fillStyle = colors[tile.value] || '#3c3a32';

			this.roundRect(ctx, col * size + 10, row * size + 10, size - 20, size - 20, radius);
			
			ctx.font = `bold ${size / 3}px Roboto`;
			ctx.fillStyle = '#000000';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(tile.value, col * size + size / 2, row * size + size / 2);
		}
	}

	roundRect(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.arcTo(x + width, y, x + width, y + radius, radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
		ctx.lineTo(x + radius, y + height);
		ctx.arcTo(x, y + height, x, y + height - radius, radius);
		ctx.lineTo(x, y + radius);
		ctx.arcTo(x, y, x + radius, y, radius);
		ctx.closePath();
		ctx.fill();
	}
}
