# Welcome to your Convex + Next.js + Clerk app

This is a [Convex](https://convex.dev/) project created with [`npm create convex`](https://www.npmjs.com/package/create-convex).

After the initial setup (<2 minutes) you'll have a working full-stack app using:

- Convex as your backend (database, server logic)
- [React](https://react.dev/) as your frontend (web page interactivity)
- [Next.js](https://nextjs.org/) for optimized web hosting and page routing
- [Tailwind](https://tailwindcss.com/) for building great looking accessible UI
- [Clerk](https://clerk.com/) for authentication

## Get started

If you just cloned this codebase and didn't use `npm create convex`, run:

```
npm install
npm run dev
```

If you're reading this README on GitHub and want to use this template, run:

```
npm create convex@latest -- -t nextjs-clerk
```

Then:

1. Open your app. There should be a "Claim your application" button from Clerk in the bottom right of your app.
2. Follow the steps to claim your application and link it to this app.
3. Follow step 3 in the [Convex Clerk onboarding guide](https://docs.convex.dev/auth/clerk#get-started) to create a Convex JWT template.
4. Uncomment the Clerk provider in `convex/auth.config.ts`
5. Paste the Issuer URL as `CLERK_JWT_ISSUER_DOMAIN` to your dev deployment environment variable settings on the Convex dashboard (see [docs](https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances))

If you want to sync Clerk user data via webhooks, check out this [example repo](https://github.com/thomasballinger/convex-clerk-users-table/).

## Tinybird Analytics Setup

This project uses [Tinybird](https://www.tinybird.co/) for analytics tracking. You can run Tinybird locally using Docker or use Tinybird Cloud for production.

### Local Development (Docker)

1. **Start Tinybird locally:**
   ```bash
   npm run tinybird:start
   ```
   This will start a Tinybird instance in Docker on `http://localhost:7181`.

2. **Get your local Tinybird token:**
   - Visit `http://localhost:7181` in your browser
   - Sign up or log in to get your admin token
   - Copy the token from the dashboard

3. **Deploy Tinybird pipes and datasources:**
   ```bash
   npm run tinybird:deploy
   ```
   This will deploy all the Tinybird resources (datasources, pipes, materializations) to your local instance.

4. **Set environment variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   TINYBIRD_HOST=http://localhost:7181
   TINYBIRD_TOKEN=your_local_tinybird_token
   ```

5. **Verify Tinybird is running:**
   ```bash
   npm run tinybird:status
   ```

### Production (Tinybird Cloud)

1. **Create a Tinybird account:**
   - Go to [https://www.tinybird.co](https://www.tinybird.co)
   - Sign up for an account
   - Create a new workspace

2. **Get your Tinybird token:**
   - Go to your Tinybird workspace settings
   - Navigate to "Tokens" section
   - Create a new token with read and write permissions
   - Copy the token

3. **Deploy Tinybird resources:**
   - Install Tinybird CLI: `curl https://tinybird.co | sh`
   - Authenticate: `tb auth`
   - Deploy: `tb deploy`
   - Or use the GitHub Actions workflow (see `tinybird/.github/workflows/`)

4. **Set environment variables in your hosting platform:**
   - For Vercel: Go to Project Settings → Environment Variables
   - Add:
     ```env
     TINYBIRD_HOST=https://api.tinybird.co
     TINYBIRD_TOKEN=your_tinybird_cloud_token
     ```

### Environment Variables

Required environment variables for Tinybird:

- `TINYBIRD_HOST`: The Tinybird API host
  - Local: `http://localhost:7181`
  - Production: `https://api.tinybird.co`
- `TINYBIRD_TOKEN`: Your Tinybird API token
  - Get from Tinybird dashboard (local or cloud)

**Note:** If Tinybird is not configured, the application will still work, but analytics will return empty data. Link tracking will be logged but not stored in Tinybird.

### Tinybird Management Commands

- `npm run tinybird:start` - Start Tinybird Docker container
- `npm run tinybird:stop` - Stop Tinybird Docker container
- `npm run tinybird:down` - Stop and remove Tinybird Docker container
- `npm run tinybird:logs` - View Tinybird logs
- `npm run tinybird:status` - Check Tinybird container status
- `npm run tinybird:deploy` - Deploy Tinybird resources (local)

## Learn more

To learn more about developing your project with Convex, check out:

- The [Tour of Convex](https://docs.convex.dev/get-started) for a thorough introduction to Convex principles.
- The rest of [Convex docs](https://docs.convex.dev/) to learn about all Convex features.
- [Stack](https://stack.convex.dev/) for in-depth articles on advanced topics.

## Join the community

Join thousands of developers building full-stack apps with Convex:

- Join the [Convex Discord community](https://convex.dev/community) to get help in real-time.
- Follow [Convex on GitHub](https://github.com/get-convex/), star and contribute to the open-source implementation of Convex.
