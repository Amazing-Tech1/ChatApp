export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  image_url: string;
  refreshTokenId?: string | null;
}

export interface IMessage {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text?: string;
  image?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
