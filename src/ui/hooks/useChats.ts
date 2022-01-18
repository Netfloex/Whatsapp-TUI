import { useClient } from "@hooks";
import { ChatJson } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const useChats = (): ChatJson[] => {
	const client = useClient();

	const [chats, setChats] = useState(client.chats);

	useEffect(() => {
		const updateChats = (chats: ChatJson[]): void => {
			setChats(chats);
		};

		const resortChats = (): void => {
			setChats((chats) =>
				chats
					.sort(
						(a, b) =>
							new Date(b.time).valueOf() -
							new Date(a.time).valueOf(),
					)
					.slice(),
			);
		};

		client.on("chats.resort", resortChats);
		client.on("chats", updateChats);
		return (): void => {
			client.off("chats", updateChats);
			client.off("chats.resort", resortChats);
		};
	}, []);

	return chats;
};
