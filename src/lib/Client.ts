import { ChatJson, ClientToServer, ServerToClient } from "@typings/SocketIO";
import { io, Socket } from "socket.io-client";
import { EventEmitter } from "stream";

export class Client extends EventEmitter {
	io: Socket<ServerToClient, ClientToServer>;

	chats: ChatJson[] = [];

	constructor() {
		super();

		this.io = io(process.env.SERVER ?? "http://localhost:3000", {
			auth: {
				token: process.env.TOKEN,
			},
		});

		this.io.on("connect", () => {
			console.log("Connected");
		});
		this.io.onAny((ev, data) => {
			console.log(`Event: ${ev}`, data);
		});

		this.io.on("disconnect", () => {
			console.log("Disconnect");
		});

		this.io.on("connect_error", (err) => {
			console.log("Disconnnected", err);
		});

		this.io.emit("chats", (chats) => {
			this.chats = chats;
			this.emit("chats", chats);
		});

		this.io.on("message", (messages) => {
			console.log("new", messages[0]);
		});
	}
}
