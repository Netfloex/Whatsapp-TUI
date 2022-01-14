import { useChats } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { Box, useFocusManager } from "ink";
import SelectInput from "ink-select-input";
import type { Dispatch, FC, SetStateAction } from "react";
import React from "react";

export const ChatList: FC<{
	selectChat: Dispatch<SetStateAction<ChatJson | undefined>>;
	isFocused: boolean;
}> = ({ selectChat, isFocused }) => {
	const { focusNext } = useFocusManager();
	const chats = useChats((chats) => selectChat(chats[0]));

	return (
		<Box width="20%" flexDirection="column" borderStyle="single">
			<SelectInput
				isFocused={isFocused}
				items={chats.slice(0, 20).map((chat) => ({
					label: chat.name,
					value: chat,
					key: chat.id,
				}))}
				limit={10}
				onSelect={focusNext}
				onHighlight={(item): void => selectChat(item.value)}
			/>
		</Box>
	);
};
