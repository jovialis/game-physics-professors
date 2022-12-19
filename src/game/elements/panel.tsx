/**
 * panel
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/16/22
 */

import {useToast} from "@chakra-ui/react";
import React, {PropsWithChildren, useContext, useEffect, useState} from "react";
import {Timeline} from "../timeline";
import {isDefined} from "../utils/isDefined";
import {useHistory} from "./history";
import {TraitsHookReturn, useTraits} from "./traits";

export interface PanelOption {
	name: string
	isEnabled?: ((traits: TraitsHookReturn) => string | true)
	onSelect?: ((traits: TraitsHookReturn) => string | void)
	destination?: string
	annotation?: string
}

export interface Panel {
	id: string
	name: string
	history_include?: boolean
	is_loss?: boolean
	is_won?: boolean
	body: string | ((trait: TraitsHookReturn) => string)
	options: PanelOption[]
	sources?: string[]
	onLoad?: (trait: TraitsHookReturn) => void
}

const ProgressionContext = React.createContext<{
	panel?: Panel,
	setPanel?: (panel: Panel) => void,
	timeline?: Timeline,
	transitioning?: boolean,
	setTransitioning?: (flag: boolean) => void,
	reset?: () => void
}>({});

export interface UseProgressionReturn {
	panel: Panel
	transitioning: boolean
	optionSelected: (option: PanelOption) => void
	reset: (callback: () => void) => void
}

export function useProgression(): UseProgressionReturn {
	const toast = useToast({
		variant: "solid",
		status: "info"
	});

	const context = useContext(ProgressionContext);

	const traits = useTraits();
	const history = useHistory();

	function optionSelected(option: PanelOption) {
		const curPanel = context.panel!;

		// Can't trigger another option if we're already transitioning
		if (context.transitioning) {
			return;
		}

		// Make sure the Option is valid/enabled given current traits
		if (isDefined(option.isEnabled) && option.isEnabled(traits) !== true) {
			return;
		}

		// Trigger a transition for a few milliseconds
		context.setTransitioning!(true);
		setTimeout(() => {
			// Update history
			if (isDefined(curPanel.history_include) && curPanel.history_include) {
				history.addHistory(curPanel.name);
			}

			let targetPanelID = option.destination || "";

			// Trigger the on click handler
			if (isDefined(option.onSelect)) {
				const dest = option.onSelect(traits);
				if (isDefined(dest) && typeof dest === "string") {
					// Have a new destination;
					targetPanelID = dest;
				}
			}

			// Attempt to find a destination Panel using its ID
			const panel = context.timeline?.panels.find(panel => panel.id.toLowerCase() === targetPanelID.toLowerCase());

			// Get mad if there's no destination
			if (!isDefined(panel)) {
				toast({
					title: "Could not load the next Panel. Please reload and try again."
				})
				return;
			}

			// Call the on load handler
			if (isDefined(panel.onLoad)) {
				panel.onLoad(traits);
			}

			// Load the new Panel
			context.setPanel!(panel);
			context.setTransitioning!(false);
		}, 500);
	}

	return {
		panel: context.panel!,
		transitioning: context.transitioning!,
		optionSelected: optionSelected,
		reset: (callback) => {
			context.setTransitioning!(true);
			setTimeout(() => {
				context.reset!();
				callback();
			}, 500);
		}
	}
}

export function ProgressionProvider(props: PropsWithChildren & {
	timeline: Timeline
}) {
	const [curPanel, setCurPanel] = useState<Panel>(props.timeline.initial_panel);
	const [transitioning, setTransitioning] = useState<boolean>(false);

	const [loaded, setLoaded] = useState(false);

	// Save History to local storage
	useEffect(() => {
		if (loaded) {
			const val = JSON.stringify(curPanel.id);
			localStorage.setItem("panel", val);
		}
	}, [curPanel]);

	// Load History from local storage
	useEffect(() => {
		if (localStorage.getItem("panel")) {
			try {
				const val: string = JSON.parse(localStorage.getItem("panel") as string);
				const panel = [props.timeline.initial_panel, ...props.timeline.panels].find(p => {
					return p.id === val;
				});

				if (!panel) {
					localStorage.clear()
					window.location.reload();
					return;
				}

				setCurPanel(panel);
			} catch (e) {

			}
		}
		setLoaded(true);
	}, []);

	return <ProgressionContext.Provider value={{
		panel: curPanel,
		setPanel: (panel) => {
			setCurPanel(panel)
		},
		timeline: props.timeline,
		transitioning: transitioning,
		setTransitioning: flag => {
			setTransitioning(flag)
		},
		reset: () => {
			setCurPanel(props.timeline.initial_panel);
			setTransitioning(false);
		}
	}}>
		{props.children}
	</ProgressionContext.Provider>
}