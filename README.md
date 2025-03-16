# Grien 🥗 - Recipe Sharing & Cooking

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-396ECC?style=for-the-badge)](https://orm.drizzle.team/)
[![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-111111?style=for-the-badge)](https://ui.shadcn.com/)

Grien is a modern recipe-sharing platform that helps home cooks organize their culinary creations, collaborate with others, and streamline their cooking process.

## ✨ Features

### 🧑🍳 Core Functionality

- **User Accounts** - Secure authentication and personalized profiles
- **Social Features** - Follow other users and discover new recipes
- **Cookbook Management** - Create and organize custom recipe collections
- **Drag & Drop Editor** - Intuitive recipe creation with dnd-kit

### 🚀 Smart Cooking Tools

- **Cooking Mode** - Auto-detects timers in instructions (e.g., "simmer for 15 mins") and creates automatic reminders
- **Portion Calculator** - Dynamically adjusts ingredient quantities based on serving size
- **Media Uploads** - Store recipe images in R2 object storage

## 🛠️ Tech Stack

| Category         | Technologies             |
| ---------------- | ------------------------ |
| Framework        | Next.js (App Router)     |
| Styling          | shadcn/ui + Tailwind CSS |
| State Management | TanStack Query           |
| Database         | Drizzle ORM + PostgreSQL |
| Validation       | Zod                      |
| Storage          | Cloudflare R2            |
| Icons            | Lucide                   |

## 🚀 Getting Started

1. **Clone Repository**

   ```bash
   git clone https://github.com/your-username/grien.git
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Environment Setup**

   Create **.env** file using **.env.example** template

4. **Run Development Server**

   ```bash
   bun run dev
   ```

# Configuration ⚙️

Required environment variables:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

R2_ENDPOINT_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
NEXT_PUBLIC_R2_PUBLIC_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

EMAIL_USER=
EMAIL_PASS=
```

# Contributing 🤝

We welcome contributions! Please follow these steps:

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

# License 📄

Distributed under the MIT License.
