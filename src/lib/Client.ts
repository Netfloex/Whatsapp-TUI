import { ClientToServer, ServerToClient } from "@typings/SocketIO";
import { io, Socket } from "socket.io-client";

export class Client {
	io: Socket<ServerToClient, ClientToServer>;
	constructor() {
		this.io = io(process.env.SERVER ?? "http://localhost:3000", {
			auth: {
				token: process.env.TOKEN,
			},
		});

		this.io.on("connect", () => {
			console.log("Connected");
		});

		this.io.on("disconnect", () => {
			console.log("Disconnect");
		});

		this.io.on("connect_error", (err) => {
			console.log("Disconnnected", err);
		});

		this.io.emit("messages", (data) => {
			console.log("Received", data);
		});

		this.io.on("message", (messages) => {
			console.log("new", messages[0]);
		});
	}
}
