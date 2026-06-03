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
    prompt: "Explain [concept] like I'm a 10-year-old. Use simple words, examples, and analogies.",
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
  },

  // Creative Category
  {
    id: 19,
    title: 'Cinematic Scene',
    category: 'Creative',
    tags: ['image', 'cinematic', 'scene'],
    prompt: 'A cinematic ultra-realistic shot of [subject] in [environment] during [time of day]. Lighting: [mood lighting]. Camera: [wide angle / close-up]. Color palette: [warm/cool/neutral]. Mood: [emotional tone]. Ultra detailed, 4K, film grain, professional cinematography.',
    favorite: false,
    builtIn: true
  },
  {
    id: 20,
    title: 'Portrait Generator',
    category: 'Creative',
    tags: ['image', 'portrait', 'character'],
    prompt: 'A photorealistic portrait of [character description]. Expression: [emotion]. Lighting: [soft studio / golden hour / dramatic]. Background: [simple / environmental]. Style: [hyperrealistic / painterly]. Ultra detailed, sharp focus, professional photography.',
    favorite: false,
    builtIn: true
  },
  {
    id: 21,
    title: 'Environment Design',
    category: 'Creative',
    tags: ['image', 'environment', 'worldbuilding'],
    prompt: 'A breathtaking environment concept of [location]. Time of day: [morning/sunset/night]. Weather: [clear/foggy/rainy/stormy]. Atmosphere: [cozy/epic/mysterious/peaceful]. Include [specific details]. Ultra wide shot, cinematic depth of field, 4K render.',
    favorite: false,
    builtIn: true
  },
  {
    id: 22,
    title: 'Product Visualizer',
    category: 'Creative',
    tags: ['image', 'product', 'commercial'],
    prompt: 'A luxury commercial-style image of [product] on [surface/background]. Lighting: [soft studio lighting with subtle shadows]. Color palette: [brand colors]. Style: [minimal / editorial / lifestyle]. Ultra sharp, professional product photography, 4K.',
    favorite: false,
    builtIn: true
  },
  {
    id: 23,
    title: 'Mood Board Generator',
    category: 'Creative',
    tags: ['image', 'mood', 'aesthetic'],
    prompt: 'Create a cohesive mood board aesthetic for [project/brand/concept]. Visual style: [minimalist / maximalist / vintage / futuristic]. Color palette: [specific colors]. Textures: [materials and surfaces]. Emotional feel: [calm / energetic / luxurious / raw].',
    favorite: false,
    builtIn: true
  },
  {
    id: 24,
    title: 'Character Design',
    category: 'Creative',
    tags: ['image', 'character', 'design'],
    prompt: 'Design a detailed character: [name and role]. Physical appearance: [features, build, age]. Outfit: [style and details]. Expression: [personality trait shown]. Art style: [realistic / anime / illustrated]. Background: [simple / thematic]. Full body reference sheet quality.',
    favorite: false,
    builtIn: true
  },
  {
    id: 25,
    title: 'Abstract Art Prompt',
    category: 'Creative',
    tags: ['image', 'abstract', 'art'],
    prompt: 'Generate an abstract artwork representing [concept or emotion]. Style: [geometric / fluid / textured / mixed media]. Color palette: [specific colors]. Composition: [centered / chaotic / layered]. Medium feel: [oil paint / watercolor / digital / photography]. High resolution, gallery quality.',
    favorite: false,
    builtIn: true
  },
  {
    id: 26,
    title: 'Architecture Visualizer',
    category: 'Creative',
    tags: ['image', 'architecture', 'design'],
    prompt: 'A photorealistic architectural render of [building type] with [design style: modern/brutalist/organic/minimalist]. Materials: [concrete/glass/wood/stone]. Time of day: [golden hour/overcast/night]. Surrounding environment: [urban/nature/coastal]. Cinematic composition, 4K architectural photography.',
    favorite: false,
    builtIn: true
  },

  // Health & Fitness Category
  {
    id: 27,
    title: 'Workout Planner',
    category: 'Health & Fitness',
    tags: ['workout', 'fitness', 'exercise'],
    prompt: 'Create a [duration]-week workout plan for [goal: muscle gain/fat loss/endurance]. Available equipment: [equipment]. Days per week: [number]. Include sets, reps, rest times, and progression tips.',
    favorite: false,
    builtIn: true
  },
  {
    id: 28,
    title: 'Meal Plan Generator',
    category: 'Health & Fitness',
    tags: ['nutrition', 'diet', 'meal prep'],
    prompt: 'Create a 7-day meal plan for [goal: weight loss/muscle gain/maintenance]. Daily calories: [number]. Dietary restrictions: [restrictions]. Include breakfast, lunch, dinner, snacks, and macros for each day.',
    favorite: false,
    builtIn: true
  },
  {
    id: 29,
    title: 'Habit Builder',
    category: 'Health & Fitness',
    tags: ['habits', 'routine', 'consistency'],
    prompt: 'Help me build a daily habit of [habit]. Current situation: [where I am now]. Goal: [desired outcome]. Create a 30-day progressive plan with small daily actions, accountability checkpoints, and tips to avoid relapse.',
    favorite: false,
    builtIn: true
  },
  {
    id: 30,
    title: 'Exercise Explainer',
    category: 'Health & Fitness',
    tags: ['exercise', 'form', 'technique'],
    prompt: 'Explain how to properly perform [exercise]. Include: correct form, muscles targeted, common mistakes, breathing pattern, beginner modifications, and advanced variations.',
    favorite: false,
    builtIn: true
  },
  {
    id: 31,
    title: 'Recovery Planner',
    category: 'Health & Fitness',
    tags: ['recovery', 'rest', 'wellness'],
    prompt: 'Design a recovery routine for someone who does [type of training] [frequency] times per week. Include sleep optimization, stretching, nutrition timing, active recovery days, and signs of overtraining to watch for.',
    favorite: false,
    builtIn: true
  },

  // Tech & Coding Category
  {
    id: 32,
    title: 'Bug Debugger',
    category: 'Tech & Coding',
    tags: ['debugging', 'fix', 'error'],
    prompt: 'I have this bug in my [language] code: [error message]. Here is the relevant code: [code]. Identify the root cause, explain why it happens, and provide a fixed version with comments.',
    favorite: false,
    builtIn: true
  },
  {
    id: 33,
    title: 'Code Generator',
    category: 'Tech & Coding',
    tags: ['code', 'generate', 'build'],
    prompt: 'Write a [language] function that [description of what it should do]. Requirements: [list requirements]. Include error handling, comments, and an example usage. Keep it clean and production-ready.',
    favorite: false,
    builtIn: true
  },
  {
    id: 34,
    title: 'Architecture Planner',
    category: 'Tech & Coding',
    tags: ['architecture', 'system design', 'planning'],
    prompt: 'Design the system architecture for [project description]. Scale: [expected users/load]. Tech stack preferences: [stack]. Include: component breakdown, database design, API structure, scalability considerations, and potential bottlenecks.',
    favorite: false,
    builtIn: true
  },
  {
    id: 35,
    title: 'Code Explainer',
    category: 'Tech & Coding',
    tags: ['explain', 'understand', 'learning'],
    prompt: 'Explain this code to me like I am a beginner: [paste code]. Break down what each section does, why it was written this way, and what I should learn from it.',
    favorite: false,
    builtIn: true
  },
  {
    id: 36,
    title: 'Tech Stack Advisor',
    category: 'Tech & Coding',
    tags: ['tech stack', 'tools', 'decision'],
    prompt: 'I am building [project description]. My team size is [size] and budget is [budget]. Recommend the best tech stack with reasons for each choice, tradeoffs, learning curve, and estimated setup time.',
    favorite: false,
    builtIn: true
  },

  // Social Media Category
  {
    id: 37,
    title: 'Instagram Caption',
    category: 'Social Media',
    tags: ['instagram', 'caption', 'engagement'],
    prompt: 'Write 5 Instagram caption options for a photo of [description]. Tone: [funny/inspirational/professional/casual]. Include relevant hashtags, an emoji mix, and a call to action. Make each caption a different style.',
    favorite: false,
    builtIn: true
  },
  {
    id: 38,
    title: 'Viral Hook Writer',
    category: 'Social Media',
    tags: ['viral', 'hook', 'attention'],
    prompt: 'Write 10 viral hook options for a post about [topic]. Platform: [Instagram/Twitter/LinkedIn/TikTok]. Each hook should stop the scroll in the first 3 words. Include curiosity hooks, controversy hooks, and value hooks.',
    favorite: false,
    builtIn: true
  },
  {
    id: 39,
    title: 'Content Calendar',
    category: 'Social Media',
    tags: ['content', 'planning', 'strategy'],
    prompt: 'Create a 30-day social media content calendar for [brand/personal account] in the [niche] space. Platform: [platform]. Include post type, topic, caption angle, and best posting time for each day.',
    favorite: false,
    builtIn: true
  },
  {
    id: 40,
    title: 'Growth Strategy',
    category: 'Social Media',
    tags: ['growth', 'followers', 'strategy'],
    prompt: 'Build a 90-day organic growth strategy for my [platform] account in the [niche] niche. Current followers: [number]. Goal: [target]. Include content pillars, posting frequency, engagement tactics, and collaboration ideas.',
    favorite: false,
    builtIn: true
  },
  {
    id: 41,
    title: 'Bio Writer',
    category: 'Social Media',
    tags: ['bio', 'profile', 'branding'],
    prompt: 'Write 3 versions of a social media bio for [platform] for someone who is [description of person/brand]. Each version should be a different tone: professional, casual, and creative. Keep each under 150 characters.',
    favorite: false,
    builtIn: true
  }
]

export default prompts
