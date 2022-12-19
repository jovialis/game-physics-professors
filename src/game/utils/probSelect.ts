/**
 * probSelect
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/16/22
 */

export interface ProbItem<K> {
	prob: number
	val: K
}

export function probSelect<K>(items: ProbItem<K>[]): K {
	const randomizedItems = items.sort((a, b) => Math.random() - Math.random());
	const sum = randomizedItems.reduce((prev, cur) => prev + cur.prob, 0);

	const seed = Math.random() * sum;
	let curSum = 0;
	for (const item of randomizedItems) {
		curSum += item.prob;
		if (seed < curSum) {
			return item.val;
		}
	}
	return randomizedItems[randomizedItems.length - 1].val;
}