import { useChats, useClient } from "@hooks";
import { ChatJson, MessageJson } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const useMessages = (chat?: ChatJson): MessageJson[] => {
	const client = useClient();
	const [messages, setMessages] = useState(chat?.messages ?? []);

	const chats = useChats();

	useEffect(() => {
		if (chat) setMessages(chat.messages);
	}, [chats, chat]);

	useEffect(() => {
		const updateMessages = (chatIds: string[]): void => {
			if (chat?.id && chatIds.includes(chat.id)) {
				setMessages(chat.messages.slice());
			}
		};
		client.on("message.for", updateMessages);
		return (): void => {
			client.off("message.for", updateMessages);
		};
	}, [chat]);

	return messages;
};
