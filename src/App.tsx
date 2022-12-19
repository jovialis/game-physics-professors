import {Container, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import React from 'react';
import GamePanel from "./game/components/GamePanel";
import {useHistory} from "./game/elements/history";
import {useProgression} from "./game/elements/panel";
import {useTraits} from "./game/elements/traits";

export default function App() {
	const progression = useProgression();
	const history = useHistory();
	const traits = useTraits();

	function resetEverything() {
		progression.reset(() => {
			history.clear();
			traits.clear();
		});
	}

	return (
		<>
			<VStack
				maxH={"100vh"}
				h={"100vh"}
				w={"100%"}
				alignItems={"stretch"}
				justifyContent={"stretch"}
				spacing={0}
			>
				<Container
					maxW={"container.xxl"}
					pt={5}
					pb={2}
					position={"relative"}
				>
					<HStack w={"100%"} justifyContent={"center"}>
						<VStack
							spacing={0}
							_hover={{
								cursor: "pointer",
								opacity: 1,
								transform: "scale(1.05)"
							}}
							onClick={resetEverything}
							opacity={0.7}
							transition={"opacity 0.2s, transform 0.2s"}
						>
							<Heading size={"sm"} textAlign={"center"} sx={{
								"&": {
									fontSize: "0.8rem",
									fontWeight: 400
								},
								"& .strike": {
									textDecoration: "line-through",
									display: "inline-block",
									// transform: "scale(.9) translate(0%, 40%)",
								},
								"& .up": {
									transform: "translate(-21%, -70%)",
									display: "inline-block",
									fontSize: "120%",
									fontWeight: 900
								}
							}}>
								The Game of <span className={"strike"}>Life</span> <span className={"up"}>Physics Professors</span>
							</Heading>
							<Text fontSize={"xs"} textAlign={"center"}>
								Click to Reset
							</Text>
						</VStack>
					</HStack>

				</Container>
				{progression.panel && <GamePanel reset={resetEverything}/>}
			</VStack>
		</>
	);
}