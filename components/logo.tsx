import Image from 'next/image';
import Link from 'next/link';
export function Logo({small=false}:{small?:boolean}) { return <Link className="logo-link" href="/" aria-label="Toghar home"><Image src="/brand/logo.png" alt="Toghar" width={120} height={120} priority className={small?'logo-small':'logo'} /></Link>; }
