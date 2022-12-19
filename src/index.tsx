import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {Global} from "@emotion/react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {HistoryProvider} from "./game/elements/history";
import {ProgressionProvider} from "./game/elements/panel";
import {TraitsProvider} from "./game/elements/traits";
import {timeline} from "./game/timeline";

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<>
		<ChakraProvider resetCSS={true} theme={extendTheme({
			fonts: {
				heading: `Newsreader, serif`,
				body: `Newsreader, serif`,
			},
		})}>
			<Global styles={`
				body, html {
					font-size: 18px;
					line-height: 30px;
					background-color: #E4C3AD;
					color: #0D1F2D;
				}
			`}/>
			<React.StrictMode>
				<HistoryProvider>
					<TraitsProvider>
						<ProgressionProvider timeline={timeline}>
							<App/>
						</ProgressionProvider>
					</TraitsProvider>
				</HistoryProvider>
			</React.StrictMode>
		</ChakraProvider>

	</>
);