import { ChatList, ChatTitle, Connection, SelectedChat } from "@components";
import { useChats, useConnection } from "@hooks";
import { ConnectionState } from "@typings/ConnectionState";
import { ChatJson } from "@typings/SocketIO";
import { Box } from "ink";
import React, { FC, useEffect, useState } from "react";

export const Dashboard: FC = () => {
	const chats = useChats();
	const connection = useConnection();

	const [selectedChat, selectChat] = useState<ChatJson | undefined>();

	useEffect(() => {
		if (!selectedChat) selectChat(chats[0]);
	}, [chats, selectedChat]);

	return (
		<Box width="100%" borderStyle="single" flexDirection="column">
			<Box>
				<Box width="20%">
					<Connection />
				</Box>
				{connection == ConnectionState.connected && selectedChat && (
					<ChatTitle selectedChat={selectedChat} />
				)}
			</Box>
			{connection == ConnectionState.connected && chats.length != 0 && (
				<Box>
					<Box width="20%" flexDirection="column-reverse">
						<ChatList
							selectChat={selectChat}
							selectedChat={selectedChat}
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
