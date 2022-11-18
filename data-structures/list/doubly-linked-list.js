class DoublyLinkedList extends TwoWayLinkedList {
	constructor(defaultData) {
		super();
		this.initialization(defaultData);
	}

	initialization(initData) {
		super.initialization(initData);
	}

	getIteratorForReverseValueLastVersion() {
		return new IteratorForReverseValueLastVersion(this.tail);
	}
}
