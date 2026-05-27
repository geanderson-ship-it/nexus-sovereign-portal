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
      src="/nexus-intelligence-logo.png"
      alt="Nexus Intelligence Logo"
      width={width}
      height={height}
      className={cn('object-contain', className)}
    />
  );
}
