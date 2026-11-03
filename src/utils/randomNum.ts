export default function randomNum(selectionLength: number): number {
	if (!Number.isInteger(selectionLength) || selectionLength <= 0) {
		throw new RangeError("Selection length must be a positive integer.");
	}

	const randomValues = new Uint32Array(1);
	const range = 0x100000000;
	const limit = range - (range % selectionLength);

	let randomValue: number;

	do {
		crypto.getRandomValues(randomValues);
		randomValue = randomValues[0];
	} while (randomValue >= limit);

	return randomValue % selectionLength;
}
