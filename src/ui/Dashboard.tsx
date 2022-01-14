import { ChatList, SelectedChat } from "@components";
import { useConnection } from "@hooks";
import { ConnectionState } from "@typings/ConnectionState";
import { ChatJson } from "@typings/SocketIO";
import { Box, useFocus } from "ink";
import type { FC } from "react";
import React, { useState } from "react";
import { Connection } from "src/ui/components/Connection";

export const Dashboard: FC = () => {
	const [selectedChat, selectChat] = useState<ChatJson | undefined>();

	const { isFocused: chatSelectFocus } = useFocus({ id: "chatSelect" });

	const connection = useConnection();
	return (
		<Box width="100%" borderStyle="single" flexDirection="column">
			<Connection />
			{connection == ConnectionState.connected && (
				<Box>
					<ChatList
						isFocused={chatSelectFocus}
						selectChat={selectChat}
					/>
					<SelectedChat chat={selectedChat} />
				</Box>
			)}
		</Box>
	);
};
