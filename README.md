# Scavenger Hunt

An app that lets you have virtual scavenger hunts with you and a group of friends, remotely. Hop on a video call, and have everyone join your scavenger hunt on their devices. View everyone's collections and compete for a top spot on the leaderboard.

## Tech Stack

- **Framework**: TanStack Start
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Forms**: React Hook Form with Zod validation
- **Image Upload**: Cloudinary

## Getting Started

### Environment Variables

```bash
cp .env.example .env
```

Then update the following variables:

- `BETTER_AUTH_SECRET`: A secure secret for Better Auth
- `CLOUDINARY_URL`: Your Cloudinary API credentials
- `CRON_SECRET`: Secret for cron job endpoints
- `DATABASE_URL`: PostgreSQL connection string (defaults to `postgresql://localhost/scavenger-hunt`)

### Install Dependencies

```bash
pnpm install
```

## Development

```bash
pnpm dev
```
