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
      src="/nexus-treinamento-logo.png"
      alt="Nexus Treinamento Logo"
      width={width}
      height={height}
      className={cn('object-contain h-auto', className)}
      priority
    />
  );
}
