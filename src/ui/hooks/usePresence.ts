import { useClient } from "@hooks";
import { ChatJson, PresenceUpdate } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const usePresence = (chat: ChatJson): PresenceUpdate["presences"] => {
	const [presences, setPresences] = useState<PresenceUpdate["presences"]>({});
	const client = useClient();

	useEffect(() => {
		const onPresence = ({ id, presences }: PresenceUpdate): void => {
			if (id == chat.id) {
				setPresences(presences);
			}
		};

		client.io.on("presence", onPresence);

		return (): void => {
			client.io.off("presence", onPresence);
		};
	}, [chat, setPresences]);

	return presences;
};
