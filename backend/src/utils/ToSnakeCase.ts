export function toSnakeCase(input: Record<string, any>) {
	const output: Record<string, any> = {};

	for (const key in input) {
		const snake = key.replaceAll(
			/[A-Z]/g,
			(letter) => `_${letter.toLowerCase()}`
		);
		output[snake] = input[key];
	}

	return output;
}
