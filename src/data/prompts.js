const prompts = [
  // Research Category
  {
    id: 1,
    title: 'Research Assistant',
    category: 'Research',
    tags: ['papers', 'academics', 'summary'],
    prompt: 'Find peer-reviewed papers on the topic and summarize the key findings, methods, and open questions.',
    favorite: false,
    builtIn: true
  },
  {
    id: 2,
    title: 'Literature Analyzer',
    category: 'Research',
    tags: ['papers', 'critique', 'analysis'],
    prompt: 'Analyze this academic paper: identify the thesis, methodology, key arguments, strengths, and limitations.',
    favorite: false,
    builtIn: true
  },
  {
    id: 3,
    title: 'Market Research',
    category: 'Research',
    tags: ['market', 'trends', 'analysis'],
    prompt: 'Research current market trends for [industry] and identify key competitors, growth opportunities, and emerging challenges.',
    favorite: false,
    builtIn: true
  },

  // Writing Category
  {
    id: 4,
    title: 'LinkedIn Creator',
    category: 'Writing',
    tags: ['linkedin', 'social', 'professional'],
    prompt: 'Rewrite the following idea as a LinkedIn post that is engaging, concise, and ends with a call-to-action.',
    favorite: false,
    builtIn: true
  },
  {
    id: 5,
    title: 'Email Composer',
    category: 'Writing',
    tags: ['email', 'business', 'communication'],
    prompt: 'Write a professional email based on this summary: [summary]. Keep it under 150 words, clear, and with a specific CTA.',
    favorite: false,
    builtIn: true
  },
  {
    id: 6,
    title: 'Blog Post Generator',
    category: 'Writing',
    tags: ['blog', 'content', 'seo'],
    prompt: 'Write an engaging blog post outline for the topic [topic]. Include introduction, 5 main sections, and conclusion with SEO keywords.',
    favorite: false,
    builtIn: true
  },
  {
    id: 7,
    title: 'Copy Editor',
    category: 'Writing',
    tags: ['editing', 'grammar', 'clarity'],
    prompt: 'Edit this text for clarity, grammar, tone, and impact. Suggest improvements and explain your changes.',
    favorite: false,
    builtIn: true
  },

  // AI Category
  {
    id: 8,
    title: 'Prompt Improver',
    category: 'AI',
    tags: ['improve', 'rewrite', 'optimization'],
    prompt: 'Improve this prompt to be more specific, add constraints, and suggest example outputs for better results.',
    favorite: false,
    builtIn: true
  },
  {
    id: 9,
    title: 'Chain of Thought',
    category: 'AI',
    tags: ['reasoning', 'logic', 'step-by-step'],
    prompt: 'Break down this complex problem into step-by-step reasoning. Show your work and explain each decision.',
    favorite: false,
    builtIn: true
  },
  {
    id: 10,
    title: 'Code Reviewer',
    category: 'AI',
    tags: ['code', 'review', 'development'],
    prompt: 'Review this code for bugs, performance issues, security vulnerabilities, and best practices. Suggest improvements.',
    favorite: false,
    builtIn: true
  },

  // Productivity Category
  {
    id: 11,
    title: 'Workshop Planner',
    category: 'Productivity',
    tags: ['workshop', 'planning', 'organization'],
    prompt: 'Create a workshop agenda for [topic] with timeboxed activities, learning objectives, and materials for each session.',
    favorite: false,
    builtIn: true
  },
  {
    id: 12,
    title: 'Weekly Planner',
    category: 'Productivity',
    tags: ['planning', 'goals', 'priorities'],
    prompt: 'Help me plan my week. Prioritize my goals, suggest a daily schedule, and identify potential roadblocks.',
    favorite: false,
    builtIn: true
  },
  {
    id: 13,
    title: 'Meeting Minutes',
    category: 'Productivity',
    tags: ['meetings', 'notes', 'summary'],
    prompt: 'Convert these meeting notes into a clear summary with key decisions, action items, owners, and deadlines.',
    favorite: false,
    builtIn: true
  },

  // Education Category
  {
    id: 14,
    title: 'Quiz Generator',
    category: 'Education',
    tags: ['education', 'quiz', 'assessment'],
    prompt: 'Create a 10-question quiz about [topic] with multiple-choice options and an answer key with explanations.',
    favorite: false,
    builtIn: true
  },
  {
    id: 15,
    title: 'Lesson Planner',
    category: 'Education',
    tags: ['education', 'teaching', 'curriculum'],
    prompt: 'Design a lesson plan for teaching [topic]. Include objectives, activities, assessments, and homework.',
    favorite: false,
    builtIn: true
  },
  {
    id: 16,
    title: 'Explainer',
    category: 'Education',
    tags: ['education', 'explanation', 'simple'],
    prompt: 'Explain [concept] like I\'m a 10-year-old. Use simple words, examples, and analogies.',
    favorite: false,
    builtIn: true
  },

  // Psychology Category
  {
    id: 17,
    title: 'Therapy Reflection',
    category: 'Psychology',
    tags: ['psychology', 'reflection', 'wellness'],
    prompt: 'Help me reflect on this situation: [situation]. What patterns do I notice? What could I learn?',
    favorite: false,
    builtIn: true
  },
  {
    id: 18,
    title: 'Decision Helper',
    category: 'Psychology',
    tags: ['decision', 'pros-cons', 'clarity'],
    prompt: 'Help me decide between these options: [options]. List pros and cons for each, then suggest what might be best.',
    favorite: false,
    builtIn: true
  }
]

export default prompts
