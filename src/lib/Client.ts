import {
	ChatJson,
	ClientToServer,
	MessageJson,
	ServerToClient,
} from "@typings/SocketIO";
import { DateTime } from "luxon";
import { io, Socket } from "socket.io-client";
import { EventEmitter } from "stream";

export class Client extends EventEmitter {
	io: Socket<ServerToClient, ClientToServer>;

	chats: ChatJson[] = [];
	messages: Record<string, MessageJson[]> = {};

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

		this.io.onAny((ev) => {
			console.log(`Event: ${ev}`);
		});

		this.io.on("connect_error", (err) => {
			if (["Invalid Token", "xhr poll error"].includes(err.message))
				return;
			console.log("Disconnnected", err);
		});

		this.io.emit("chats", (chats) => {
			this.chats = chats;
			this.emit("chats", chats);
		});

		this.io
			.on("message", (messages) => {
				const uniqIds = [...new Set(messages.map((m) => m.chatId))];
				console.log(
					"Received messages from the following chats",
					uniqIds,
				);

				messages.forEach((msg) => {
					if (msg.chatId) {
						this.messages[msg.chatId] ??= [];
						this.messages[msg.chatId].unshift(msg);
					}
				});

				this.emit("message.for", uniqIds);
			})
			.on("chats.update", (chats) => {
				let emitResort = false;
				chats.forEach((chat) => {
					const foundChat = this.chats.find((ch) => ch.id == chat.id);
					console.log("f", foundChat);

					if (foundChat) {
						if (chat.conversationTimestamp) {
							console.log(
								foundChat.time,
								DateTime.fromSeconds(
									+chat.conversationTimestamp,
								).toISO(),
							);
							foundChat.time = DateTime.fromSeconds(
								+chat.conversationTimestamp,
							).toISO();
							emitResort = true;
						}

						if (chat.unreadCount)
							foundChat.unreadCount = chat.unreadCount;
					}
				});

				if (emitResort) this.emit("chats.resort");
			});
	}

	destroy(): void {
		this.io.disconnect();
		this.removeAllListeners();
	}
}
