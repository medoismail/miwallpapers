export const siteConfig = {
  title: "Wallpapers",
  description: "Free mobile wallpapers. Personal & commercial use.",
  siteUrl: "https://walls.example.com",

  // GitHub repo info — used to build jsDelivr download URLs
  github: {
    user: "YOUR_USERNAME",
    repo: "wallpapers",
    branch: "main",
  },
};

/** Build a jsDelivr CDN URL for a file in the repo. */
export function cdnUrl(filepath: string): string {
  const { user, repo, branch } = siteConfig.github;
  return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${filepath}`;
}
