import { useClient } from "@hooks";
import QRCode from "qrcode-terminal";
import { useEffect, useState } from "react";

export const useQR = (): string | undefined => {
	const client = useClient();
	const [qrcode, setQRCode] = useState<string | undefined>();

	useEffect(() => {
		const onQR = async (qr: string): Promise<void> => {
			if (!qr) return setQRCode(undefined);

			QRCode.generate(qr, { small: true }, setQRCode);
		};

		client.io.on("qr", onQR);

		return (): void => {
			client.io.off("qr", onQR);
		};
	});

	return qrcode;
};
