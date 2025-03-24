export interface Authorization {
	username: string;
	public_key?: string;
	password: string;
}

export interface Chat {
	id: string;
	name: string;
	logo: string;
	description: string;
	admins: string[];
	members: string[];
	pins: string[];
	private: boolean;
	broadcast: boolean;
	symetric_keys: string[];
	created: number;
	lastMessage?: Partial<Message>;
	unread?: number;
}

export interface MessageEvent {
  type: 'created' | 'updated' | 'deleted';
  message: Message;
}

export interface Attachment {
  type: 'image' | 'video' | 'file' | 'audio';
  uri: string;
  filename: string;
}

export interface Reaction { 
  emoji: 'like' | 'love' | 'haha' | 'sad' | 'angry';
  count: number;
  /** Public key of the reactor */
  reactors?: string[];
}

export interface Seen {
  by: string;
  at: number;
}

export interface Message {
	id: string;
	content: string;
	edited: boolean;
	seen?: Seen[];
	/** Author's public key */
	author?: string;
	/** Associated chat ID */
	ctx: string;
	attachments?: Attachment[];
	mentions?: string[];
	reactions?: Reaction[];
	created: number;
}