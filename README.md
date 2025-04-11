<div align="center">

# 🗺️✨ Placify

A community-powered platform to **explore, manage, and review places** with real-time communication and personalized user profiles.

</div>

---

## 🌟 Features

- 🔐 **User Authentication** – Secure sign up/login with email verification.
- 📍 **Place Listings** – Explore detailed information on places.
- ➕ **Add/Edit Places** – Users can add and modify their own place entries.
- 📝 **Reviews & Ratings** – Share experiences and rate places.
- ❤️ **Like/Unlike** – Support or retract reactions on places and reviews.
- 💬 **Flash Messages** – Real-time notifications for actions.
- 🕒 **Session Management** – Stay logged in across the app.
- 🔑 **Forgot Password** – Password reset via email using JWT & Nodemailer.
- 🧠 **Google OAuth** – Sign in or sign up quickly with your Google account.
- 👤 **User Profiles** – View and manage your contributions.
- ✏️ **Profile Editing** – Update profile picture and unique username.
- 🚫 **Restricted Access** – Only authors (or admins) can edit their entries.
- 🤖 **Rule-Based Chatbot** – Interactive assistant with pre-defined prompts.

---

## 🛠️ Technologies Used

| Category        | Tech Stack                            |
|----------------|----------------------------------------|
| Frontend        | HTML, CSS, JavaScript, EJS             |
| Backend         | Node.js, Express.js                    |
| Database        | MongoDB                                |
| Authentication  | Passport.js, Sessions, Google OAuth    |
| Extras          | Flash Messages, Nodemailer, JWT, Cloudinary |

---

## 🚀 Installation

### 🔧 Prerequisites

- 📦 [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)
- 🗃️ [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/cloud/atlas))

### 🛠️ Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Divyadharshan/placify.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd placify
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory and configure the following environment variables:

   ```env
   DB_URL=your_mongodb_connection_url
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET=your_cloudinary_api_secret
   EMAIL=your_email_address
   PASSWORD=your_app_password_for_email
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSIONSECRET=your_session_secret
   JWTSECRET=your_jwt_secret
   ```

5. **Run the application:**
   ```bash
   npm start
   ```

6. **Open your browser** and go to:  
   👉 [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Usage Guide

- 🔐 **Register/Login** to access the platform.
- 📌 **Add/Edit Places** to share cool spots.
- ⭐ **Review & Rate** places you've visited.
- 👤 **Edit your Profile** to make it your own.
- 🧠 **Chat with the Bot** for help.

---

## 🌐 Live Demo

🔗 [https://placify-three.vercel.app](https://placify-three.vercel.app)

---

## 🙌 Courtesy

This project was inspired and guided by **Colt Steele** (Udemy Instructor).
