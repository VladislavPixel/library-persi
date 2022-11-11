class HistoryChanges {
	constructor() {
		this.selectedIndexHistory = 0;
		this.arrHistoryChanges = [];
	}

	at(indexChange) {
		if (this.arrHistoryChanges.length === 0) {
			throw new Error("The change history is empty. Operation at() version history is not supported.");
		}

		if (indexChange === undefined) {
			this.selectedIndexHistory = this.arrHistoryChanges.length - 1;

			return this.arrHistoryChanges[this.selectedIndexHistory];
		}

		if (typeof indexChange === "number") {
			const change = this.arrHistoryChanges[indexChange];

			if (change instanceof Object) {
				this.selectedIndexHistory = indexChange;

				return change;
			}

			throw new Error(`You have entered an incorrect change index. The index must be in the range of the number of changes or must be "+1", "-1".`);
		}

		if (indexChange === "+1") {
			const change = this.arrHistoryChanges[this.selectedIndexHistory + 1];

			if (change instanceof Object) {
				this.selectedIndexHistory += 1;

				return change;
			}

			throw new Error(`You have entered an incorrect change index. The specified offset set the index to ${this.selectedIndexHistory + 1}. There is no such index in the history of changes.`);
		}

		if (indexChange === "-1") {
			const change = this.arrHistoryChanges[this.selectedIndexHistory - 1];

			if (change instanceof Object) {
				this.selectedIndexHistory -= 1;

				return change;
			}

			throw new Error(`You have entered an incorrect change index. The specified offset set the index to ${this.selectedIndexHistory - 1}. There is no such index in the history of changes.`);
		}

		throw new Error(`You have entered an incorrect change index. The index must be in the range of the number of changes or must be "+1", "-1".`);
	}

	display() {
		if (this.arrHistoryChanges.length === 0) {
			throw new Error("The change history is empty. Operation display() history is not supported.");
		}

		for (let i = 0; i < this.arrHistoryChanges.length; i++) {
			console.log(`${i + 1}) ${this.arrHistoryChanges[i].action}\n${"=".repeat(50)}`);
		}
	}

	registerChange(message) {
		this.arrHistoryChanges.push({ action: message });

		return this.arrHistoryChanges.length;
	}
}