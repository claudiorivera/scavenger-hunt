# scavenger-hunt

A game that challenges you to find the most random items around your house. Made for a virtual party our friends threw.

# Technologies Used

- React
- [Next.js](https://nextjs.org)
- Serverless API Routes
- Material-UI
- MongoDB
- [NextAuth.js](https://next-auth.js.org) for GitHub OAuth and "Magic Link"

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

# TODO

- Collection pages should show a user's found items
- Linking to /collect/itemId should show collect page starting with that item
- Successful collect page should link to the collection item
- CollectionItem pages should show the user's item photo
- Toasts for successfully adding items on admin portal
- Make a reusable component to use for displaying lists of users or items (ie. photo/name/action)
- Image preview should be cropped square and not push the action buttons off the screen
- Refactor collect page to use a "collecting" and "successful collect" state with Context
- Collect page should have a container for the item description that is a fixed size, so that the action buttons below it will stay in place, or use flexbox and justify flex-end on the buttons

# Install

`yarn`

# Config

- Add a `.env.local` file with environmental variables as shown in the example `.example-env.local` file. You can also add these on Vercel and do `vercel pull .env.local` on your machine, which saves you a step.

# Dev

`yarn dev`

# Known Bugs

- None yet.
