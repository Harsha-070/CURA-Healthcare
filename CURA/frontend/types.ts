export enum MessageSender {
  USER = 'USER',
  BOT = 'BOT',
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
}

export interface User {
  username: string;
  password: string; // In a real app, this should be hashed.
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  isArchived: boolean;
}

export type Theme = 'light' | 'dark';