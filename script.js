//! DoubleLinkedList

// const doubleLinkedList = new DoubleLinkedList(["pixel developer"]);

// doubleLinkedList.set({ value: { name: "pixel", age: 24 } });
// doubleLinkedList.set({ path: "value/color", value: "green" });
// doubleLinkedList.set({ path: "value/phone", value: "8-345-345-21-12" });
// doubleLinkedList.set({ path: "value/bob", value: "bim" });

// doubleLinkedList.addFirst(777);

// doubleLinkedList.set({ path: "value", value: 85 });

// console.log(doubleLinkedList, "doubleLinkedList");

//! HashTable

// const persistentHashTable = new HashTable({ name: "Vladislav", age: 24, job: "programmer", home: { target: "Tula", numerate: { code: 77 } } });

// persistentHashTable.set({ path: "value/name", value: "Pixel." });
// persistentHashTable.set({ path: "value/age", value: 33 });
// persistentHashTable.set({ path: "value/color", value: "blue" });
// persistentHashTable.set({ path: "value/home/numerate/code", value: 12345 });
// persistentHashTable.set({ path: "value/profession", value: "Frontend Developer" });
// console.log(persistentHashTable.get(5, "value/home"));

// console.log("Версия: ", persistentHashTable.versions.at(3));
// console.log("Версия: ", persistentHashTable.versions.at("+1"));
// console.log("Версия: ", persistentHashTable.versions.at("-1"));
// console.log("Версия: ", persistentHashTable.versions.at());
// console.log("Структура: ", persistentHashTable);

//! OneWayLinkedList
const persistentOneWayLinkedList = new OneWayLinkedList(["pixel"]);

persistentOneWayLinkedList.addFirst(100);
persistentOneWayLinkedList.addFirst(777);

persistentOneWayLinkedList.set({ value: 125 });
persistentOneWayLinkedList.set({ value: 555 });
persistentOneWayLinkedList.set({ value: 888 });
persistentOneWayLinkedList.set({ value: 1000 });
persistentOneWayLinkedList.set({ path: "value", value: "space" });
persistentOneWayLinkedList.set({ path: "value", value: 24 });

const searchNodeFn1 = (list) => {
	const node = list.findByKey({ path: "value", value: 24 });

	return node;
}
persistentOneWayLinkedList.set({ value: 4444444 }, [searchNodeFn1]);

const searchNodeFn2 = (list) => {
	const node = list.findByKey({ path: "value", value: 4444444 });

	return node;
}
persistentOneWayLinkedList.set({ value: 11 }, [searchNodeFn2]);

const searchNodeFn3 = (list) => {
	const node = list.findByKey({ path: "value", value: 11 });

	return node;
}
persistentOneWayLinkedList.set({ value: "T-34", path: "value" }, [searchNodeFn3]);

const searchNodeFn4 = (list) => {
	const node = list.findByKey({ path: "value", value: 100 });

	return node;
}
persistentOneWayLinkedList.set({ value: { name: "Vladisalv", job: "programmer", home: { target: "Moscow" } } }, [searchNodeFn4]);

const searchNodeFn5 = (list) => {
	const node = list.findByKey({ path: "value/home/target", value: "Moscow" });

	return node;
}
persistentOneWayLinkedList.set({ path: "value/home/target", value: "Tula" }, [searchNodeFn5]);

const searchNodeFn6 = (list) => {
	const node = list.findByKey({ path: "value/name", value: "Vladisalv" });

	return node;
}
persistentOneWayLinkedList.set({ value: "Valeria", path: "value/name" }, [searchNodeFn6]);

const searchNodeFn7 = (list) => {
	const node = list.findByKey({ path: "value", value: "pixel" });

	return node;
}
persistentOneWayLinkedList.set({ value: 900 }, [searchNodeFn7]);

const searchNodeFn8 = (list) => {
	const node = list.findByKey({ path: "value", value: 900 });

	return node;
}
persistentOneWayLinkedList.set({ value: 1500 }, [searchNodeFn8]);

const searchNodeFn9 = (list) => {
	const node = list.findByKey("T-34");

	return node;
}
persistentOneWayLinkedList.set({ value: "Globus" }, [searchNodeFn9]);

persistentOneWayLinkedList.addFirst("Upside");
persistentOneWayLinkedList.set({ value: 350 });

console.log(persistentOneWayLinkedList.versions.at());
const searchNodeFn10 = (node) => {
	const res = node.findByKey({ path: "value/home/target", value: "Moscow" });

	return res;
}
console.log(persistentOneWayLinkedList.get(12, "value/home", [searchNodeFn10]));

const searchNodeFn11 = (node) => {
	const res = node.findByKey({ path: "value/job", value: "programmer" });

	return res;
}
console.log(persistentOneWayLinkedList.get(13, "value/home/target", [searchNodeFn11]));

const searchNodeFn12 = (node) => {
	const res = node.findByKey({ path: "value", value: "pixel" });

	return res;
}
console.log(persistentOneWayLinkedList.get(6, "value", [searchNodeFn12]));
console.log(persistentOneWayLinkedList);

