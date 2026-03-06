import pool from '../../../../lib/db';

export async function DELETE(request, { params }) {
    const { id } = (await params);
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    return Response.json({ success: true });
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const { done } = await request.json();

    let sql;
    if (done) {
        sql = 'UPDATE todos SET done = true, completed_at = NOW() WHERE id = $1 RETURNING *';
    } else {
        sql = 'UPDATE todos SET done = false, completed_at = NULL WHERE id = $1 RETURNING *';
    }

    const result = await pool.query(sql, [id]);
    return Response.json(result.rows[0]);
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    const { text } = await request.json();
    const result = await pool.query(
        'UPDATE todos SET text = $1 WHERE id = $2 RETURNING *',
        [text, id]
    );
    return Response.json(result.rows[0]);
}