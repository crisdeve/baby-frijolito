import { assetPath } from "@/lib/asset-path";

export default function CloudBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-[var(--background)]"
      style={{
        backgroundImage: `url(${assetPath("/light_green_paint_background.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
