# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VK Mini App (ВКонтакте mini-application) for creating and managing resumes with AI enhancement capabilities. It's built using React with VKUI components and integrates with Supabase for data persistence and OpenRouter for AI text enhancement.

## Development Commands

- `yarn start` - Start development server (runs on localhost:5173)
- `yarn build` - Build for production (outputs to `build/` directory)  
- `yarn lint` - Run ESLint for code quality checks
- `yarn preview` - Preview the production build locally
- `yarn tunnel` - Create public tunnel for VK Mini App testing via vk-tunnel
- `yarn deploy` - Build and deploy to VK hosting (requires app_id in vk-hosting-config.json)

## Architecture

### Core Structure
- **Entry Point**: `src/main.js` - Initializes VK Bridge and renders AppConfig
- **App Configuration**: `src/AppConfig.js` - Sets up VK Bridge providers, theming, and router
- **Main App**: `src/App.js` - Contains the main View with panel routing
- **Routing**: `src/routes.js` - Defines panels (Home, Persik, Resume) with hash-based routing

### Key Panels
- **Home** (`src/panels/Home.js`) - Resume list management, create/delete functionality
- **Resume** (`src/panels/Resume.js`) - Resume editor with form sections and preview
- **Persik** (`src/panels/Persik.js`) - Demo panel from VK template

### Data Architecture
- **Supabase Integration** (`src/utils/supabase.js`) - Database operations for resume CRUD
  - Uses environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Database table: `resumes` with columns: id, user_id, name, data, created_at, updated_at
- **Resume Data Structure**: Complex nested object stored as JSON in database
  - Contains sections: personalInfo, experience, education, skills, customSections

### Resume Components Structure
Located in `src/components/Resume/`:
- `ResumeEditor.js` - Main form with tabs for different sections
- `ResumePreview.js` - Live preview with multiple template support
- `ResumeTemplates.js` - Template selection and styling
- Form components: `ExperienceForm.js`, `EducationForm.js`, `CustomSectionForm.js`

### AI Enhancement Feature
- **AI Integration** (`src/utils/aiEnhancement.js`) - OpenRouter API integration
  - Uses DeepSeek free model for text enhancement
  - Environment variables: `VITE_OPENROUTER_API_URL`, `VITE_OPENROUTER_API_KEY`
- **Components** (`src/components/AIEnhancement/`) - Modal and button components for AI features

### VK Mini App Specifics
- Uses VK Bridge for platform integration (user info, appearance, adaptivity)
- VK UI components throughout the app
- Hash-based routing compatible with VK platform
- Mobile-first responsive design
- VK hosting configuration in `vk-hosting-config.json`

## Environment Setup

Required environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

## Build Configuration

- **Vite Configuration** (`vite.config.js`):
  - Custom JSX handling for .js files
  - VK Icons module directive handling  
  - Legacy browser support
  - Build output to `build/` directory for VK hosting

## Development Notes

- All .js files in src/ are treated as JSX by Vite configuration
- Uses VK Bridge React hooks for platform integration
- Resume data is stored as complex nested objects in Supabase
- PDF generation uses jsPDF and html2canvas libraries
- Mobile debugging available via Eruda (commented out in main.js)