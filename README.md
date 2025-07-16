# Gemini Frontend Clone – Kuvaka Tech

A Gemini-style conversational AI frontend built as part of Kuvaka Tech’s Frontend Developer Assignment. This responsive web app simulates OTP login, chatroom management, and AI-powered messaging with a polished UX.

🔗 **Live Demo:** [https://your-live-link.com](https://your-live-link.com)  

---

## ✨ Key Features

- 🔐 **OTP Login/Signup**  
  → Select country code (fetched from [restcountries.com])  
  → **OTP appears in the browser console** (simulated via `setTimeout`)  

- 💬 **Chatroom Interface**  
  → AI responses with throttling + typing effect  
  → Infinite scroll & message pagination  
  → Image upload with base64 preview  
  → Copy-to-clipboard, timestamps, auto-scroll

- 📋 **Dashboard**  
  → Create/Delete chatrooms with toast feedback  
  → Debounced search to filter chatrooms

- 🌗 **Global UX**  
  → Dark mode toggle  
  → Mobile responsive design  
  → Loading skeletons  
  → LocalStorage for auth & chat data  

---

## 🛠 Tech Stack

- **Next.js 15 (App Router)**
- **Tailwind CSS**
- **Zustand** – State Management
- **React Hook Form + Zod** – Form Validation
- **Vercel** – Deployment

---

## 📁 Folder Structure
/app → Routes (login, dashboard, chatroom)
/components → UI & logic components
/lib → Zustand store, hooks, utils, validation
/public, styles → Assets & global styles

yaml
Copy
Edit

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/yourusername/gemini-frontend-kuvaka.git
cd gemini-frontend-kuvaka
npm install
npm run dev

