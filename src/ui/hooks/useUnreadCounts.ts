import { Chat } from "@adiwajshing/baileys-md";
import { useClient } from "@hooks";
import { useEffect, useState } from "react";

type UnreadCounts = Record<string, number>;

export const useUnreadCounts = (): UnreadCounts => {
	const client = useClient();
	const [unreadCounts, setUnreads] = useState<UnreadCounts>({});

	useEffect(() => {
		const onUpdate = (chats: Partial<Chat>[]): void => {
			setUnreads((oldCount) => {
				chats.forEach((chat) => {
					if (chat.id && chat.unreadCount) {
						oldCount[chat.id] = chat.unreadCount;
					}
				});

				return { ...oldCount };
			});
		};

		client.io.on("chats.update", onUpdate);

		return (): void => {
			client.io.off("chats.update", onUpdate);
		};
	}, [client.io]);

	return unreadCounts;
};
