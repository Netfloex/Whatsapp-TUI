import { useClient, useConnection } from "@hooks";
import { ConnectionState } from "@typings/ConnectionState";
import { Text } from "ink";
import type { FC } from "react";
import React from "react";

export const Connection: FC = () => {
	const connected = useConnection();
	const client = useClient();

	if (!client.token) {
		return (
			<Text color="yellow">
				Please add the <Text bold={true}>TOKEN</Text> environment
				variable
			</Text>
		);
	}

	switch (connected) {
		case ConnectionState.connected:
			return <Text color={"green"}>Connected</Text>;

		case ConnectionState.disconnected:
			return <Text color={"red"}>Disconnected</Text>;

		case ConnectionState.serverdown:
			return (
				<Text color={"red"}>
					Couldn&apos;t connect to the server: {client.server}
				</Text>
			);
		case ConnectionState.invalidToken:
			return <Text color="red">Invalid Token</Text>;

		default:
			throw new Error("Unknown ConnectionState");
	}
};
