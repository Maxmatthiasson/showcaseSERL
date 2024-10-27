import Link from 'next/link';
import styles from './header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>showcaseSERL</h1>
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/kiosk" className={styles.navLink}>Kiosk</Link>
            </nav>
        </header>
    );
}
