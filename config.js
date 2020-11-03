const appTitle = "Scavenger Hunt";
const primaryColor = "#bb4430"; // App bar color
const secondaryColor = "#dda15e"; // Button color
const showItemAttribution = false; // Whether to display who added the item under item title
const newUsersAdminByDefault = false; // Whether new users are admins by default
const adminLinks = [
  {
    title: "Admin",
    url: "/admin",
  },
];
const userLinks = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Collect",
    url: "/collect",
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
  },
  {
    title: "Items",
    url: "/items",
  },
  {
    title: "My Profile",
    url: "/profile",
  },
];

export {
  appTitle,
  primaryColor,
  secondaryColor,
  adminLinks,
  userLinks,
  showItemAttribution,
  newUsersAdminByDefault,
};
