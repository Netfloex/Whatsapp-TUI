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

		this.io.onAny((ev, data) => {
			console.log(`Event: ${ev}`, data);
		});

		this.io.on("connect_error", (err) => {
			if (err.message == "Invalid Token") {
				return console.log("Invalid Token");
			}
			console.log("Disconnnected", err);
		});

		this.io.emit("chats", (chats) => {
			this.chats = chats;
			this.emit("chats", chats);
		});

		this.io.on("message", (messages) => {
			const uniqIds = [...new Set(messages.map((m) => m.chatJid))];
			console.log("Received messages from the following chats", uniqIds);

			messages.forEach((msg) => {
				this.chats
					.find((chat) => chat.id == msg.chatJid)
					?.messages.unshift(msg);
			});

			this.emit("message.for", uniqIds);
		});
	}

	destroy(): void {
		this.io.disconnect();
		this.removeAllListeners();
	}
}
