import "dotenv/config";

const clientURL = process.env.CLIENT_URL;

if (!clientURL) {
  throw new Error("CLIENT_URL is not defined in environment variables");
}

export const corsOptions = {
  origin: [clientURL],
  credentials: true,
};
