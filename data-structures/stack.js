class Stack {
	constructor() {
		this.list = new DoublyLinkedList();
		this.list.versions = new StoreVersions("stack");
	}

	get size() {
		return this.list.length;
	}

	push(value) {
		const { newLength } = this.list.addFirst(value);

		return newLength;
	}

	pop() {
		if (this.size === 0) {
			throw new Error("Operation pop is not supported in Empty structure. It is necessary to add a value, and after that call the removal.");
		}

		const { result } = this.list.deleteFirst();

		return result.value;
	}

	peek() {
		if (this.size === 0) {
			throw new Error("Operation peek is not supported in Empty structure.");
		}

		const nodeLatestVersion = this.list.head.applyListChanges();

		const clone = nodeLatestVersion.getClone();

		return clone.value;
	}
}
