import { useClient } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const useChats = (cb?: (chats: ChatJson[]) => void): ChatJson[] => {
	const client = useClient();

	const [chats, setChats] = useState(client.chats);

	useEffect(() => {
		const updateChats = (chats: ChatJson[]): void => {
			setChats(chats);
			cb?.(chats);
		};

		client.on("chats", updateChats);

		return (): void => {
			client.off("chats", updateChats);
		};
	}, []);

	return chats;
};
