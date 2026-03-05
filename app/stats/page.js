export default async function StatsPage() {
    const res = await fetch('http://localhost:3000/api/stats', {
        cache: 'no-store'
    });
    const stats = await res.json();

    return (
        <main style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
            <h1>Stats</h1>
            <p>Total todos: {stats.total}</p>
            <p>Completed: {stats.completed}</p>
            <p>Remaining: {stats.remaining}</p>
            <p>High priority remaining: {stats.high_priority}</p>
        </main>
    );
}