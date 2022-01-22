import { useClient } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { Box, Text, useFocus, useInput } from "ink";
import TextInput from "ink-text-input";
import React, { FC, useCallback, useState } from "react";

export const MessageInput: FC<{ chat: ChatJson }> = ({ chat }) => {
	const client = useClient();

	const [composedMessage, setComposed] = useState("");
	const [suggestedMessage, suggest] = useState("");

	const { isFocused } = useFocus({
		id: "messageInput",
		autoFocus: true,
	});
	const onChange = (value: string): void => {
		setComposed(value);
		client.suggestMessage(value).then(suggest);
	};

	useInput(
		useCallback(
			(input, key) => {
				if (key.rightArrow || (key.ctrl && input == "`")) {
					setComposed(suggestedMessage);
				}
			},
			[suggestedMessage],
		),
		{ isActive: isFocused },
	);

	return (
		<Box borderStyle="single" borderColor={isFocused ? "blue" : undefined}>
			<TextInput
				value={composedMessage}
				focus={isFocused}
				onChange={onChange}
				onSubmit={(text): void => {
					setComposed("");
					if (text) {
						client.io.emit("message.send", {
							jid: chat.id,
							text,
						});
					}
				}}
				placeholder={`Send a message to ${chat.name}`}
			/>
			<Text dimColor>
				{suggestedMessage?.slice(composedMessage.length + 1)}
			</Text>
		</Box>
	);
};
