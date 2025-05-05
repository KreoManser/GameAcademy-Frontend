'use client'

import { usePathname } from 'next/navigation'

interface ClientWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientWrapper({
  children,
  className,
}: ClientWrapperProps) {
  const pathname = usePathname();
  return (
    <div key={pathname} className={className}>
      {children}
    </div>
  );
}