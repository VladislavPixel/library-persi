function getResultComposeMiddleware(arrMiddleware) {
	let result;

	let index = 0;

	for (const middlewareFn of arrMiddleware) {
		if (index === 0) {
			result = middlewareFn(this);
		} else {
			result = middlewareFn(result);
		}

		index++;
	}

	if (result instanceof NodePersistent || result === -1) {
		return result;
	}

	throw new Error("The return value from compose Middleware must be a node instance or in the worst case -1.");
}
