<div align="center">
  <h1>Personal Portfolio Website</h1>
  <p>A modern, responsive portfolio website built with Next.js and TypeScript</p>
</div>

## 🚀 Features

- **Modern Stack**: Built with [Next.js](https://nextjs.org) and TypeScript
- **Fully Responsive**: Works seamlessly on all devices and screen sizes
- **Dark Mode**: Beautiful dark theme with particle effects
- **Dynamic Content**: Easy content management through configuration files
- **Project Showcase**: Integrated GitHub projects section
- **File Explorer**: Browse and view project files with syntax highlighting
- **Markdown Support**: Rich content rendering with math and code highlighting
- **SEO Optimized**: Built-in meta tag generation and optimization

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Code highlighting

## 🚦 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure your website**
Edit the configuration files in the `configs` directory:
- `main.ts` - Main configuration (name, email, etc.)
- `skills.ts` - Your technical skills
- `socials.ts` - Social media links
- `links.ts` - Additional external links

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see your website.

## 📁 Project Structure

```
├── app/                # Next.js app directory
├── components/         # React components
├── configs/           # Configuration files
├── content/           # Markdown content
├── interfaces/        # TypeScript interfaces
├── lib/              # Utility functions
└── public/           # Static assets
```

## ⚙️ Configuration

The website is highly configurable through the `configs` directory:

```typescript
// configs/main.ts
export const config: IConfig = {
  name: 'Your Name',
  email: 'your@email.com',
  location: 'Your Location',
  // ... other configurations
}
```

## 📝 Content Management

Add your content in the `content` directory:
- `pages/` - Static pages (About, Contact, etc.)
- `posts/` - Blog posts (if enabled)
- `projects/` - Project descriptions

## 🎨 Customization

1. **Styling**: Modify the Tailwind configuration in `tailwind.config.js`
2. **Components**: Customize components in the `components` directory
3. **Layout**: Adjust the layout in `components/Layout.tsx`


> [!IMPORTANT]  
> While you're free to use this project for your personal website, please maintain the attribution in the footer. You can modify the text but must keep the link to the original repository.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
