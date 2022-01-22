import { useContact } from "@hooks";
import type { FC } from "react";
import React from "react";

export const ContactName: FC<{ id?: string }> = ({ id }) => {
	const contact = useContact(id);

	if (!id) return <>Someone</>;

	return <>{contact?.name ?? contact?.notify ?? id}</>;
};
