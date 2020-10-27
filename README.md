# scavenger-hunt

A game that challenges you to find the most random items around your house. Made for a virtual party our friends are throwing.

# Technologies Used

- React
- [Next.js](https://nextjs.org)
- Serverless API Routes
- [next-connect](https://github.com/hoangvvo/next-connect)
- MongoDB
- [NextAuth.js](https://next-auth.js.org) for GitHub OAuth and "Magic Link" email login
- [SWR](https://swr.vercel.app)
- Material-UI

# Features

- User authentication and admin roles, including protected routes
- Log in with email or OAuth (GitHub, for now)
- Admins can add items to find
- Users collect items by taking photos, which get uploaded to Cloudinary
- Collection pages show all of a particular user's found items
- Items page shows all items and indicates whether current user has found them
- Item info page shows all users who have found that item
- Leaderboard shows list of users ranked by most items found
- Collection item detail page shows the photo a specific user took of an item

# Future Improvements

- Toasts for successfully adding items on admin portal
- Collect page actions should be in a fixed position, instead of moving based on item description
- Allow users to change name and avatar

# Install

`yarn`

# Config

- Add a `.env.local` file with environmental variables as shown in the example `.example-env.local` file. I reccommend adding these on Vercel first and then run `vercel pull .env.local` on your machine which creates that file for you. This saves you a step, since you'll be entering these into Vercel eventually in any case.

# Dev

`yarn dev`

# Known Bugs

- "Find more" (after successful collect) does not correctly move on to the next item consistently (depends on how many total items there are to find, how many the user has already found, and also how the user got to the collect page). This is a state management "off by one" and/or revalidation bug that I've been unsuccessful in tracking down. I'll revisit this in the future.
