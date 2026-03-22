export const TOKEN = {
  name: "DropAccess",
  symbol: "DROPA",
  decimals: 9,
  totalSupply: "1,000,000,000",
  mintAddress: "4LeFXFY33qQFz6KoPw54higA8JPKeqc5AemdUzHH1oSS",
  network: "Solana",
};

export const LINKS = {
  twitter: "https://twitter.com/DropAccessToken",
  telegram: "https://t.me/DropAccessOfficial",
  discord: "https://discord.gg/dropaccess",
  medium: "https://medium.com/@dropaccess",
  github: "https://github.com/dropaccess/dropaccess-site",
  buy: `https://jup.ag/swap/SOL-${TOKEN.mintAddress}`,
  solscan: `https://solscan.io/token/${TOKEN.mintAddress}`,
};

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Tokenomics", href: "/tokenomics" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "About", href: "/about" },
  { label: "Docs", href: "/docs" },
  { label: "How to Buy", href: "/how-to-buy" },
  { label: "Swap", href: "/swap" },
];
