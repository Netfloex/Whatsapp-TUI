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
							new Date(b.messages[0].time).valueOf() -
							new Date(a.messages[0].time).valueOf(),
					)
					.slice(),
			);
		};

		client.on("message.for", resortChats);

		client.on("chats", updateChats);
		return (): void => {
			client.off("chats", updateChats);
			client.off("message.for", resortChats);
		};
	}, []);

	return chats;
};
