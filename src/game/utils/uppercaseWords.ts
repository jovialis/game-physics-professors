/**
 * uppercaseWords
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/17/22
 */

export function uppercaseWords(str: string) {
	return str.split(' ').map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(" ");
}