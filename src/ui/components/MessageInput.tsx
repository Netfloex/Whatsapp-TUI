import { useClient } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { Box, useFocus } from "ink";
import TextInput from "ink-text-input";
import type { FC } from "react";
import React, { useState } from "react";

export const MessageInput: FC<{ chat: ChatJson }> = ({ chat }) => {
	const client = useClient();

	const [composedMessage, setComposed] = useState("");

	const { isFocused: messageInputFocus } = useFocus({
		id: "messageInput",
		autoFocus: true,
	});

	return (
		<Box borderStyle="single">
			<TextInput
				value={composedMessage}
				focus={messageInputFocus}
				onChange={setComposed}
				onSubmit={(text): void => {
					setComposed("");
					client.io.emit("message.send", {
						jid: chat.id,
						text,
					});
				}}
				placeholder={`Send a message to ${chat.name}`}
			/>
		</Box>
	);
};
