function getResultComposeMiddleware(middlewareS) {
	let result;

	let index = 0;

	for (const middlewareFn of middlewareS) {
		result = (index === 0) ? middlewareFn(this) : middlewareFn(result);

		index++;
	}

	if (result instanceof NodePersistent || result === null) {
		return result;
	}

	throw new Error("The return value from compose Middleware must be a node instance or in the worst case null.");
}
