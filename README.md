

# 🛒 MyEcommerce – E-commerce Website

Welcome to **MyEcommerce**, a modern and fully responsive e-commerce website built with **React**, **Vite**, **Firebase**, **CSS**, and **React Router**. This project demonstrates core e-commerce features including user authentication, product browsing, shopping cart functionality, and clean navigation.

> 🔗 **Live Demo:** [https://my-ecommerce-nine-iota.vercel.app/](https://my-ecommerce-nine-iota.vercel.app/)

---

## 🚀 Features

- ⚡ Fast performance with **React + Vite**
- 🎨 Beautiful, responsive design with **plain CSS**
- 🔐 **User Authentication** via **Firebase**
- ☁️ **Cloud Firestore** database integration
- 🧭 **React Router** for smooth page transitions
- 🛍️ Shopping cart functionality
- 🔎 View individual product details
- 📂 Categories like Electronics, Fashion, Groceries
- 📱 Mobile-first and fully responsive layout
- 📧 Newsletter subscription form
- 🌐 Deployed on **Vercel**

---

## 🧰 Tech Stack

| Tech           | Purpose                                |
|----------------|----------------------------------------|
| **React**      | UI building with reusable components   |
| **Vite**       | Lightning-fast development environment |
| **Firebase**   | Auth + Firestore database              |
| **CSS**        | Styling across all components          |
| **React Router** | Page routing and dynamic URLs       |
| **Vercel**     | Deployment and hosting                 |

---

## 📁 Folder Structure

```
src/
├── assets/         # Images and static files
├── components/     # Reusable components (Navbar, Footer, etc.)
├── pages/          # Main pages (Home, Shop, Contact, etc.)
├── routes/         # Routing logic
├── firebase/       # Firebase config and services
├── App.jsx         # Root component
├── main.jsx        # Entry point
└── styles/         # CSS files
```

---

## 🧪 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/myecommerce.git
cd myecommerce
```

2. **Install dependencies**

```bash
npm install
```

3. **Firebase Setup**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a project and enable:
  - Authentication (Email/Password)
  - Firestore Database
- Replace Firebase config inside `firebase/firebaseConfig.js` or similar:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "XXXXXX"
};
```

4. **Run the project locally**

```bash
npm run dev
```

Visit `http://localhost:5173` to view it in your browser.

---

## 📷 Screenshots

_Add screenshots of the homepage, shop, product details, and cart here (optional)._

---

## ✨ Credits

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [React Router](https://reactrouter.com/)
- [Vercel](https://vercel.com/)

---

## 📫 Contact

**Okan Perpetual Isi**  
📧 perpetualokan0@gmail.com  
📍 Lagos, Nigeria

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
