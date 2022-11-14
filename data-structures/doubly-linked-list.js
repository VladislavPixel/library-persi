class DoublyLinkedList extends TwoWayLinkedList {
	constructor(defaultData) {
		super(defaultData);
		this.versions = new StoreVersions("doublyLinkedList");
	}

	getIteratorForReverseValueLastVersion() {
		return new IteratorForReverseValueLastVersion(this.tail);
	}
}
