# Synapse

Synapse is a web app for medical students preparing for the USMLE, PLAB, and FCPS exams. It combines exam practice, AI-supported diagnosis exercises, progress tracking, learning resources, and a community forum in one authenticated workspace.

[Open the live demo](https://synapse-umber.vercel.app)

> Synapse is an educational project. Its simulated patient responses and diagnosis results are not medical advice and must not be used for patient care.

## What the app includes

- Email/password and Google sign-in with profile onboarding
- Practice quizzes with up to 10 questions for USMLE, PLAB, and FCPS question banks
- AI patient simulations powered by Groq, with up to five questions per diagnosis session
- A dashboard for quiz scores, diagnosis accuracy, and recently viewed posts
- Community posts with images, tags, search, comments, likes, views, and user follows
- User profiles with avatars, bios, interests, and password changes
- Curated learning resources for each supported exam

## Tech stack

| Area | Technology |
| --- | --- |
| Web app | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, Lucide icons |
| Database and file storage | Convex |
| Authentication | Better Auth with the Convex component |
| AI Patient Simulation       | AI SDK, Groq, `llama-3.1-8b-instant` |
| Forms and validation | React Hook Form, Zod |
| Charts and animation | Recharts, Framer Motion |

## Project structure

```text
app/
  (app)/                 Authenticated pages and shared application layout
  (auth)/                Sign-in, sign-up, and onboarding pages
  api/auth/[...all]/     Better Auth proxy route
  api/chat/              Authenticated streaming diagnosis chat endpoint
  _components/           Landing-page and navigation components
components/
  ai/                    Chat and message components
  ui/                    Shared shadcn/ui components
convex/
  schema.ts              Application data model
  *.ts                   Queries and mutations for each feature
  betterAuth/            Better Auth component schema and adapter
lib/                     Auth helpers, constants, and shared utilities
public/                  Images and other static assets
proxy.ts                 Route protection and auth redirects
vercel.sh                Production-aware Vercel build script
```

The browser talks to Convex through `ConvexBetterAuthProvider`. Convex stores profiles, posts, quiz attempts, diagnosis sessions, and uploaded files. Next.js handles the auth proxy and the `/api/chat` route. The chat route checks the session, loads the hidden disease from Convex, and streams a simulated patient response from Groq.

## Prerequisites

- Node.js 20.9 or newer
- npm
- A [Convex](https://www.convex.dev/) account and project
- A [Groq API key](https://console.groq.com/keys)
- Google OAuth credentials for the configured Google sign-in provider

## Local setup

1. Clone the repository and install its packages.

   ```bash
   git clone https://github.com/Maaz-BinAamir/synapse.git
   cd synapse
   npm install
   ```

2. Connect the repository to a Convex development deployment.

   ```bash
   npx convex dev
   ```

   On its first run, the Convex CLI asks you to sign in and select or create a project. It writes `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, and `NEXT_PUBLIC_CONVEX_SITE_URL` to `.env.local`. Leave this process running so backend functions and generated types stay in sync.

3. In another terminal, configure the variables used by the Convex runtime. Omitting each value makes the CLI prompt for it, which keeps secrets out of shell history.

   ```bash
   npx convex env set SITE_URL
   npx convex env set BETTER_AUTH_SECRET
   npx convex env set GOOGLE_CLIENT_ID
   npx convex env set GOOGLE_CLIENT_SECRET
   ```

   Use `http://localhost:3000` for `SITE_URL`. `BETTER_AUTH_SECRET` must be a high-entropy secret. The Google variables are required by the current auth configuration, even if you plan to use email/password during development.

4. Add the Groq key to the `.env.local` file that Convex created.

   ```dotenv
   GROQ_API_KEY=your-groq-api-key
   ```

   A complete local file will contain these names:

   ```dotenv
   CONVEX_DEPLOYMENT=dev:your-deployment
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment.convex.site
   GROQ_API_KEY=your-groq-api-key
   ```

5. If you use Google sign-in, add these entries to the OAuth client in Google Cloud:

   ```text
   Authorized JavaScript origin: http://localhost:3000
   Authorized redirect URI:     http://localhost:3000/api/auth/callback/google
   ```

6. Start Next.js in the second terminal.

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). Create an account, then complete the profile form before using the authenticated pages.

## Add practice questions

The repository does not include seed data. A quiz can only draw from records already stored in the `questions` table. Each question needs a prompt, an array of answer options, a supported test name, and the zero-based index of the correct option.

You can add records from the Convex dashboard or call the public mutation from the CLI:

```bash
npx convex run questions:createQuestion '{"text":"Which chamber pumps blood into the systemic circulation?","options":["Right atrium","Right ventricle","Left atrium","Left ventricle"],"test":"USMLE","correctOption":3}'
```

Supported `test` values are `USMLE`, `PLAB`, and `FCPS`. A quiz randomly selects up to 10 questions for the chosen test.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npx convex dev` | Deploy Convex functions to the development deployment and watch for changes |
| `npm run lint` | Run the Next.js ESLint configuration |
| `npm run build` | Create a production Next.js build |
| `npm run start` | Serve a completed production build |

## Data model

The application schema in `convex/schema.ts` contains:

- `profile` for usernames, bios, interests, and avatar storage IDs
- `posts`, `comments`, `likes`, and `views` for the forum
- `followers` for profile relationships
- `questions`, `quizzes`, and `quizQuestions` for exam attempts and answers
- `diagnosisSessions` for the assigned disease and submitted diagnosis

Better Auth keeps its users, sessions, accounts, and verification records in the component schema under `convex/betterAuth/`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public landing page and product demo |
| `/signin`, `/signup` | Authentication |
| `/onboarding` | Initial profile setup |
| `/dashboard` | Activity and performance summary |
| `/forums`, `/post/[id]`, `/post/create` | Community forum |
| `/practice-questions` | Exam selection, quiz flow, and results |
| `/practice-diagnosis` | AI patient simulation and diagnosis submission |
| `/learning-resources` | USMLE, PLAB, and FCPS resource links |
| `/profile`, `/user/[username]` | Current and public user profiles |

Except for the landing page and auth pages, `proxy.ts` redirects unauthenticated requests to `/signin`.

## Deployment

`vercel.sh` runs a regular Next.js build for preview environments. In production it deploys the Convex functions before building the app. Configure Vercel to use `bash vercel.sh` as its build command and provide these variables:

- `CONVEX_DEPLOY_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `GROQ_API_KEY`

Set the production deployment's Convex variables separately with `npx convex env set --prod`: `SITE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`. Use the public production URL for `SITE_URL`, then add `<SITE_URL>/api/auth/callback/google` to the Google OAuth client's authorized redirect URIs.

## Current behavior to know about

- The quiz question bank is limited for now. The repository has no bundled seed data, so available questions depend on the records added to the connected Convex deployment.
- The learning-resources page contains a limited set of links for USMLE, PLAB, and FCPS preparation. It is not a complete study guide or resource directory.
- Diagnosis chat messages live only in the browser session. Convex stores the assigned disease and the submitted diagnosis, but not the conversation history.
- Email/password accounts do not require email verification.
- The diagnosis answer check is a case-insensitive exact string comparison.
- Question creation is exposed as a Convex mutation and has no admin interface in the app.
