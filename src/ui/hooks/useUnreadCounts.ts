import { useClient } from "@hooks";
import { MessageJson } from "@typings/SocketIO";
import { useEffect, useState } from "react";

type UnreadCounts = Record<string, number>;

export const useUnreadCounts = (): UnreadCounts => {
	const client = useClient();
	const [unreadCounts, setUnreads] = useState<UnreadCounts>({});

	useEffect(() => {
		const onMessage = (messages: MessageJson[]): void => {
			setUnreads((oldCount) => {
				messages.forEach((msg) => {
					if (msg.chatId)
						oldCount[msg.chatId] = msg.fromMe
							? 0
							: (oldCount[msg.chatId] ?? 0) + 1;
				});

				return { ...oldCount };
			});
		};

		client.io.on("message", onMessage);

		return (): void => {
			client.io.off("message", onMessage);
		};
	}, []);

	return unreadCounts;
};
