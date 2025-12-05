# Scavenger Hunt

An app that lets you have virtual scavenger hunts with you and a group of friends, remotely. Hop on a video call, and have everyone join your scavenger hunt on their devices. View everyone's collections and compete for a top spot on the leaderboard.

## Tech Stack

- **Framework**: Next.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Forms**: React Hook Form with Zod validation
- **Actions**: next-safe-action
- **Image Upload**: Cloudinary
- **Analytics**: Vercel Analytics
- **Notifications**: React Hot Toast

### Prepare

### Environment variables

```bash
cp .env.example .env
```

> Note: Update values accordingly

### Database

```bash
docker compose up -d
```

> Note: This is optional but makes it convenient to spin up everything at once

### Dependencies

```bash
pnpm i
```

## Develop

```bash
pnpm dev
```

> Note: App will be live at `http://localhost:3001`
