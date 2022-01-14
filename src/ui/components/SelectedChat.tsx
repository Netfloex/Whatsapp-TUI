import { MessageInput } from "@components";
import { ChatJson } from "@typings/SocketIO";
import { Box, Text } from "ink";
import type { FC } from "react";
import React from "react";

export const SelectedChat: FC<{ chat: ChatJson }> = ({ chat }) => {
	return (
		<Box width={"30%"} flexDirection="column-reverse" borderStyle="single">
			<MessageInput />
			{chat?.messages.slice(0, 10).map((msg) => (
				<Box
					key={msg.id}
					justifyContent={msg.fromMe ? "flex-end" : undefined}
				>
					<Text key={msg.id}>{msg.content}</Text>
				</Box>
			))}
		</Box>
	);
};
