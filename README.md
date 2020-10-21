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

# TODO

- Linking to /collect/itemId should show collect page starting with that item
- Refactor collect page to use a "collecting" and "successful collect" state with Context
- Successful collect page should have a "continue" option to keep collecting
- Successful collect page should link to the collection item
- Collect page should have a container for the item description that is a fixed size, so that the action buttons below it will stay in place
- Leaderboard should show list of users ranked by most items found
- Collection pages should show a user's found items
- CollectionItem pages should show the user's item photo

# Install

`yarn`

# Config

- Add a `.env.local` file with environmental variables as shown in the example `.example-env.local` file. You can also add these on Vercel and do `vercel pull .env.local` on your machine, which saves you a step.

# Dev

`yarn dev`

# Known Bugs

- None yet.
