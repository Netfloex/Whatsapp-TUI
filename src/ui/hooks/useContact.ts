import { useClient } from "@hooks";
import { DBContact } from "@typings/SocketIO";
import { useEffect, useState } from "react";

export const useContact = (id: string): DBContact | undefined => {
	const client = useClient();

	const [contact, setContact] = useState(
		client.contacts.find((c) => c.id == id),
	);

	useEffect(() => {
		client.getContact(id).then(setContact);
	}, [id]);

	return contact;
};
