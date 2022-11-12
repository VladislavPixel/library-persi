class ItemHistory {
	constructor(message, nameMethod, argumentMap) {
		this.message = message;
		this.nameMethod = nameMethod;
		this.argumentMap = argumentMap;
	}

	getSmallReport() {
		return `Method: ${this.nameMethod}; Message: ${this.message}`;
	}
}
