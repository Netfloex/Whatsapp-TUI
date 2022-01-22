import { useClient } from "@hooks";
import { ConnectionState } from "@typings/ConnectionState";
import { useEffect, useState } from "react";

export const useConnection = (): ConnectionState => {
	const client = useClient();
	const [connected, setConnected] = useState<ConnectionState>(
		client.io.connected
			? ConnectionState.connected
			: ConnectionState.disconnected,
	);

	useEffect(() => {
		const connected = (): void => setConnected(ConnectionState.connected);
		const disconnected = (): void =>
			setConnected(ConnectionState.disconnected);
		const error = (err: Error): void => {
			if (err.message == "xhr poll error") {
				return setConnected(ConnectionState.serverdown);
			}
			if (err.message == "Invalid Token") {
				return setConnected(ConnectionState.invalidToken);
			}
		};

		client.io.on("connect", connected);
		client.io.on("disconnect", disconnected);
		client.io.on("connect_error", error);

		return (): void => {
			client.io.off("connect", connected);
			client.io.off("disconnect", disconnected);
			client.io.off("connect_error", error);
		};
	}, [client.io]);

	return connected;
};
