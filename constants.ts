interface Link {
  title: string;
  url: string;
}

export const userLinks: Link[] = [
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
  {
    title: "Sign Out",
    url: "/api/auth/signout",
  },
];
