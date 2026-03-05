const { ActionDidRevalidateStaticAndDynamic } = require("next/dist/shared/lib/action-revalidation-kind")

export default function About() {
    return (
        <main style={{ maxWidth: 600, margin: '0 auto', padding: 40}}>
            <h1>About This App</h1>
            <p>A todo app built with Next.js and PostgreSQL.</p>
        </main>
    );
}