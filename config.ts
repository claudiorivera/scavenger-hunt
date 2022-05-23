import { Link } from "types";

const appTitle = "Scavenger Hunt";
const primaryColor = "#bf360c"; // App bar color
const secondaryColor = "#ffc107"; // Button color
const showItemAttribution = true; // Whether to display who added the item under item title
const isNewUserAdminByDefault = false; // Whether new users are admins by default

const adminLinks: Link[] = [
  {
    title: "Admin",
    url: "/admin",
  },
];
const userLinks: Link[] = [
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
  adminLinks,
  appTitle,
  isNewUserAdminByDefault,
  primaryColor,
  secondaryColor,
  showItemAttribution,
  userLinks,
};
