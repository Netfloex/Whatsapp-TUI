import { ChatList, SelectedChat } from "@components";
import { useConnection } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { Box, Text, useFocus } from "ink";
import type { FC } from "react";
import React, { useState } from "react";

export const Dashboard: FC = () => {
	const connected = useConnection();
	const [selectedChat, selectChat] = useState<ChatJson | undefined>();

	const { isFocused: chatSelectFocus } = useFocus({ id: "chatSelect" });

	return (
		<Box width="100%" borderStyle="single" flexDirection="column">
			{connected ? (
				<Text color={"green"}>Connected</Text>
			) : (
				<Text color={"red"}>Disconnected</Text>
			)}
			<Box>
				<ChatList isFocused={chatSelectFocus} selectChat={selectChat} />
				<SelectedChat chat={selectedChat} />
			</Box>
		</Box>
	);
};
