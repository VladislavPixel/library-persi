const prefixLinkToValue = "[[VAL_REF:";

const prefixLinkToYourself = "[[PREFIX_YOURSELF:base]]";

function fastClone(value) {
	if (!Boolean(value)) {
		return value;
	}

	if (typeof value === "function") {
		return value;
	}

	if (value instanceof Map) {
		const map = new Map();

		for (const arr of map.entries()) {
			map.set(arr[0], fastClone(arr[1]));
		}

		return map;
	}

	if (value instanceof Set) {
		const set = new Set();

		for (const valSet of set.values()) {
			set.add(fastClone(valSet));
		}

		return set;
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return [];
		}

		const slice = value.slice();

		let isSimple = true;

		for (let i = 0; i < value.length; i++) {
			const el = value[i];

			if (typeof el === "object") {
				if (el instanceof Date) {
					slice[i] = new Date(el);

				} else {
					isSimple = false;
					break;
				}
			}
		}

		if (isSimple) {
			return slice;
		}
	}

	if (value instanceof Date) {
		return new Date(value);
	}

	if (Object.keys(value).length === 0) {
		return {};
	}

	const valMap = new Map();

	const dateToJSON = Date.prototype.toJSON;

	const functionToJSON = Function.prototype["toJSON"];

	function toJSON() {
		const key = valMap.get(this) ?? `${prefixLinkToValue}${Math.random()}]]`;

		valMap.set(this, key);

		valMap.set(key, this);

		return key;
	}

	Date.prototype.toJSON = toJSON;

	Function.prototype["toJSON"] = toJSON;

	const replacer = createSerializer(value);

	const reviver = createParser(value, valMap);

	const clone = JSON.parse(JSON.stringify(value, replacer), reviver);

	Date.prototype.toJSON = dateToJSON;

	Function.prototype["toJSON"] = functionToJSON;

	return clone;
}

function createSerializer(base) {
	let init = false;

	return (key, value) => {
		if (init && value === base) {
			value = prefixLinkToYourself;

		} else {
			init = true;
		}

		return value;
	}
}

function createParser(base, valMap) {
	return (key, value) => {
		if (value === prefixLinkToYourself) {
			return base;
		}

		if (typeof value === "string" && value.startsWith(prefixLinkToValue)) {
			const resolvedValue = valMap.get(value);

			if (resolvedValue !== undefined) {
				if (resolvedValue instanceof Date) {
					return new Date(resolvedValue);
				}

				return resolvedValue;
			}
		}

		return value;
	}
}

function clone(value) {
	let clone;

	try {
		clone = structuredClone(value);

	} catch(err) {
		clone = fastClone(value);
	}

	return clone;
}
