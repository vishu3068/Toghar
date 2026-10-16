import Link from 'next/link'; import {Logo} from './logo';
export function Header(){return <header className="header"><div className="wrap nav"><Logo/><nav><Link href="/students">Students</Link><Link className="owner-link" href="/owner">List your hostel</Link><Link className="login-link" href="/login">Log in</Link></nav></div></header>}
