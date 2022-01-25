import { useClient } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { useEffect, useState } from "react";

type UnreadCounts = Record<string, number | undefined>;

export const useUnreadCounts = (): UnreadCounts => {
	const client = useClient();
	const [unreadCounts, setUnreads] = useState<UnreadCounts>({});

	useEffect(() => {
		const onUpdate = (chats: ChatJson[]): void => {
			setUnreads((oldCount) => {
				chats.forEach((chat) => {
					if (chat.id && "unreadCount" in chat) {
						oldCount[chat.id] = chat.unreadCount;
					}
				});

				return { ...oldCount };
			});
		};

		onUpdate(client.chats);

		client.io.on("chats.unreadCount", onUpdate);
		return (): void => {
			client.io.off("chats.unreadCount", onUpdate);
		};
	}, [client]);

	return unreadCounts;
};
