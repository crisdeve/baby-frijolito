import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

export default function BabyImage({
  className = "w-32",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={assetPath("/baby-welcome.png")}
      alt="Frijolito dándote la bienvenida"
      width={1296}
      height={832}
      priority={priority}
      className={className}
    />
  );
}
