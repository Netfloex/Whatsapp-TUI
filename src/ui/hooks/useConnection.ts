import { useClient } from "@hooks";
import { useEffect, useState } from "react";

export const useConnection = (): boolean => {
	const client = useClient();
	const [connected, setConnected] = useState(client.io.connected);

	useEffect(() => {
		const connected = (): void => setConnected(true);
		const disconnected = (): void => setConnected(false);

		client.io.on("connect", connected);
		client.io.on("disconnect", disconnected);

		return (): void => {
			client.io.off("connect", connected);
			client.io.off("disconnect", disconnected);
		};
	}, []);

	return connected;
};
