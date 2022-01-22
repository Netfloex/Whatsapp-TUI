import { ContactName, MessageInput } from "@components";
import { useMessages } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { Box, Newline, Spacer, Text } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import type { FC } from "react";
import React from "react";

export const SelectedChat: FC<{ chat?: ChatJson }> = ({ chat }) => {
	const messages = useMessages(chat);
	const [, rows] = useStdoutDimensions();

	if (!chat) return <></>;

	let lastSenderId: string | undefined = "";

	return (
		<>
			{React.Children.toArray(
				messages
					.slice(0, (rows - 8) / 3)
					.reverse()
					.map((msg) => {
						const isDifferent =
							!lastSenderId || lastSenderId != msg.senderId;
						lastSenderId = msg.senderId ?? undefined;

						return (
							<Box
								key={msg.id}
								justifyContent={
									msg.fromMe ? "flex-end" : undefined
								}
							>
								<Text>
									{isDifferent && (
										<Text bold={true}>
											<Newline />
											<ContactName id={msg.senderId} />
											:
											<Newline />
										</Text>
									)}
									{msg.content}
								</Text>
							</Box>
						);
					}),
			)}
			<Spacer />
			<MessageInput chat={chat} />
		</>
	);
};
