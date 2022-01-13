import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type { FC } from "react";
import React, { useEffect, useState } from "react";

import { Client } from "@lib";

export const Dashboard: FC<{ client: Client }> = ({ client }) => {
	const [connected, setConnected] = useState(client.io.connected);
	const [chats, setChats] = useState(client.chats);
	const [selectedChat, selectChat] = useState(client.chats[0]);

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
		client.on("chats", setChats);

		return (): void => {
			client.off("chats", setChats);
		};
	});

	console.log(chats);

	return (
		<Box width="100%" borderStyle="single">
			<Box width="30%" borderStyle="single" flexDirection="column">
				{connected ? (
					<Text color={"green"}>Connected</Text>
				) : (
					<Text color={"red"}>Disconnected</Text>
				)}
				{/* {chats.slice(0, 30).map((chat) => (
					<Text key={chat.id}>{chat.name}</Text>
				))} */}
				<SelectInput
					items={chats.slice(0, 10).map((chat) => ({
						label: chat.name,
						value: chat,
						key: chat.id,
					}))}
					onSelect={(item): void => selectChat(item.value)}
				/>
			</Box>
			<Box
				flexGrow={1}
				borderStyle="single"
				flexDirection="column-reverse"
			>
				{selectedChat?.messages.slice(0, 10).map((msg) => (
					<Text key={msg.id}>{msg.content}</Text>
				))}
			</Box>
		</Box>
	);
};
