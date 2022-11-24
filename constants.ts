interface Link {
  title: string;
  url: string;
}

export const adminLinks: Link[] = [
  {
    title: "Admin",
    url: "/admin",
  },
];

export const userLinks: Link[] = [
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
  {
    title: "Sign Out",
    url: "/api/auth/signout",
  },
];
