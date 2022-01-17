import { MessageInput } from "@components";
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
							!lastSenderId || lastSenderId != msg.sender?.id;
						lastSenderId = msg.sender?.id ?? undefined;

						return (
							<Box
								justifyContent={
									msg.fromMe ? "flex-end" : undefined
								}
							>
								<Text>
									{isDifferent && (
										<Text bold={true}>
											<Newline />
											{msg.sender?.contactName ??
												msg.sender?.pushname}
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
