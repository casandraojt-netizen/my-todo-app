import pool from '../../../lib/db';

export async function GET() {
    const sql = 'SELECT * FROM todos WHERE done = false OR completed_at >= DATE_TRUNC(\'day\', NOW()) ORDER BY position ASC';
    const result = await pool.query(sql);
    return Response.json(result.rows);
}

export async function POST(request) {
    const { text, priority } = await request.json();
    const maxResult = await pool.query('SELECT MAX(position) AS max_pos FROM todos')
    const nextPosition = (maxResult.rows[0].max_pos || 0) + 1;
    const result = await pool.query(
        'INSERT INTO todos (text, priority, position) VALUES ($1, $2, $3) RETURNING *',
        [text, priority, nextPosition] 
    );
    return Response.json(result.rows[0], { status: 201 });
}


export async function PATCH(request) {
    const { orderedIds } = await request.json();
    await Promise.all(
        orderedIds.map((id, index) => 
            pool.query('UPDATE todos SET position = $1 WHERE id = $2', [index, id])
        )
    );
    return Response.json({ success: true });
}