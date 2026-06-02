# Prompt Organizer 🎯

**An AI Workflow & Prompt Management Platform**

Discover, save, customize, and organize expert AI prompts. Built with React + Vite + Tailwind CSS.

## Features

✨ **18+ Built-in Prompt Templates**
- Research (3), Writing (4), AI (3), Productivity (3), Education (3), Psychology (2)
- Copy prompts with one click
- Customize and save your favorites

🔍 **Smart Search & Filtering**
- Search by title, tags, and content
- Filter by category
- Favorites-only view

📝 **Personal Prompt Library**
- Add your own custom prompts
- Delete prompts
- Star/favorite important prompts

💾 **Local Storage Persistence**
- All prompts automatically saved
- Syncs across browser sessions

📱 **Mobile-Responsive Design**
- Works seamlessly on desktop, tablet, and mobile
- Touch-friendly interface
- Optimized for all screen sizes

✨ **Smooth Animations**
- Fade-in on page load
- Staggered section animations
- Hover effects and transitions
- Toast notifications

## Tech Stack

- ⚛️ **React 19** - UI framework
- ⚡ **Vite** - Build tool & dev server
- 🎨 **Tailwind CSS** - Styling
- 💾 **LocalStorage** - Data persistence
- ✅ **ESLint** - Code quality

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5174` in your browser.

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Sticky navbar with search
│   ├── HeroSection.jsx         # Welcome & stats
│   ├── FeaturedSection.jsx     # Showcase templates
│   ├── CategoriesSection.jsx   # Filter buttons
│   ├── PromptCard.jsx          # Reusable card component
│   ├── Toast.jsx               # Notifications
│   └── Footer.jsx              # Footer with info
├── data/
│   └── prompts.js              # 18 built-in prompts
├── App.jsx                     # Main app component
├── App.css                     # Legacy styles
├── index.css                   # Animations & Tailwind
└── main.jsx                    # Entry point
```

## Prompt Categories

| Category | Count | Examples |
|----------|-------|----------|
| 📚 Research | 3 | Research Assistant, Literature Analyzer, Market Research |
| ✍️ Writing | 4 | LinkedIn Creator, Email Composer, Blog Post, Copy Editor |
| 🤖 AI | 3 | Prompt Improver, Chain of Thought, Code Reviewer |
| ⚡ Productivity | 3 | Workshop Planner, Weekly Planner, Meeting Minutes |
| 🎓 Education | 3 | Quiz Generator, Lesson Planner, Explainer |
| 🧠 Psychology | 2 | Therapy Reflection, Decision Helper |

## How to Use

1. **Browse Prompts** - See featured templates and all prompts in the main grid
2. **Search** - Use the search bar to find specific prompts
3. **Filter** - Click category buttons to filter by topic
4. **Copy** - Click "Copy" on any card to add it to clipboard
5. **Favorite** - Star prompts you use frequently
6. **Create** - Use the sidebar form to add your own prompts
7. **Delete** - Remove custom prompts (built-in prompts are protected)

## LocalStorage

All prompts are automatically saved to your browser's LocalStorage. Your library persists even after closing and reopening the browser.

## Future Enhancements

- 🔐 User authentication & cloud sync
- 📤 Export/import prompts as JSON
- 🎨 Light/dark theme toggle
- 🔖 Advanced tagging system
- 📊 Usage analytics
- 🌐 Share prompts via URL
- 🤖 ChatGPT API integration

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request!

---

**Built with ❤️ for prompt enthusiasts and AI users**
