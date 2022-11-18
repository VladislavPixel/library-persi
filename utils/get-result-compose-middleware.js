function getResultComposeMiddleware(middleware) {
	let result;

	let index = 0;

	for (const middlewareFn of middleware) {
		result = (index === 0) ? middlewareFn(this) : middlewareFn(result);

		index++;
	}

	if (result instanceof NodePersistent || result === -1) {
		return result;
	}

	throw new Error("The return value from compose Middleware must be a node instance or in the worst case -1.");
}
