import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({
  className,
  width = 200,
  height = 67,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="https://i.postimg.cc/g02B8h7b/Cartao-de-visita-mod.png"
      alt="Nexus Treinamento Logo"
      width={width}
      height={height}
      className={cn('object-contain h-auto', className)}
      priority
    />
  );
}
