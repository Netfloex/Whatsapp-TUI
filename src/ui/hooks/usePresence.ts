import { PresenceData } from "@adiwajshing/baileys-md";
import { useClient } from "@hooks";
import { ChatJson, PresenceUpdate } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const usePresence = (chat: ChatJson): PresenceData | undefined => {
	const [presences, setPresences] = useState<PresenceData | undefined>();
	const client = useClient();

	useEffect(() => {
		const onPresence = ({ id, presences }: PresenceUpdate): void => {
			if (id == chat.id) {
				setPresences(presences[chat.id]);
			}
		};

		if (chat && !chat.isGroup)
			client.io.emit("presence.subscribe", chat.id, (presences) => {
				if (presences) setPresences(presences);
			});

		client.io.on("presence", onPresence);

		return (): void => {
			client.io.off("presence", onPresence);
		};
	}, [chat, setPresences]);

	return presences;
};
