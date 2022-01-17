import { ChatList, SelectedChat } from "@components";
import { useChats, useConnection } from "@hooks";
import { ConnectionState } from "@typings/ConnectionState";
import { ChatJson } from "@typings/SocketIO";
import { Box, Text, useFocus } from "ink";
import type { FC } from "react";
import React, { useState } from "react";
import { Connection } from "src/ui/components/Connection";

export const Dashboard: FC = () => {
	const [selectedChat, selectChat] = useState<ChatJson | undefined>();
	const chats = useChats();

	const { isFocused: chatSelectFocus } = useFocus({ id: "chatSelect" });

	const connection = useConnection();

	return (
		<Box width="100%" borderStyle="single" flexDirection="column">
			<Box>
				<Box width="20%">
					<Connection />
				</Box>
				{selectedChat && (
					<Box borderStyle="single" flexGrow={1}>
						<Text>{selectedChat?.name}</Text>
					</Box>
				)}
			</Box>
			{connection == ConnectionState.connected && chats.length != 0 && (
				<Box>
					<Box
						width="20%"
						flexDirection="column"
						borderStyle="single"
						borderColor={chatSelectFocus ? "blue" : undefined}
					>
						<ChatList
							isFocused={chatSelectFocus}
							selectChat={selectChat}
						/>
					</Box>
					<Box
						flexGrow={1}
						flexDirection="column"
						borderStyle="single"
					>
						<SelectedChat chat={selectedChat} />
					</Box>
				</Box>
			)}
		</Box>
	);
};
