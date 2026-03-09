# Jiji AI Learning Companion - Backend

A Node.js backend service for Jiji, an AI-powered learning companion that helps users discover educational resources based on their queries.

## Features

- **Smart Resource Search**: Query-based resource discovery using keyword extraction
- **Multiple Resource Types**: Support for videos, presentations, PDFs, articles, and quizzes
- **Query Logging**: Analytics-ready query tracking for continuous improvement
- **User Profiles**: Personalized learning preferences and history
- **Clean Architecture**: Well-organized codebase following best practices

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Project Structure

```
BACKEND/
├── config/
│   ├── index.js          # Application configuration
│   └── supabase.js       # Supabase client setup
├── controllers/
│   ├── index.js
│   └── jijiController.js # Main API controller
├── middleware/
│   ├── index.js
│   ├── errorHandler.js   # Global error handling
│   └── queryValidation.js # Request validation
├── routes/
│   ├── index.js
│   └── jijiRoutes.js     # API route definitions
├── services/
│   ├── index.js
│   ├── profileService.js  # User profile operations
│   ├── queryService.js    # Query logging & analytics
│   └── resourceService.js # Resource search & retrieval
├── utils/
│   ├── index.js
│   ├── queryHelper.js     # Query processing utilities
│   └── responseFormatter.js # Response formatting
├── sql/
│   ├── schema.sql         # Database schema
│   └── sample_data.sql    # Sample data for testing
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   cd BACKEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Set up the database**
   
   Run these SQL files in your Supabase SQL Editor:
   - First: `sql/schema.sql` (creates tables and indexes)
   - Then: `sql/sample_data.sql` (populates sample data)

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### POST /api/ask-jiji

Ask Jiji a question and get relevant learning resources.

**Request Body:**
```json
{
  "query": "How do I learn JavaScript?",
  "userId": "optional-uuid",
  "topic": "optional-topic"
}
```

**Response:**
```json
{
  "answer": "I found 3 video and ppt resources that can help you learn about this topic.",
  "resources": [
    {
      "title": "JavaScript Fundamentals - Complete Guide",
      "type": "video",
      "url": "https://example.com/videos/js-fundamentals"
    },
    {
      "title": "Advanced JavaScript Patterns",
      "type": "ppt",
      "url": "https://example.com/slides/js-patterns.pptx"
    }
  ]
}
```

### GET /api/resources

Get all resources with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by resource type (video, ppt, pdf, article, quiz)
- `topic` (optional): Filter by topic
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "title": "Resource Title",
      "description": "Description",
      "type": "video",
      "url": "https://...",
      "topic": "javascript",
      "tags": ["javascript", "basics"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/resources/:id

Get a single resource by ID.

### GET /api/queries/popular

Get popular queries for analytics.

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Jiji AI Learning Companion is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | User email (unique) |
| name | VARCHAR(255) | Display name |
| avatar_url | TEXT | Profile picture URL |
| preferences | JSONB | User preferences |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### resources
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(500) | Resource title |
| description | TEXT | Description |
| type | VARCHAR(50) | video, ppt, pdf, article, quiz |
| url | TEXT | Resource URL |
| topic | VARCHAR(255) | Topic category |
| tags | TEXT[] | Array of tags |
| duration_minutes | INTEGER | Duration (for videos) |
| difficulty | VARCHAR(50) | beginner, intermediate, advanced |
| author | VARCHAR(255) | Content author |
| view_count | INTEGER | View counter |
| created_at | TIMESTAMP | Creation timestamp |

### queries
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to profiles |
| query_text | TEXT | User's query |
| topic | VARCHAR(255) | Detected topic |
| resources_found | INTEGER | Number of results |
| created_at | TIMESTAMP | Query timestamp |

## Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Testing the API

Using curl:
```bash
# Health check
curl http://localhost:3000/api/health

# Ask Jiji
curl -X POST http://localhost:3000/api/ask-jiji \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I learn React hooks?"}'

# Get resources
curl http://localhost:3000/api/resources?type=video&limit=5
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| SUPABASE_URL | Yes | Your Supabase project URL |
| SUPABASE_ANON_KEY | Yes | Supabase anonymous key |
| SUPABASE_SERVICE_ROLE_KEY | No | Supabase service role key (for admin ops) |
| PORT | No | Server port (default: 3000) |
| NODE_ENV | No | Environment (development/production) |
| ALLOWED_ORIGINS | No | Comma-separated CORS origins |

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "query",
      "message": "Query is required"
    }
  ]
}
```

## Security

- **Helmet**: HTTP headers security
- **CORS**: Configurable origin whitelist
- **Input Validation**: express-validator for request validation
- **Row Level Security**: Supabase RLS policies for data access control

## License

MIT
