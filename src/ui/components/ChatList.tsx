import { useChats } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { Text, useFocusManager } from "ink";
import SelectInput from "ink-select-input";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import type { Dispatch, FC, SetStateAction } from "react";
import React from "react";

export const ChatList: FC<{
	selectChat: Dispatch<SetStateAction<ChatJson | undefined>>;
	isFocused: boolean;
}> = ({ selectChat, isFocused }) => {
	const { focusNext } = useFocusManager();
	const chats = useChats((chats) => selectChat(chats[0]));

	const [, rows] = useStdoutDimensions();

	return (
		<SelectInput
			isFocused={isFocused}
			items={chats.map((chat) => ({
				label: chat.name,
				value: chat,
				key: chat.id,
			}))}
			// indicatorComponent={({ isSelected, children }) => (
			// 	<Text>{children}ewa</Text>
			// )}
			itemComponent={({ isSelected, label }): JSX.Element => (
				<Text color={isSelected && isFocused ? "blue" : undefined}>
					{label}
				</Text>
			)}
			limit={rows - 7}
			onSelect={focusNext}
			onHighlight={(item): void => selectChat(item.value)}
		/>
	);
};
