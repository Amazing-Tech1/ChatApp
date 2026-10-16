# ChatApp 💬

A full-stack real-time messaging application built with React, Node.js, TypeScript, Socket.IO, MongoDB, Cloudinary, and Arcjet. ChatApp enables users to communicate instantly, share images, see who's online, and manage their conversations through a responsive interface.

**Live Demo:** [https://chatapp-80il.onrender.com/](https://chatapp-80il.onrender.com/)

## Features

- **User Authentication:** Secure user authentication using JSON Web Tokens (JWT).
- **Access and Refresh Tokens:** Token-based authentication with separate access and refresh tokens.
- **Real-Time Messaging:** Send and receive messages instantly using Socket.IO.
- **Online User Presence:** See which users are currently online.
- **Image Sharing:** Upload and share images using Cloudinary.
- **Message History:** Retrieve previous conversations.
- **Sound Notifications:** Audio notifications for incoming messages, with a sound preference setting.
- **Welcome Emails:** Email delivery for new-user welcome messages using Resend.
- **Responsive Interface:** Chat interface designed for desktop and mobile screens.
- **Security:** Arcjet integration for application security and request protection.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI
- Zustand
- Axios
- Socket.IO Client
- Sonner

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- JSON Web Tokens (JWT)
- bcryptjs
- Cloudinary
- Resend
- Arcjet

### Deployment and Tools

- Render
- pnpm
- Git and GitHub

## Architecture

ChatApp uses a full-stack architecture in which the React frontend communicates with the Express backend through HTTP requests and Socket.IO connections.

- **Frontend:** Handles the user interface, authentication state, conversations, and message interactions.
- **Backend:** Handles API requests, authentication, database operations, image uploads, and real-time communication.
- **MongoDB:** Stores application data, including user and conversation information.
- **Socket.IO:** Enables real-time messaging and online-user updates.
- **Cloudinary:** Provides image hosting and delivery.
- **Resend:** Handles transactional email delivery.
- **Arcjet:** Provides application security capabilities.

## Getting Started

### Prerequisites

Before running the application locally, ensure you have:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- A MongoDB database, either local or hosted
- A Cloudinary account for image uploads
- A Resend account for email delivery
- An Arcjet account and API key

### 1. Clone the Repository

```bash
git clone https://github.com/Amazing-Tech1/ChatApp.git
cd ChatApp
```

### 2. Configure Environment Variables

Create the backend environment file in the location expected by your backend configuration, typically `backend/.env`.

Add the following variables with values appropriate for your environment:

```env
NODE_ENV=development
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_sender_email
EMAIL_FROM_NAME=ChatApp

CLIENT_URL=http://localhost:5173

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_ENV=development
ARCJET_KEY=your_arcjet_api_key
```

**Important:**

- Replace the example values with your actual configuration.
- Use different, strong secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Configure `EMAIL_FROM` with a sender address permitted by your Resend setup.
- Set `CLIENT_URL` to the frontend origin used in your environment.
- Confirm the expected values for `ARCJET_ENV` against your Arcjet configuration.
- Never commit `.env` files, credentials, or secret keys to GitHub.
- The variables above are based on the supplied project configuration; verify their exact usage in the backend source code before deployment.

### 3. Install Dependencies

The project uses pnpm and has separate backend and frontend packages.

From the repository root, install each package's dependencies:

```bash
pnpm install --prefix backend
pnpm install --prefix frontend
```

### 4. Run the Application Locally

The exact development commands depend on the scripts defined in `backend/package.json` and `frontend/package.json`.

Check each package's `scripts` section and run its configured development command in a separate terminal.

Ensure the frontend API configuration points to your local backend and that the backend accepts requests from the frontend's local origin.

### 5. Build the Application

From the repository root, run:

```bash
pnpm run build
```

The root build script installs the backend and frontend dependencies, builds the backend TypeScript application, and builds the frontend.

### 6. Start the Application

After a successful build, run:

```bash
pnpm start
```

The root start script launches the backend using the start command defined in `backend/package.json`.

In production, the backend is configured to serve the frontend build. Confirm the production static-file configuration and port settings before running the application.

## Deployment

ChatApp is deployed on Render.

**Live application:** [https://chatapp-80il.onrender.com/](https://chatapp-80il.onrender.com/)

The root `package.json` defines these deployment scripts:

```json
{
  "scripts": {
    "build": "pnpm install --prefix backend && pnpm install --prefix frontend && cd backend && pnpm build && cd ../frontend && pnpm build",
    "start": "cd backend && pnpm start"
  }
}
```

### Render Configuration

Use the following commands in the Render service configuration, subject to your repository's current settings:

**Build Command**

```bash
pnpm run build
```

**Start Command**

```bash
pnpm start
```

Configure the required environment variables in the Render dashboard. Do not include secret values in your repository or README.

Because the application serves its frontend through the backend in production, ensure that the backend's static-file path points to the correct frontend build directory.

## Security Considerations

- Store passwords using a secure password-hashing mechanism.
- Protect private routes and API endpoints with authentication and authorization checks.
- Keep access-token and refresh-token secrets private.
- Configure secure cookie options appropriately for production.
- Validate and restrict cross-origin requests to trusted origins.
- Protect sensitive routes and requests using the configured Arcjet rules.
- Validate uploaded files and handle upload failures safely.
- Keep dependencies and server-side packages updated.

## Future Improvements

Potential enhancements include:

- Message read receipts
- Typing indicators
- Message delivery status
- Message search
- Group conversations
- Push notifications

These are possible future additions, not claims about currently implemented functionality.

## Author

**Makinde Kelvin Olamide** (Tutorial )

- GitHub: [@Amazing-Tech1](https://github.com/Amazing-Tech1)

## License

No license has been specified yet. Until a license is added to the repository, permissions for reuse and redistribution should not be assumed.
