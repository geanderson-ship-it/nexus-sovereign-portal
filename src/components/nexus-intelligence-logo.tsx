import { cn } from '@/lib/utils';
import Image from 'next/image';

export function NexusIntelligenceLogo({
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
      src="https://i.postimg.cc/SKxtC9Ph/Logo-estilizado-para.png"
      alt="Nexus Intelligence Logo"
      width={width}
      height={height}
      className={cn('object-contain', className)}
    />
  );
}
