**Journey Journal** is a full-stack web application and social forum for travelers. Users can share their travel stories, browse posts from other travelers, and engage in discussions using an Instagram-style comment and reply system.

## Key Features

- **User Authentication:** Secure registration and login flow with protected routes.
- **Travel Posts Feed:** Create, view, and explore travel impressions with images and descriptions.
- **Nested Comment Replies:** Interactive comment section allowing users to reply directly to specific comments with automatic parent-comment linking.

## Getting Started (Local Setup)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hopelesszz/travel-front.git
   cd travel-front
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - **To use the deployed backend API:** Keep `.env` with `VITE_API_URL=https://my-backend.onrender.com` (or your own backend URL).
   - **To run with a local backend (`travel-back`):** Leave `VITE_API_URL` empty (or remove `.env`) and start the backend server on `http://localhost:8800` — Vite proxy in `vite.config.js` will forward API requests automatically.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## Related Repositories

- **Backend Repository:** ([https://github.com/Hopelesszz/travel-back])
