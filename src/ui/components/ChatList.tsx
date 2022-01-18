import { useChats, useUnreadCounts } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { pointer } from "figures";
import { Box, Spacer, Text, useFocus, useFocusManager, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import React, { Dispatch, FC, SetStateAction, useCallback } from "react";

export const ChatList: FC<{
	selectedChat: ChatJson | undefined;
	selectChat: Dispatch<SetStateAction<ChatJson | undefined>>;
}> = ({ selectedChat, selectChat }) => {
	const { isFocused } = useFocus({ id: "chatSelect" });

	const { focusNext } = useFocusManager();
	const chats = useChats();
	const [, rows] = useStdoutDimensions();
	const unreadCounts = useUnreadCounts();

	useInput(
		useCallback(
			(input, key) => {
				if (!selectedChat) return;

				let direction = 0;
				if (key.downArrow) {
					direction = 1;
				} else if (key.upArrow) {
					direction = -1;
				}
				if (direction) {
					const newSelection =
						chats[chats.indexOf(selectedChat) + direction];

					if (newSelection) {
						selectChat(newSelection);
					}
				}

				if (key.return) focusNext();
			},
			[selectedChat, selectChat],
		),
		{ isActive: isFocused },
	);

	return (
		<Box
			flexDirection="column"
			borderStyle="single"
			borderColor={isFocused ? "blue" : undefined}
		>
			{React.Children.toArray(
				chats.slice(0, rows - 7).map((chat) => {
					const isSelected = chat == selectedChat;
					const unreadCount = unreadCounts[chat.id];
					return (
						<Box>
							<Box marginRight={1}>
								{isSelected ? (
									<Text color="blue">{pointer}</Text>
								) : (
									<Text> </Text>
								)}
							</Box>
							<Text
								color={
									isSelected && isFocused ? "blue" : undefined
								}
							>
								{chat.name}
							</Text>
							{unreadCount && (
								<>
									<Spacer />
									<Text color="green" bold>
										{unreadCount}
									</Text>
								</>
							)}
						</Box>
					);
				}),
			)}
		</Box>
	);

	// return (
	// <SelectInput
	// 	isFocused={isFocused}
	// 	items={chats.map((chat) => ({
	// 		label: chat.id,
	// 		value: chat,
	// 		key: chat.id,
	// 	}))}
	// 	itemComponent={SelectChat(chats, isFocused)}
	// 	limit={rows - 7}
	// 	onSelect={focusNext}
	// 	onHighlight={(item): void => selectChat(item.value)}
	// />
	// );
};
