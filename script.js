//! DoublyLinkedList

const doublyLinkedList = new DoublyLinkedList(["pixel developer"]);

doublyLinkedList.set({ value: 2000 });
doublyLinkedList.set({ value: 2500 });
doublyLinkedList.set({ value: 3000 });

doublyLinkedList.addLast("viva");

doublyLinkedList.addFirst("space");

doublyLinkedList.set({ value: "color" });

const iteratorReverse = doublyLinkedList.getIteratorForReverseValueLastVersion();

console.log(doublyLinkedList, "двусвязанный лист");

for (const val of iteratorReverse) {
	console.log(val);
}


//! TwoWayLinkedList

// const twoWayLinkedList = new TwoWayLinkedList(["pixel developer"]);

// twoWayLinkedList.set({ value: { name: "pixel", age: 24 } });
// twoWayLinkedList.set({ path: "value/color", value: "green" });
// twoWayLinkedList.set({ path: "value/phone", value: "8-345-345-21-12" });
// twoWayLinkedList.set({ path: "value/bob", value: "bim" });

// twoWayLinkedList.addFirst(777);

// twoWayLinkedList.set({ value: 2000 });
// twoWayLinkedList.set({ value: 2500 });
// twoWayLinkedList.set({ value: 3000 });
// twoWayLinkedList.set({ value: 4000 });

// const searchNode55 = (list) => {
// 	const node = list.findByKey({ path: "value/color", value: "green" });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value/name", value: "max" }, [searchNode55]);

// twoWayLinkedList.addFirst(123213123);

// const searchNode56 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 4000 });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value", value: 4500 }, [searchNode56]);

// const searchNode57 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 4500 });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value", value: 5500 }, [searchNode57]);

// const searchNode58 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 5500 });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value", value: 6500 }, [searchNode58]);

// twoWayLinkedList.set({ path: "value", value: 85 });
// twoWayLinkedList.set({ path: "value", value: 120 });
// twoWayLinkedList.set({ path: "value", value: 133 });
// twoWayLinkedList.set({ path: "value", value: 250 });

//twoWayLinkedList.addLast(900000000000)

// const searchNodeFn33 = (list) => {
// 	const node = list.findByKey({ path: "value/bob", value: "bim" });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value/name", value: "VLADISLAV" }, [searchNodeFn33])

// const searchNodeFn34 = (list) => {
// 	const node = list.findByKey({ path: "value/color", value: "green" });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value/name", value: "Upside" }, [searchNodeFn34])

// const searchNodeFn35 = (list) => {
// 	const node = list.findByKey({ path: "value/phone", value: "8-345-345-21-12" });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value/name", value: "Zmey" }, [searchNodeFn35])

// const searchNodeFn36 = (list) => {
// 	const node = list.findByKey({ path: "value/phone", value: "8-345-345-21-12" });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value/name", value: "LOL" }, [searchNodeFn36])

//twoWayLinkedList.addLast("note");

// const searchNodeFn37 = (list) => {
// 	const node = list.findByKey({ path: "value/phone", value: "8-345-345-21-12" });

// 	return node;
// }

// twoWayLinkedList.set({ path: "value/name", value: "LOLipop" }, [searchNodeFn37])

// const searchNode39 = (list) => {
// 	const node = list.findByKey({ path: "value/name", value: "LOLipop" });

// 	return node;
// }

// console.log(twoWayLinkedList.get(11, "value/age", [searchNode39]));

//console.log(twoWayLinkedList, "twoWayLinkedList");

//! HashTable

//const persistentHashTable = new HashTable({ name: "Vladislav", age: 24, job: "programmer", home: { target: "Tula", numerate: { code: 77 } } });

//persistentHashTable.set({ path: "value/name", value: "Pixel." });
// persistentHashTable.set({ path: "value/age", value: 33 });
// persistentHashTable.set({ path: "value/color", value: "blue" });
//persistentHashTable.set({ path: "value/home/numerate/code", value: 12345 });
// persistentHashTable.set({ path: "value/profession", value: "Frontend Developer" });
// console.log(persistentHashTable.get(5, "value/home"));

// console.log("Версия: ", persistentHashTable.versions.at(3));
// console.log("Версия: ", persistentHashTable.versions.at("+1"));
// console.log("Версия: ", persistentHashTable.versions.at("-1"));
// console.log("Версия: ", persistentHashTable.versions.at());
//console.log("Структура: ", persistentHashTable);

//! OneWayLinkedList
// const persistentOneWayLinkedList = new OneWayLinkedList(["pixel"]);

// persistentOneWayLinkedList.addFirst(100);
// persistentOneWayLinkedList.addFirst(777);

// persistentOneWayLinkedList.set({ value: 125 });
// persistentOneWayLinkedList.set({ value: 555 });
// persistentOneWayLinkedList.set({ value: 888 });
// persistentOneWayLinkedList.set({ value: 1000 });
// persistentOneWayLinkedList.set({ path: "value", value: "space" });
// persistentOneWayLinkedList.set({ path: "value", value: 24 });

// const searchNodeFn1 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 24 });

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: 4444444 }, [searchNodeFn1]);

// const searchNodeFn2 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 4444444 });

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: 11 }, [searchNodeFn2]);

// const searchNodeFn3 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 11 });

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: "T-34", path: "value" }, [searchNodeFn3]);

// const searchNodeFn4 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 100 });

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: { name: "Vladisalv", job: "programmer", home: { target: "Moscow" } } }, [searchNodeFn4]);

// const searchNodeFn5 = (list) => {
// 	const node = list.findByKey({ path: "value/home/target", value: "Moscow" });

// 	return node;
// }
// persistentOneWayLinkedList.set({ path: "value/home/target", value: "Tula" }, [searchNodeFn5]);

// const searchNodeFn6 = (list) => {
// 	const node = list.findByKey({ path: "value/name", value: "Vladisalv" });

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: "Valeria", path: "value/name" }, [searchNodeFn6]);

// const searchNodeFn7 = (list) => {
// 	const node = list.findByKey({ path: "value", value: "pixel" });

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: 900 }, [searchNodeFn7]);

// const searchNodeFn8 = (list) => {
// 	const node = list.findByKey({ path: "value", value: 900 });

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: 1500 }, [searchNodeFn8]);

// const searchNodeFn9 = (list) => {
// 	const node = list.findByKey("T-34");

// 	return node;
// }
// persistentOneWayLinkedList.set({ value: "Globus" }, [searchNodeFn9]);

// persistentOneWayLinkedList.addFirst("Upside");
// persistentOneWayLinkedList.set({ value: 350 });

//console.log(persistentOneWayLinkedList.deleteFirst())

// console.log(persistentOneWayLinkedList.versions.at());
// const searchNodeFn10 = (node) => {
// 	const res = node.findByKey({ path: "value/home/target", value: "Moscow" });

// 	return res;
// }
// console.log(persistentOneWayLinkedList.get(12, "value/home", [searchNodeFn10]));

// const searchNodeFn11 = (node) => {
// 	const res = node.findByKey({ path: "value/job", value: "programmer" });

// 	return res;
// }
// console.log(persistentOneWayLinkedList.get(13, "value/home/target", [searchNodeFn11]));

// const searchNodeFn12 = (node) => {
// 	const res = node.findByKey({ path: "value", value: "pixel" });

// 	return res;
// }
// console.log(persistentOneWayLinkedList.get(6, "value", [searchNodeFn12]));
//console.log(persistentOneWayLinkedList);

// console.log(persistentOneWayLinkedList.historyChanges.at(2));
// console.log(persistentOneWayLinkedList.historyChanges.at("+1"));
