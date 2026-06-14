# Getting started

## Prerequisites

- Node.js 18+
- npm or yarn
- Airtable account (optional, mock data works without it)

## Installation

```bash
git clone https://github.com/R4FKEN/indiefast.git
cd indiefast
npm install
```

## Environment variables

Create a `.env` file in the project root:

```
AIRTABLE_PAT=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
```

Without Airtable credentials, the app serves mock data.

## Running locally

**Frontend only:**
```bash
npm run dev
```

**Frontend + Express server:**
```bash
npm run server  # In one terminal
npm run dev     # In another terminal
```

## Building for production

```bash
npm run build
npm run preview  # Test production build
```

## Deploying to Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

## Linting

```bash
npm run lint
```
