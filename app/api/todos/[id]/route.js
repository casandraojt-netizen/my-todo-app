import pool from '../../../../lib/db';

export async function DELETE(request, { params }) {
    const { id } = params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    return Response.json({ success: true });
}

export async function PUT(request, { params }) {
    const { id } = params;
    const { done } = await request.json();
    const sql = 'UPDATE todos SET done = $1, completed_at = CASE WHEN $1 = true THEN NOW() ELSE NULL END WHERE id = $2 RETURNING *'; 
    const result = await pool.query(sql, [done, id]);
    return Response.json(result.rows[0])
}