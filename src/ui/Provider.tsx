import React, { createContext, FC, useEffect, useState } from "react";

import { Client } from "@lib";

const ClientContext = createContext<Client | undefined>(undefined);
export default ClientContext;

export const Provider: FC = ({ children }) => {
	const [client] = useState(new Client());

	useEffect(() => {
		return (): void => {
			client.destroy();
		};
	}, []);

	const { Provider } = ClientContext;
	return <Provider value={client}>{children}</Provider>;
};
