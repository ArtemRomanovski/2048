export class MessageDialog {
	constructor() {
		this.messageContainer = document.querySelector(".game-message-container");
	}

	getMessage(success) {
		const type = success ? "game-won" : "game-over";
		const message = success ? "Уровень пройден!" : "Нельзя сделать ход!";

		this.messageContainer.classList.remove('hidden');
		this.messageContainer.classList.add(type);
		this.messageContainer.getElementsByTagName('p')[0].textContent = message;
	}

	clearMessage() {
		this.messageContainer.classList.remove("game-won");
		this.messageContainer.classList.remove("game-over");
	}

	close() {
		this.clearMessage();
		this.messageContainer.classList.add('hidden');
	}
}
