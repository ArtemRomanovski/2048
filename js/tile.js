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
}
