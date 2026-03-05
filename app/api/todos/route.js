import pool from '../../../lib/db';

export async function GET() {
    const result = await pool.query(
        'SELECT * FROM todos ORDER BY created_at DESC'
    );
    return Response.json(result.rows);
}

export async function POST(request) {
    const { text } = await request.json();
    const result = await pool.query(
        'INSERT INTO todos (text) VALUES ($1) RETURNING *',
        [text] 
    );
    return Response.json(result.rows[0], { status: 201 });
}