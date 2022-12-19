/**
 * history
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/16/22
 */

import React, {PropsWithChildren, useContext, useEffect, useState} from "react";

export const HistoryContext = React.createContext({
	history: [],
	addHistory: (key) => {
	},
	clear: () => {
	}
} as {
	history: string[],
	addHistory: (key: string) => void,
	clear: () => void
});

export function HistoryProvider(props: PropsWithChildren) {
	const [history, setHistory] = useState([] as string[]);

	const [loaded, setLoaded] = useState(false);

	// Save History to local storage
	useEffect(() => {
		if (loaded) {
			const val = JSON.stringify(history);
			localStorage.setItem("history", val);
		}
	}, [history]);

	// Load History from local storage
	useEffect(() => {
		if (localStorage.getItem("history")) {
			try {
				const val: string[] = JSON.parse(localStorage.getItem("history") as string);
				setHistory(val);
			} catch (e) {

			}
		}
		setLoaded(true);

	}, []);

	function addHistoryItem(name: string) {
		setHistory([...history, name]);
	}

	return <HistoryContext.Provider value={{
		history: history,
		addHistory: addHistoryItem,
		clear: () => {
			setHistory([]);
		}
	}}>
		{props.children}
	</HistoryContext.Provider>
}

export function useHistory() {
	const context = useContext(HistoryContext);

	return {
		history: context.history,
		addHistory: context.addHistory,
		clear: () => {
			context.clear();
		}
	}
}