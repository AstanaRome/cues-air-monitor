import Image from 'next/image';

export default function Logo() {
  return (
    <div className="logo">
      <Image
        src="/logo.svg"
        alt="CUES Air Monitor Logo"
        className="logo-image"
        width={120}
        height={40}
        priority
      />
    </div>
  );
} 