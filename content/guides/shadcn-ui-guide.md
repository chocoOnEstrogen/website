---
title: Building Modern Web Applications with Shadcn UI and React
description: A comprehensive guide to creating beautiful, accessible web applications using Shadcn UI components
category: Web Development
date: 2024-11-06
featured: true
order: 1
toc: true
---

# Building with Shadcn UI

Shadcn UI provides a collection of beautifully designed, accessible components that you can copy and paste into your applications. Let's explore how to set up and use this powerful UI library.

## Initial Setup

First, let's create a new Next.js project and set up Shadcn UI:

```bash
# Create a new Next.js project
npx create-next-app@latest my-app --typescript --tailwind --eslint

# Navigate to your project
cd my-app

# Initialize Shadcn UI
npx shadcn-ui@latest init
```

## Configuring Shadcn UI

When running the init command, you'll be asked a few questions. Here are the recommended settings:

```bash
Which style would you like to use? › New York
Which color would you like to use as base color? › Zinc
Do you want to use CSS variables for colors? › yes
```

## Adding Components

Shadcn UI components can be added individually as needed:

```bash
# Add some commonly used components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

## Building a Sample Component

Here's how to create a login form using Shadcn UI components:

```tsx
// File: components/login-form.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function LoginForm() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button className="w-full">Sign In</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

```tsx
// File: app/page.tsx
import { LoginForm } from "@/components/login-form"

export default function Home() {
  return <LoginForm />
}
```

## Theming and Customization

Shadcn UI uses Tailwind CSS for styling. You can customize the theme in your `tailwind.config.js`:

```typescript
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
}
```

## Additional Resources

- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Shadcn UI GitHub Repository](https://github.com/shadcn/ui)
- [Tailwind CSS Documentation](https://tailwindcss.com)