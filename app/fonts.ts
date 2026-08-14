import localFont from "next/font/local";

export const neueMontreal = localFont({
  src: [
    { path: "./fonts/NeueMontreal-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/NeueMontreal-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-neue-montreal",
  display: "swap",
});

export const supply = localFont({
  src: [{ path: "./fonts/Supply-UltraLight.otf", weight: "200", style: "normal" }],
  variable: "--font-supply",
  display: "swap",
});
