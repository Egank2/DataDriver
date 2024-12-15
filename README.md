# Data Driver


**Data Driver** is a platform designed to streamline the literature review process. It allows users to paste URLs, fetch and process literature data from those sources, and interact with a chat interface powered by an LLM. The platform will provide sourced answers, annotations, and summaries to enhance your literature review workflow.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [File Structure](#file-structure)


## Features

- **URL-based Content Processing**: Paste URLs and retrieve context directly from webpages.
- **Chat Interface**: Interact with an LLM to summarize, compare, and contrast data from provided URLs.
- **Cited Answers**: Each answer includes citations back to the sourced URLs.
- **Rate Limiting**: Middleware ensures fair usage by limiting requests per user/session.
- **Caching with Redis**: Frequently requested responses are cached to improve performance.

## Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** for dependency management
- **Redis** (for caching and rate limiting)
- A `.env` file for environment variables (see [Configuration](#configuration))

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone <Repository URL>
```

Navigate to the project directory:

```bash
cd ai-answer-engine
```

Then, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/data-driver.git
   cd data-driver
   ```
2. Install Dependancies
   ```bash
   npm install
   ```
3. Environment Variables
   ```bash
   REDIS_URL=<your_redis_instance_url>
   groq_API_KEY=<your_api_key>
   ```

4. Run the Development server
   ```bash
   npm run dev
   ```
   This app will be available at http://localhost:3000

## File Structure
```bash
.
├── src
│   ├── app
│   │   ├── api
│   │   │   └── chat
│   │   │       └── route.ts      # Chat API implementation
│   │   ├── page.tsx              # Main UI component
│   │   └── middleware.ts         # Rate limiting logic
│   └── utils
│       ├── scraper.ts            # Web scraping logic
│       ├── cache.ts              # Redis caching helper
├── public                        # Static assets
├── .env                          # Environment variables (not committed)
└── README.md                     # This documentation

```
