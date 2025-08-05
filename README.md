# 🔐 CrypTalk – Secure Video Call & Chat Web App

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://cryptalk-videocall-chat-app-frontend.onrender.com/)
[![License](https://img.shields.io/github/license/DeepanshuSehrawat/CrypTalk-VideoCall-Chat-App?style=for-the-badge)](LICENSE)

CrypTalk is a modern, real-time video calling and chat application built with a full MERN stack (MongoDB, Express, React, Node.js). It leverages WebRTC for peer-to-peer media streaming and Socket.IO for bi-directional communication.
## 🖼️ Screenshots

![Home Page] <img width="1906" height="821" alt="image" src="https://github.com/user-attachments/assets/fa388e80-08fa-492c-96a7-7cfe27949f74" />


![Lobby Page] <img width="1888" height="902" alt="image" src="https://github.com/user-attachments/assets/e1fc85fb-bb6f-4af5-9663-08b4803e345f" />

---

## 🔗 Live Project

🔴 Frontend: [cryptalk-videocall-chat-app-frontend.onrender.com](https://cryptalk-videocall-chat-app-frontend.onrender.com/)

---

## ⚙️ Core Features

- 📹 Real-time peer-to-peer video calling (WebRTC)
- 💬 Instant chat messaging (Socket.IO)
- 🔐 User authentication with encrypted passwords (bcrypt)
- 📄 Chat & meeting history logging (MongoDB)
- 🌐 Auto-join via shared meeting URL
- 📴 Toggle video/audio during call
- 🧑‍💼 Lobby system before joining
- 🧪 Basic chat badge notification

---

## 🧠 Tech Stack – Detailed Breakdown

### 🔌 **Socket.IO**
- Enables low-latency, event-based communication between users.
- Used for:
  - User join/leave notifications
  - Real-time messaging
  - Signaling between peers for WebRTC handshaking

### 🧿 **WebRTC (Web Real-Time Communication)**
- Used to establish direct peer-to-peer media (audio/video) connections.
- Handles:
  - SDP offers/answers for negotiation
  - ICE candidates for NAT traversal
  - MediaStream handling (track control for mic/cam)

### 🔐 **bcrypt**
- Used for password hashing and verification in authentication.
- Ensures secure storage of user credentials in MongoDB.
- Resistant to rainbow table and brute force attacks.

### 🗃️ **MongoDB + Mongoose**
- NoSQL database used to store:
  - User credentials
  - Meeting history and metadata
  - Timestamps for user sessions

### 🌐 **React.js (Frontend)**
- Built with [Vite](https://vitejs.dev/) for blazing fast dev & build.
- Manages:
  - UI state (audio/video toggles, messages, users)
  - Routing between lobby, video call, and history pages
  - Media control & rendering via React refs

### 🛠️ **Express.js (Backend)**
- REST API server and Socket.IO integration
- Handles:
  - Auth endpoints (register/login)
  - History fetch per user
  - Socket event broadcasting

### 💅 **Material UI (MUI)**
- Used for all frontend components and styling
- Includes:
  - Buttons, Icons, Cards, Inputs, Badges
  - Responsive layout helpers

---

## 🧪 Project Directory Structure
```
CrypTalk-VideoCall-Chat-App/
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── contexts/
│ │ ├── pages/
│ │ └── App.jsx
│ ├── .env
│ └── vite.config.js
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── socket/
│ ├── .env
│ └── index.js
```
---

## 🚀 Run Locally

### 1️⃣ Clone the repo
```bash
git clone https://github.com/DeepanshuSehrawat/CrypTalk-VideoCall-Chat-App.git
cd CrypTalk-VideoCall-Chat-App
```
### 2️⃣ Start Backend
```bash
Copy
Edit
cd backend
npm install
node index.js
```
###3️⃣ Start Frontend
```bash
Copy
Edit
cd ../frontend
npm install
npm run dev
```
🔐 Create .env files in both frontend/ and backend/ folders to configure MongoDB URI, JWT_SECRET, etc.
###🧾 Future Improvements
✅ Screen sharing

🔒 End-to-End encrypted chat

📱 Mobile PWA support

🎨 Theme customization (dark/light)

📋 Meeting notes export

📅 Google Calendar integration

###👨‍💻 Author
Deepanshu Sehrawat

🔗 GitHub Profile [https://github.com/DeepanshuSehrawat]

📧 deepanshusehrawat008@gmail.com

###Made with 🔥 by Deepanshu Sehrawat
