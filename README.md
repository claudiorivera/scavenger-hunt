# scavenger-hunt

A game that challenges you to find the most random items around your house. Made for a virtual party our friends threw.

# Technologies Used

- React
- [Next.js](https://nextjs.org)
- Serverless API Routes
- Material-UI
- MongoDB
- [NextAuth.js](https://next-auth.js.org) for GitHub OAuth and "Magic Link"
- [SWR](https://swr.vercel.app)

# Features

- User authentication and admin roles, including protected routes
- Log in with email or OAuth (GitHub, or now)
- Admins can add items to find
- Collection pages show all of a particular user's found items
- Users collect items by taking photos, which get uploaded to Cloudinary
- Items page shows all items and indicates whether current user has found it
- Item info page shows all users who have found that item
- Leaderboard shows list of users ranked by most items found
- Collection item detail page shows the specific photo a user took

# Future Improvements

- "My Collection" link should correctly take the user to their collection page from the collect page
- Don't show "got one?" link to users who are viewing the item page for an item that they have already found
- Don't show "got one?" link to users who are viewing someone's collection item that they also have found
- Toasts for successfully adding items on admin portal, instead of the temporary alert()
- Make a reusable component to use for displaying lists of users or items (ie. photo/name/action)
- Collect page should have a container for the item description that is a fixed size, so that the action buttons below it will stay in place, or use flexbox and justify flex-end on the buttons
- Allow users to change name and avatar

# Install

`yarn`

# Config

- Add a `.env.local` file with environmental variables as shown in the example `.example-env.local` file. I reccommend adding these on Vercel first and then run `vercel pull .env.local` on your machine which creates that file for you. This saves you a step, since you'll be entering these into Vercel eventually in any case.

# Dev

`yarn dev`

# Known Bugs

- "Find more" (after successful collect) does not correctly move on to the next item consistently (depends on how many total items there are to find, how many the user has already found, and also how they got to the collect page). This is a state management "off by one" and/or revalidation bug that I've been unsuccessful in tracking down. I'll revisit this in the future.
