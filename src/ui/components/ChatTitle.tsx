import { usePresence } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { circleFilled } from "figures";
import { Text, Box } from "ink";
import { DateTime } from "luxon";
import type { FC } from "react";
import React from "react";

export const ChatTitle: FC<{ selectedChat: ChatJson }> = ({ selectedChat }) => {
	const presences = Object.values(usePresence(selectedChat));

	return (
		<Box borderStyle="single" flexGrow={1}>
			<Box marginRight={1}>
				<Text>{selectedChat?.name}</Text>
			</Box>
			{selectedChat.isGroup == false && (
				<>
					<Text
						color={
							presences?.[0]?.lastKnownPresence == "available"
								? "green"
								: presences?.[0]?.lastKnownPresence ==
								  "composing"
								? "yellow"
								: "gray"
						}
					>
						{circleFilled}
					</Text>
					{presences?.[0]?.lastSeen && (
						<Text>
							{DateTime.fromSeconds(
								presences[0].lastSeen,
							).toLocaleString(
								DateTime.DATETIME_MED_WITH_SECONDS,
							)}
						</Text>
					)}
				</>
			)}
		</Box>
	);
};
