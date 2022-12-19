/**
 * GamePanel
 * Project: science-politics-economy-final
 * Author: jovialis (Dylan Hanson)
 * Date: 12/16/22
 */

import {
	Box,
	Button,
	Center,
	Container,
	Heading,
	HStack,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Tr,
	VStack
} from "@chakra-ui/react";
import {Global} from "@emotion/react";
import React, {useMemo} from "react";
import {useHistory} from "../elements/history";
import {PanelOption, useProgression} from "../elements/panel";
import {useTraits} from "../elements/traits";
import {isDefined} from "../utils/isDefined";
import {uppercaseWords} from "../utils/uppercaseWords";

export default function GamePanel(props: {
	reset: () => void
}) {
	const progression = useProgression();
	const history = useHistory();
	const traits = useTraits();

	return <>
		{progression.panel.is_loss && <>
            <Global styles={`
				body, html {
					background-color: #0D1F2D !important;
					color: #E4C3AD !important;
				}
			`}/>
        </>}
		{(progression.panel.is_won || progression.panel.is_loss) && <>
            <Global styles={`
				body, html {
					font-size: 24px;
				}
			`}/>
        </>}

		{progression.transitioning && <Center
            position={"absolute"}
            w={"100%"}
            h={"100%"}
            zIndex={0}
            transition={"opacity 0.1s linear"}
            opacity={progression.transitioning ? 1 : 0}
        >
            <Spinner size={"md"} thickness={"4px"} color={"#FAE1DF"}/>
        </Center>}
		<Box
			zIndex={1}
			flex={1}
			position={"relative"}
			transition={"opacity 0.25s linear"}
			opacity={progression.transitioning ? 0 : 1}
		>
			<VStack
				h={"100%"}
				w={"100%"}
				flex={1}
				spacing={10}
				position={"relative"}
				zIndex={1}
			>
				<Box flex={1}/>
				<Heading size={"md"}>
					{progression.panel.name}
				</Heading>
				<Container maxW={"container.sm"}>
					<Text textAlign={"center"} fontSize={22} dangerouslySetInnerHTML={{
						__html: (() => {
							let html = typeof progression.panel.body === "string" ? progression.panel.body : progression.panel.body(traits);

							const sources = progression.panel.sources;
							if (!sources) {
								return html;
							}

							let i = 1;
							for (const source of sources) {
								const insert = `<a href="${source}" target="_blank">[${i}]</a>`;
								html = html.replaceAll(`[${i}]`, insert);

								i += 1;
							}

							return html;
						})()
					}} sx={{
						"& a": {
							textDecoration: "underline"
						}
					}}/>
				</Container>
				<Container maxW={"container.sm"}>
					{progression.panel.is_loss && <>
                        <HStack justifyContent={"center"}>
                            <Button
                                bg={"transparent"}
                                borderRadius={100}
                                borderColor={"#E4C3AD"}
                                borderWidth={1}
                                size={"lg"}
                                opacity={progression.transitioning ? 0 : 1}
                                _hover={{
									bg: "#E4C3AD",
									color: "#0D1F2D",
									cursor: "none",
									transform: "scale(1.1)"
								}}
                                _active={{
									bg: "#E4C3AD",
									color: "#0D1F2D",
									transform: "scale(1.2, 1.2) translateY(-1px)",
								}}
                                onClick={() => {
									props.reset()
								}}
                            >
                                Play Again
                            </Button>
                        </HStack>
                    </>}
					<VStack w={"100%"} justifyContent={"space-evenly"} spacing={4}>
						{progression.panel.options.map(o => <OptionButton key={o.name} option={o}/>)}
					</VStack>
				</Container>
				<Box flex={1}/>
			</VStack>
			{(!progression.panel.is_won && !progression.panel.is_loss) && <>
                <Box position={"absolute"} zIndex={0} left={0} top={0} w={"100%"}>
                    <Box h={"100%"} w={"100%"} position={"absolute"} mt={10}>
						{history.history.length > 0 && <>
                            <Box
                                right={0}
                                top={0}
                                position={"absolute"}
                            >
                                <Container maxW={"container.xxl"}>
                                    <Heading size={"xs"} fontStyle={"italic"} textAlign={"right"} fontWeight={"bold"}
                                             mr={4}>
                                        History
                                    </Heading>
                                </Container>
                                <Container
                                    maxW={"container.xxl"}
                                    borderTopWidth={1}
                                    borderColor={"#0D1F2D"}
                                    minW={40}
                                    pt={4}
                                >
									{history.history.length === 0 && <>
                                        <Text fontStyle={"italic"} textAlign={"right"} mr={4}>None Yet</Text>
                                    </>}
                                    <Table
                                        size={"sm"}
                                        variant={"unstyled"}
                                        cellSpacing={0}
                                    >
                                        <Tbody sx={{
											"& td": {
												height: "100%",
												alignItems: "center",
												justifyContent: "center"
											},
											"& tr > td:first-of-type": {
												py: 0,
												pr: 0,
												textAlign: "right"
											},
											"& tr > td:last-child": {
												py: 4,
											},
											"& tr:first-of-type .line": {
												h: "50%",
												bottom: 0
											},
											"& tr:last-child .line": {
												h: "50%",
												top: 0
											},
											"& tr:only-child .line": {
												opacity: 0
											},
										}}>
											{history.history.map(v => <Tr py={0} key={v} textAlign={"right"}>
												<Td fontWeight={"bold"} py={0} isNumeric>
													{v}
												</Td>
												<Td
													fontFamily={"mono"}
													position={"relative"}
													textAlign={"center"}
													display={"flex"}
													alignItems={"center"}
												>
													<Box boxSize={2} bg={"#0D1F2D"} borderRadius={100}/>
													<Box
														className={"line"}
														w={0.5}
														h={"100%"}
														bg={"#0D1F2D"}
														position={"absolute"}
													/>
												</Td>
											</Tr>)}
                                        </Tbody>
                                    </Table>
                                </Container>
                            </Box>
                        </>}

						{(traits.stats.length > 0 || traits.classes.length > 0) && <>
                            <Box
                                left={0}
                                top={0}
                                position={"absolute"}
                            >
                                <Container maxW={"container.xxl"}>
                                    <Heading size={"xs"} fontStyle={"italic"} fontWeight={"bold"}>
                                        Traits
                                    </Heading>
                                </Container>
                                <Container
                                    maxW={"container.xxl"}
                                    borderTopWidth={1}
                                    borderColor={"#0D1F2D"}
                                    pt={4}
                                    w={40}
                                >
									{traits.stats.length === 0 && traits.classes.length === 0 && <>
                                        <Text fontStyle={"italic"}>None Yet</Text>
                                    </>}

                                    <Table
                                        size={"sm"}
                                        variant={"unstyled"}
                                    >
                                        <Tbody>
											{[...traits.stats, ...traits.classes]
												.filter(s => !s.key.startsWith("$")) // Hide internal flags
												.map(s => <Tr px={0} key={s.key}>
													<Td fontWeight={"bold"} pl={0}>
														{uppercaseWords(s.key)}
													</Td>
													<Td pr={0} fontFamily={"mono"}>
														{uppercaseWords(s.value + "")}
													</Td>
												</Tr>)
											}
                                        </Tbody>
                                    </Table>
                                </Container>
                            </Box>
                        </>}
                    </Box>
                </Box>
            </>}
		</Box>
	</>
}

