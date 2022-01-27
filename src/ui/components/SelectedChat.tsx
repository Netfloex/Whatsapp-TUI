import { WAMessageStatus } from "@adiwajshing/baileys";
import { ContactName, MessageInput } from "@components";
import { useMessages } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { tick } from "figures";
import { Box, Newline, Spacer, Text } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import { DateTime } from "luxon";
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
									{DateTime.fromISO(msg.time!).toLocaleString(
										DateTime.TIME_24_SIMPLE,
									)}
									<>: </>
									{msg.content}
									<> </>
									{msg.fromMe == 1 && (
										<Text
											color={
												msg.status ==
												WAMessageStatus.READ
													? "blue"
													: "gray"
											}
										>
											{tick}
											{msg.status! >
												WAMessageStatus.SERVER_ACK &&
												tick}
										</Text>
									)}
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
