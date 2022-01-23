import { isJidUser } from "@adiwajshing/baileys";
import { useClient } from "@hooks";
import { ChatJson, DBContact } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const usePresence = (chat: ChatJson): DBContact | undefined => {
	const [presence, setPresence] = useState<DBContact | undefined>();
	const client = useClient();

	useEffect(() => {
		const onPresences = (pres: DBContact[]): void => {
			const presence = pres.find((pres) => pres.id == chat.id);

			presence && setPresence(presence);
		};

		if (chat && isJidUser(chat.id))
			client.io.emit("presence.subscribe", chat.id, (presence) => {
				if (presence) setPresence(presence);
			});

		client.io.on("presence", onPresences);

		return (): void => {
			client.io.off("presence", onPresences);
		};
	}, [client.io, chat, setPresence]);

	return presence;
};