function OptionButton(props: {
	option: PanelOption
}) {
	const traits = useTraits();
	const progression = useProgression();

	const enableRes = useMemo(() => {
		if (!isDefined(props.option.isEnabled))
			return true;
		return props.option.isEnabled(traits)
	}, [props.option, traits]);
	const isEnabled = enableRes === true;

	return <>
		<VStack justifyContent={"center"} textAlign={"center"} key={props.option.name}>
			<Button
				key={props.option.name}
				bg={"transparent"}
				borderRadius={100}
				borderColor={"#0D1F2D"}
				borderWidth={1}
				size={"md"}
				opacity={progression.transitioning ? 0 : 1}
				disabled={!isEnabled}
				textDecoration={!isEnabled ? "line-through" : undefined}
				_hover={{
					bg: "#0D1F2D",
					color: "#E4C3AD",
					cursor: "none",
					transform: "scale(1.1)"
				}}
				_active={{
					bg: "#0D1F2D",
					color: "#E4C3AD",
					transform: "scale(1.2, 1.2) translateY(-1px)",
				}}
				onClick={() => {
					if (isEnabled) {
						progression.optionSelected(props.option)
					}
				}}
			>
				{props.option.name}
			</Button>
			{!isEnabled && <Text fontSize={"sm"} fontStyle={"italic"}>
				{enableRes}
            </Text>}
			{isEnabled && props.option.annotation && <Text fontSize={"sm"} fontStyle={"italic"}>
				{props.option.annotation}
            </Text>}
		</VStack>
	</>
}