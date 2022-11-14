class HistoryChanges {
	constructor() {
		this.selectedIndexHistory = 0;
		this.arrHistoryChanges = [];
	}

	getCorrectIndex(indexChange) {
		if (indexChange === undefined) {
			this.selectedIndexHistory = this.arrHistoryChanges.length - 1;
		}

		const isNumber = typeof indexChange === "number";

		if (isNumber) {
			const change = this.arrHistoryChanges[indexChange];

			if (!(change instanceof ItemHistory)) {
				throw new Error(`You have entered an incorrect change index. The index must be in the range of the number of changes or must be "+1", "-1".`);
			}

			this.selectedIndexHistory = indexChange;
		}

		if (indexChange === "+1") {
			const change = this.arrHistoryChanges[this.selectedIndexHistory + 1];

			if (!(change instanceof ItemHistory)) {
				throw new Error(`You have entered an incorrect change index. The specified offset set the index to ${this.selectedIndexHistory + 1}. There is no such index in the history of changes.`);
			}

			this.selectedIndexHistory += 1;
		}

		if (indexChange === "-1") {
			const change = this.arrHistoryChanges[this.selectedIndexHistory - 1];

			if (!(change instanceof ItemHistory)) {
				throw new Error(`You have entered an incorrect change index. The specified offset set the index to ${this.selectedIndexHistory - 1}. There is no such index in the history of changes.`);
			}

			this.selectedIndexHistory -= 1;
		}

		if (indexChange === undefined || isNumber || indexChange === "+1" || indexChange === "-1") {
			return this.selectedIndexHistory;
		}

		throw new Error(`You have entered an incorrect change index. The index must be in the range of the number of changes or must be "+1", "-1".`);
	}

	at(indexChange) {
		if (this.arrHistoryChanges.length === 0) {
			throw new Error("The change history is empty. Operation at() version history is not supported.");
		}

		const index = this.getCorrectIndex(indexChange);

		return this.arrHistoryChanges[index];
	}

	display() {
		if (this.arrHistoryChanges.length === 0) {
			throw new Error("The change history is empty. Operation display() history is not supported.");
		}

		for (let i = 0; i < this.arrHistoryChanges.length; i++) {
			console.log(`${i + 1}) ${this.arrHistoryChanges[i].getSmallReport()}\n${"=".repeat(70)}`);
		}
	}

	registerChange(message, nameMethod, argumentMap) {
		const item = new ItemHistory(message, nameMethod, argumentMap);

		this.arrHistoryChanges.push(item);

		return this.arrHistoryChanges.length;
	}

	deleteFirstItemHistory() {
		const item = this.arrHistoryChanges.pop();

		return item;
	}
}