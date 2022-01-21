import { useContact } from "@hooks";
import type { FC } from "react";
import React from "react";

export const ContactName: FC<{ id?: string }> = ({ id }) => {
	if (!id) return <>Someone</>;

	const contact = useContact(id);

	return <>{contact?.name ?? contact?.notify ?? id}</>;
};
