# EchoChat

A **real-time chat application** built with the MERN stack and Socket.io, featuring secure authentication, multimedia messaging, and 32 customizable UI themes.

---

## 📋 Table of Contents

- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Getting Started](#-getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running the App](#running-the-app)  
- [Configuration](#-configuration)  
  - [Environment Variables](#environment-variables)  
  - [Theme Customization](#theme-customization)  
- [Usage](#-usage)  
- [Project Structure](#-project-structure)  
- [Testing](#-testing)  
- [Contributing](#-contributing)  
- [License](#-license)  
- [Contact](#-contact)  

---

## 🔥 Features

- **Authentication**  
  - Secure signup & login with JWT and bcrypt password hashing  
- **Real-Time Chat**  
  - Low-latency, bi-directional messaging via Socket.io  
  - Support for text, images, audio clips, and file attachments  
- **Themes**  
  - 32 built-in UI themes  
  - Dynamic theme switching without page reload  
- **User Management**  
  - User profiles with avatars  
  - Online/offline status indicators  

---

## 🛠 Tech Stack

- **Frontend**: React.js, Redux, Socket.io-client, CSS Modules  
- **Backend**: Node.js, Express.js, Socket.io, JWT, bcrypt  
- **Database**: MongoDB (Mongoose ODM)  
- **Deployment**: Docker, Kubernetes (optional), AWS / GCP  

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+  
- [MongoDB](https://www.mongodb.com/) v4+ (or MongoDB Atlas)  
- [Yarn](https://yarnpkg.com/) or npm  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/echochat.git
   cd echochat
2. **Install dependencies**
- 2.1 Backend dependencies
   ```bash
   cd backend
   npm install
- 2.2 Frontend dependencies
  ```bash
  cd frontend
  npm install

3. **Run the frontend and backend**
   ```bash
   npm run dev
4. **Click the link with CTRL+ Left Click to open the App**

