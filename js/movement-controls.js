import { game } from './game.js'

export class MovementControl {
	constructor() {
		this.eventEnabled = true;
		this.initKeyboard();
		this.initSwipeControls();
	}

	updateStatus(status) {
		this.eventEnabled = status;
	}

	initKeyboard() {
		window.addEventListener('keydown', (e) => {
			if (this.eventEnabled) {
				switch (e.key) {
					case 'ArrowUp':
						game.move('up');
						break;
					case 'ArrowDown':
						game.move('down');
						break;
					case 'ArrowLeft':
						game.move('left');
						break;
					case 'ArrowRight':
						game.move('right');
						break;
				}
			}
		});
	}

	initSwipeControls() {
		let touchStartX = 0, touchStartY = 0;

		window.addEventListener('mousedown', (e) => {
			touchStartX = e.clientX;
			touchStartY = e.clientY;
		});
		window.addEventListener('mouseup', (e) => {
			if (this.eventEnabled) {
				const touchEndX = e.clientX;
				const touchEndY = e.clientY;
				const deltaX = touchEndX - touchStartX;
				const deltaY = touchEndY - touchStartY;
			
				this.distanceCalculate(deltaX, deltaY);
			}
		});	

		window.addEventListener('touchstart', (e) => {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		});
		window.addEventListener('touchend', (e) => {
			if (this.eventEnabled) {
				const touchEndX = e.changedTouches[0].clientX;
				const touchEndY = e.changedTouches[0].clientY;
				const deltaX = touchEndX - touchStartX;
				const deltaY = touchEndY - touchStartY;
				
				this.distanceCalculate(deltaX, deltaY);
			}
		});
	}

	distanceCalculate (deltaX, deltaY, ) {
		const minSwipeDistance = 30;
	
		if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX > 0) game.move('right');
				else game.move('left');
			} else {
				if (deltaY > 0) game.move('down');
				else game.move('up');
			}
		}
	}
}
