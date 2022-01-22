import { ChatList, ChatTitle, Connection, SelectedChat } from "@components";
import { useChats, useConnection } from "@hooks";
import { ConnectionState } from "@typings/ConnectionState";
import { ChatJson } from "@typings/SocketIO";
import { Text, Box, Newline } from "ink";
import React, { FC, useEffect, useState } from "react";
import { useQR } from "src/ui/hooks/useQR";

export const Dashboard: FC = () => {
	const chats = useChats();
	const connection = useConnection();

	const [selectedChat, selectChat] = useState<ChatJson | undefined>();

	useEffect(() => {
		if (!selectedChat) selectChat(chats[0]);
	}, [chats, selectedChat]);

	const qrcode = useQR();

	return (
		<>
			<Box width="100%" borderStyle="single" flexDirection="column">
				<Box>
					<Box width="20%">
						<Connection />
					</Box>
					{connection == ConnectionState.connected &&
						selectedChat && (
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
				{qrcode && (
					<Box flexDirection="column" margin={1}>
						<Text>
							Please Scan the QR Code:
							<Newline />
							<Newline />
							{qrcode}
						</Text>
					</Box>
				)}
			</Box>
		</>
	);
};
