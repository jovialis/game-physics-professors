/**
 * history
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/16/22
 */

import React, {PropsWithChildren, useContext, useEffect, useState} from "react";
import {isDefined} from "../utils/isDefined";
import {uppercaseWords} from "../utils/uppercaseWords";

export enum ClassLevel {
	LOW = "Low",
	MID = "Mid",
	HIGH = "High"
}

export const TraitsContext = React.createContext({
	stats: {},
	classes: {},
	setStats: (val: Record<string, number>) => {
	},
	setClasses: (val: Record<string, string>) => {
	}
} as {
	stats: Record<string, number>,
	classes: Record<string, string>,
	setStats: (val: Record<string, number>) => void
	setClasses: (val: Record<string, string>) => void,
	clear: () => void
});

export interface TraitsHookReturn {
	stats: { key: string, value: number }[],
	getStat: (key: string) => number,
	hasStat: (key: string, required: number) => boolean
	addStat: (key: string, amt: number) => void
	addStats: (items: { key: string, amt: number }[]) => void
	subStat: (key: string, amt: number) => void
	classes: { key: string, value: string }[]
	getClass: (key: string, capitalize?: boolean) => string | undefined
	setClass: (key: string, val: string | undefined) => void
	setClasses: (items: { key: string, val: string | undefined }[]) => void
	isClass: (key: string, val: string) => boolean
	clear: () => void
}

export function useTraits(): TraitsHookReturn {
	const traits = useContext(TraitsContext);

	return {
		stats: Object.keys(traits.stats).map(key => ({
			key: key.toLowerCase(),
			value: traits.stats[key.toLowerCase()]
		})),
		getStat: (key: string) => {
			return traits.stats[key.toLowerCase()] || 0;
		},
		hasStat: (key: string, required: number) => {
			return (traits.stats[key.toLowerCase()] || 0) >= required;
		},
		addStat: (key: string, amt: number) => {
			let newStats = Object.assign({}, traits.stats);
			if (!traits.stats[key.toLowerCase()])
				newStats[key.toLowerCase()] = 0;
			newStats[key.toLowerCase()] += amt;
			traits.setStats(newStats);
		},
		addStats: (items) => {
			let newStats = Object.assign({}, traits.stats);
			for (const item of items) {
				if (!traits.stats[item.key.toLowerCase()])
					newStats[item.key.toLowerCase()] = 0;
				newStats[item.key.toLowerCase()] += item.amt;
			}
			traits.setStats(newStats);
		},
		subStat: (key: string, amt: number) => {
			let newStats = Object.assign({}, traits.stats);
			if (!traits.stats[key.toLowerCase()])
				newStats[key.toLowerCase()] = 0;
			newStats[key.toLowerCase()] -= amt;
			traits.setStats(newStats);
		},
		classes: Object.keys(traits.classes).map(key => ({
			key: key.toLowerCase(),
			value: traits.classes[key.toLowerCase()]
		})),
		getClass: (key: string, capitalize?: boolean) => {
			const val = traits.classes[key.toLowerCase()];
			if (capitalize)
				return uppercaseWords(val);
			return val;
		},
		setClass: (key: string, val: string | undefined) => {
			let classes = Object.assign({}, traits.classes);
			if (!isDefined(val)) {
				delete classes[key.toLowerCase()];
			} else {
				classes[key.toLowerCase()] = val.toLowerCase();
			}

			traits.setClasses(classes);
		},
		setClasses: (items) => {
			let classes = Object.assign({}, traits.classes);
			for (const item of items) {
				if (isDefined(item.val)) {
					classes[item.key.toLowerCase()] = item.val.toLowerCase();
				} else {
					delete classes[item.key.toLowerCase()];
				}
			}
			traits.setClasses(classes);
		},
		isClass: (key, val) => {
			return traits.classes[key.toLowerCase()] === val.toLowerCase();
		},
		clear: () => {
			traits.clear();
		}
	}
}

export function TraitsProvider(props: PropsWithChildren) {
	const [internalStats, setInternalInternalStats] = useState<Record<string, number>>({})
	const [internalClasses, setInternalInternalClasses] = useState<Record<string, string>>({})

	const [loaded, setLoaded] = useState(false);

	// Save History to local storage
	useEffect(() => {
		if (loaded) {
			const statStr = JSON.stringify(internalStats);
			localStorage.setItem("stats", statStr);
		}
	}, [internalStats]);

	// Save History to local storage
	useEffect(() => {
		if (loaded) {
			const classStr = JSON.stringify(internalClasses);
			localStorage.setItem("classes", classStr);
		}
	}, [internalClasses]);

	// Load History from local storage
	useEffect(() => {
		if (localStorage.getItem("stats")) {
			try {
				const val: any = JSON.parse(localStorage.getItem("stats") as string);
				setInternalInternalStats(val);
			} catch (e) {

			}
		}

		if (localStorage.getItem("classes")) {
			try {
				const val: any = JSON.parse(localStorage.getItem("classes") as string);
				setInternalInternalClasses(val);
			} catch (e) {

			}
		}

		setLoaded(true);
	}, []);

	return <TraitsContext.Provider value={{
		stats: internalStats,
		classes: internalClasses,
		setStats: (val: Record<string, number>) => {
			setInternalInternalStats(val)
		},
		setClasses: (val: Record<string, string>) => {
			setInternalInternalClasses(val)
		},
		clear: () => {
			setInternalInternalStats({})
			setInternalInternalClasses({})
		}
	}}>
		{props.children}
	</TraitsContext.Provider>
}