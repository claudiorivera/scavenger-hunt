# Scavenger Hunt

It's a virtual scavenger hunt! Everyone plays simultaneously and finds specific items around their house from a list that the host has created. Set your own win conditions (most items found in 15 minutes, first to find all items, etc.) and have fun!

## Technologies Used

- React
- TypeScript
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)

## Features

- User authentication and admin roles, including protected routes
- Log in with email or GitHub
- Admins can add items to find
- Users collect items by taking photos, which get uploaded to Cloudinary
- Collection pages show all of a particular user's found items
- Items page shows all items and indicates whether current user has found them
- Item info page shows all users who have found that item
- Leaderboard shows list of users ranked by most items found
- Collection item detail page shows the photo a specific user took of an item
- Users can update their name and avatar on the "My Profile" page.
- Admins can delete collection items
- Admins can delete users
- Daily Cron job deletes all users, items, and collections, and seeds random fake data

## New In This Version

- Refactored to use Next 13 `app` directory

## Future Improvements

- Allow admins to delete items
- Allow admins to flag users as admins
- Allow users to delete their profiles

## Install

`pnpm i`

## Config

- Add a `.env.local` file with environmental variables as shown in the example `.example.env.local` file.

## Dev

`pnpm dev`
