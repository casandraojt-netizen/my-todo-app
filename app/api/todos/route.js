import pool from '../../../lib/db';

export async function GET() {
    const sql = 'SELECT * FROM todos WHERE done = false OR completed_at >= DATE_TRUNC(\'day\', NOW()) ORDER BY created_at DESC';
    const result = await pool.query(sql);
    return Response.json(result.rows);
}

export async function POST(request) {
    const { text, priority } = await request.json();
    const result = await pool.query(
        'INSERT INTO todos (text, priority) VALUES ($1, $2) RETURNING *',
        [text, priority] 
    );
    return Response.json(result.rows[0], { status: 201 });
}
