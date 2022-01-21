import { isJidUser } from "@adiwajshing/baileys-md";
import { usePresence } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { circleFilled } from "figures";
import { Text, Box } from "ink";
import { DateTime } from "luxon";
import type { FC } from "react";
import React from "react";

export const ChatTitle: FC<{ selectedChat: ChatJson }> = ({ selectedChat }) => {
	const presence = usePresence(selectedChat);

	return (
		<Box borderStyle="single" flexGrow={1}>
			<Box marginRight={1}>
				<Text>{selectedChat?.name ?? selectedChat.id}</Text>
			</Box>
			{isJidUser(selectedChat.id) && (
				<>
					<Box marginRight={1}>
						<Text
							color={
								presence?.presence == "available"
									? "green"
									: presence?.presence == "composing"
									? "yellow"
									: "gray"
							}
						>
							{circleFilled}
						</Text>
					</Box>
					{presence?.presenceUpdated && (
						<Text>
							{DateTime.fromISO(
								presence.presenceUpdated,
							).toLocaleString(
								DateTime.DATETIME_SHORT_WITH_SECONDS,
							)}
						</Text>
					)}
				</>
			)}
		</Box>
	);
};
