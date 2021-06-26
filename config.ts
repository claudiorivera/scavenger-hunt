import { Link } from "interfaces/types";

const appTitle: string = "Scavenger Hunt";
const primaryColor: string = "#bb4430"; // App bar color
const secondaryColor: string = "#dda15e"; // Button color
const showItemAttribution: boolean = true; // Whether to display who added the item under item title
const isNewUserAdminByDefault: boolean = false; // Whether new users are admins by default

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
  appTitle,
  primaryColor,
  secondaryColor,
  adminLinks,
  userLinks,
  showItemAttribution,
  isNewUserAdminByDefault,
};
