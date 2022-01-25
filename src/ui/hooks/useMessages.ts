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
			client.getMessages(chat.id).then(setMessages);
		}

		client.on("message.for", updateMessages);

		return (): void => {
			client.off("message.for", updateMessages);
		};
	}, [client, chat, setMessages]);

	return messages;
};
