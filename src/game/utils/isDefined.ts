/**
 * isDefined
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/16/22
 */

export function isDefined<K>(val: K | undefined): val is K {
	return typeof val !== "undefined";
}