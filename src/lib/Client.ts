import { ChatJson, ClientToServer, ServerToClient } from "@typings/SocketIO";
import { io, Socket } from "socket.io-client";
import { EventEmitter } from "stream";

export class Client extends EventEmitter {
	io: Socket<ServerToClient, ClientToServer>;

	chats: ChatJson[] = [];
	server = process.env.SERVER ?? "http://localhost:3000";
	token = process.env.TOKEN;

	constructor() {
		super();

		this.io = io(this.server, {
			auth: {
				token: this.token,
			},
			autoConnect: false,
		});

		if (this.token) {
			this.io.connect();
		}

		this.io.onAny((ev, data) => {
			console.log(`Event: ${ev}`, data);
		});

		this.io.on("connect_error", (err) => {
			if (["Invalid Token", "xhr poll error"].includes(err.message))
				return;
			console.log("Disconnnected", err);
		});

		this.io.emit("chats", (chats) => {
			this.chats = chats;
			console.log(chats);

			this.emit("chats", chats);
		});

		this.io.on("message", (messages) => {
			const uniqIds = [...new Set(messages.map((m) => m.chatId))];
			console.log("Received messages from the following chats", uniqIds);

			messages.forEach((msg) => {
				this.chats
					.find((chat) => chat.id == msg.chatId)
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
