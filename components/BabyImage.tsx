import Image from "next/image";

export default function BabyImage({
  className = "w-32",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/baby-welcome.png"
      alt="Frijolito dándote la bienvenida"
      width={1296}
      height={832}
      priority={priority}
      className={className}
    />
  );
}
