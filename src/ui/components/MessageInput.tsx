import { Box, useFocus } from "ink";
import TextInput from "ink-text-input";
import type { FC } from "react";
import React, { useState } from "react";

export const MessageInput: FC = () => {
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
				onSubmit={(): void => {
					setComposed("");
				}}
				placeholder="Type a message"
			/>
		</Box>
	);
};
