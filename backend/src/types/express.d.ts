export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  image_url: string;
  refreshTokenId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
