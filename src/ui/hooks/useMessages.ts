import { useClient } from "@hooks";
import { ChatJson, MessageJson } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const useMessages = (chat?: ChatJson): MessageJson[] => {
	const client = useClient();
	const [messages, setMessages] = useState<MessageJson[]>([]);

	useEffect(() => {
		const updateMessages = (chatIds: string[]): void => {
			if (chat?.id && chatIds.includes(chat.id)) {
				setMessages(client.messages[chat.id].slice() ?? []);
			}
		};
		if (chat) {
			if (!client.messages[chat.id]?.length) {
				client.io.emit(
					"messages.for",
					{ chatId: chat.id, length: 10 },
					(messages) => {
						setMessages(messages);
						client.messages[chat.id] = messages;
					},
				);
			} else {
				setMessages(client.messages[chat.id] ?? []);
			}
		}
		client.on("message.for", updateMessages);

		return (): void => {
			client.off("message.for", updateMessages);
		};
	}, [chat, setMessages]);

	return messages;
};
