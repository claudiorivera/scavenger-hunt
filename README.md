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

# New in This Version

- Implemented admin user role, page, routes, auth, etc.
- Added admin page to add items.
- Items page shows all items and indicates whether current user has found it
- User can collect items
- Specific item page should show all users who have found that item
- Load spinners for photo submit
- Send email link submit button spinner
- Leaderboard should show list of users ranked by most items found
- Upload to Cloudinary normally, but have Cloudinary do transformations on the fly via URL that is saved to the db?
- Collection pages should show a user's found items
- /items/foundby pages should show the user's item photo
- Refactor collect page to use a "collecting" and "successful collect" state with Context
- Linking to /collect/itemId should show collect page starting with that item

# TODO

- Figure out why we're still getting 413 errors - https://vercel.com/knowledge/how-to-bypass-vercel-5mb-body-size-limit-serverless-functions
- Toasts for successfully adding items on admin portal, instead of the temporary alert()
- Make a reusable component to use for displaying lists of users or items (ie. photo/name/action)
- Collect page should have a container for the item description that is a fixed size, so that the action buttons below it will stay in place, or use flexbox and justify flex-end on the buttons
- Allow users to change name and avatar

# Install

`yarn`

# Config

- Add a `.env.local` file with environmental variables as shown in the example `.example-env.local` file. You can also add these on Vercel and do `vercel pull .env.local` on your machine, which saves you a step.

# Dev

`yarn dev`

# Known Bugs

- None yet.
