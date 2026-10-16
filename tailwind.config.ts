import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: { orange: 'var(--orange)', violet: 'var(--violet)', ink: 'var(--ink)', muted: 'var(--muted)', page: 'var(--page)', success: 'var(--success)', warning: 'var(--warning)', error: 'var(--error)' } } } }, plugins: [] } satisfies Config;
