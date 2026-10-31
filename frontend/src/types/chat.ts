export interface MessageSender {
  _id: string;
  username?: string;
}

export interface Message {
  _id: string;
  sender?: MessageSender | string;
  text: string;
  createdAt?: string | Date;
  room: string;
}