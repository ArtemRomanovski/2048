export class Score {
	constructor() {
		this.score = 0;
		this.scoreContainer = document.querySelector(".score-container");
	}

	updateScore(value) {
		if (value) {
			this.score += value;
		}
		this.scoreContainer.innerHTML = `Счёт: ${this.score}`;
	}

	resetScore() {
		this.score = 0;
	}
}
