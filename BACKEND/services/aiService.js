import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq (FREE AI API)
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are Jiji, a friendly and helpful AI learning companion. 
You help students learn programming and technology concepts.
Keep your answers concise (2-3 paragraphs max), clear, and beginner-friendly.
Use simple examples when explaining concepts.
Be encouraging and supportive.
If the user greets you, respond warmly and ask what they'd like to learn.`;

/**
 * AI Service - Generates intelligent responses using Groq
 */
class AIService {
  /**
   * Generate an answer for the user's query
   * @param {string} query - User's question
   * @param {Array} resources - Related resources found
   * @returns {Promise<string>} AI-generated answer
   */
  async generateAnswer(query, resources = []) {
    const resourceContext = resources.length > 0
      ? `\n\nNote: I found these related learning resources: ${resources.map(r => r.title).join(', ')}`
      : '';

    // Try Groq API
    if (groq) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `${query}${resourceContext}` }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });
        
        const response = completion.choices[0]?.message?.content;
        if (response) return response;
      } catch (error) {
        console.warn('Groq API error:', error.message);
      }
    }

    // Fallback to built-in responses
    return this.generateFallbackAnswer(query, resources);
  }

  /**
   * Fallback answer when AI API is not available
   */
  generateFallbackAnswer(query, resources = []) {
    const queryLower = query.toLowerCase();

    // Topic-based responses
    const topicResponses = {
      javascript: `JavaScript is a versatile programming language used for web development. It allows you to create interactive websites, build server-side applications with Node.js, and much more. Key concepts include variables, functions, objects, and the DOM.`,
      
      closure: `A closure in JavaScript is a function that has access to variables from its outer scope, even after the outer function has returned. It's like a function carrying a "backpack" of variables. Closures are powerful for creating private variables.`,
      
      react: `React is a popular JavaScript library for building user interfaces. It uses a component-based architecture where you build reusable UI pieces. Key concepts include JSX, components, props, state, and hooks.`,
      
      hooks: `React Hooks let you use state and other React features in functional components. Common hooks: useState (state), useEffect (side effects), useContext (shared data). They make code cleaner and more reusable.`,
      
      python: `Python is a beginner-friendly programming language known for its clean syntax. It's used in data science, AI, web development, and automation. Key features include easy-to-read code and extensive libraries.`,
      
      sql: `SQL (Structured Query Language) communicates with databases. Key commands: SELECT (read), INSERT (add), UPDATE (modify), DELETE (remove). It's essential for working with relational databases.`,
      
      api: `An API (Application Programming Interface) allows different applications to communicate. REST APIs use HTTP methods like GET, POST, PUT, DELETE. They're the backbone of modern web applications.`,
      
      nodejs: `Node.js runs JavaScript on the server. It's great for APIs, real-time apps, and microservices. Express.js is a popular framework that makes building Node.js servers easier.`,

      html: `HTML (HyperText Markup Language) creates web page structure using tags like <div>, <p>, <h1>. HTML5 added <video>, <audio>, and semantic tags like <header> and <footer>.`,

      css: `CSS (Cascading Style Sheets) styles HTML elements - colors, fonts, layouts. Modern CSS includes Flexbox and Grid for powerful layouts, and CSS variables for reusable values.`,

      git: `Git tracks code changes and enables collaboration. Key commands: git add, git commit, git push, git pull. It helps manage different versions of your project.`,

      typescript: `TypeScript adds static typing to JavaScript. It catches errors early and improves code documentation. You define types for variables and functions, then it compiles to JavaScript.`,

      async: `Async/await makes asynchronous JavaScript easier. Use async before a function and await before promises. It's cleaner than callbacks for handling API calls and other async operations.`,

      array: `Arrays store multiple values in one variable. In JavaScript, use methods like push(), pop(), map(), filter(), and reduce() to manipulate arrays. Essential for handling data lists.`,

      function: `Functions are reusable code blocks that perform specific tasks. They can take parameters and return values. In JavaScript, create them using declarations, expressions, or arrow functions.`,

      database: `Databases store and organize data. SQL databases (PostgreSQL, MySQL) use tables. NoSQL databases (MongoDB) use flexible documents. Choose based on your data structure needs.`,
    };

    // Find matching topic
    for (const [topic, response] of Object.entries(topicResponses)) {
      if (queryLower.includes(topic)) {
        const resourceNote = resources.length > 0 
          ? `\n\nI found ${resources.length} resource${resources.length > 1 ? 's' : ''} that might help you learn more!`
          : '';
        return response + resourceNote;
      }
    }

    // Greeting responses
    if (queryLower.match(/^(hi|hello|hey|hola|namaste)/)) {
      return `Hello! 👋 I'm Jiji, your AI learning companion. I can help you learn about programming topics like JavaScript, React, Python, Node.js, SQL, and more. What would you like to learn today?`;
    }

    if (queryLower.includes('thank')) {
      return `You're welcome! 😊 Feel free to ask me anything else about programming. I'm here to help you learn!`;
    }

    // Default response
    if (resources.length > 0) {
      return `Great question! I found ${resources.length} resource${resources.length > 1 ? 's' : ''} that can help you learn about "${query}". Check out the materials below!`;
    }

    return `That's a great question about "${query}"! Try asking about specific topics like JavaScript, React, Python, Node.js, SQL, CSS, HTML, or Git for detailed explanations!`;
  }
}

export default new AIService();