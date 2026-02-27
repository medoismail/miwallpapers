export const siteConfig = {
  title: "Wallpapers",
  description: "Free mobile wallpapers. Personal & commercial use.",
  siteUrl: "https://miwallpapers.vercel.app",

  // GitHub repo info — used to build jsDelivr download URLs
  github: {
    user: "medoismail",
    repo: "miwallpapers",
    branch: "main",
  },
};

/** Build a jsDelivr CDN URL for a file in the repo. */
export function cdnUrl(filepath: string): string {
  const { user, repo, branch } = siteConfig.github;
  return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${filepath}`;
}
