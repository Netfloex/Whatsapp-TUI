import { MessageInput } from "@components";
import { useMessages } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { Box, Newline, Text } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import type { FC } from "react";
import React from "react";

export const SelectedChat: FC<{ chat?: ChatJson }> = ({ chat }) => {
	const messages = useMessages(chat);
	const [, rows] = useStdoutDimensions();

	if (!chat) return <></>;

	return (
		<Box flexGrow={1} flexDirection="column-reverse" borderStyle="single">
			<MessageInput chat={chat} />
			{React.Children.toArray(
				messages.slice(0, (rows - 8) / 3).map((msg) => (
					<Box justifyContent={msg.fromMe ? "flex-end" : undefined}>
						<Text>
							{msg.sender?.contactName ?? msg.sender?.pushname}:
							<Newline />
							{msg.content}
							<Newline />
						</Text>
					</Box>
				)),
			)}
		</Box>
	);
};
