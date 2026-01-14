# DokuGaku (独学) - Japanese Learning App

A modern, database-free Japanese learning application built for Vercel.

## 🚀 Features

- **Zero Database**: Content is statically optimized. User progress is saved locally on the device.
- **Vercel Optimized**: Built with Next.js App Router for instant page loads.
- **Interactive**: Quizzes and lessons with animations powered by Framer Motion.
- **Integrated Courses**: Expertly structured N5-N3 curriculum with thematic units.
- **Beautiful UI**: Modern dark mode aesthetic.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Deployment (Vercel)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # git remote add origin <your-repo-url>
   # git push -u origin main
   ```

2. **Import in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New...** > **Project**
   - Select your GitHub repository
   - Click **Deploy** (No environment variables needed!)

## 📝 Customization

- **Add Lessons**: Edit `data/content.ts` to add more vocabulary or quizzes.
- **Theme**: Modify `app/globals.css` to change colors.
