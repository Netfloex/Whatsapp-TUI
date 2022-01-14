import { ChatList, SelectedChat } from "@components";
import { ChatJson } from "@typings/SocketIO";
import { Box, Text, useFocus } from "ink";
import type { FC } from "react";
import React, { useEffect, useState } from "react";

import { Client } from "@lib";

export const Dashboard: FC<{ client: Client }> = ({ client }) => {
	const [connected, setConnected] = useState(client.io.connected);
	const [chats, setChats] = useState(client.chats);
	const [selectedChat, selectChat] = useState(client.chats[0]);

	const { isFocused: chatSelectFocus } = useFocus({ id: "chatSelect" });

	useEffect(() => {
		const connected = (): void => setConnected(true);
		const disconnected = (): void => setConnected(false);

		client.io.on("connect", connected);
		client.io.on("disconnect", disconnected);

		return (): void => {
			client.io.off("connect", connected);
			client.io.off("disconnect", disconnected);
		};
	}, []);

	useEffect(() => {
		const updateChats = (chats: ChatJson[]): void => {
			setChats(chats);
			selectChat(chats[0]);
		};

		client.on("chats", updateChats);

		return (): void => {
			client.off("chats", updateChats);
		};
	});

	return (
		<Box width="100%" borderStyle="single" flexDirection="column">
			{connected ? (
				<Text color={"green"}>Connected</Text>
			) : (
				<Text color={"red"}>Disconnected</Text>
			)}
			<Box>
				<ChatList
					chats={chats}
					isFocused={chatSelectFocus}
					selectChat={selectChat}
				/>
				<SelectedChat chat={selectedChat} />
			</Box>
		</Box>
	);
};
