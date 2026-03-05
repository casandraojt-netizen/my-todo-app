import pool from '../../../lib/db';

export async function GET() {
    const sql = 'SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE done = true) AS completed, COUNT(*) FILTER (WHERE done = false) AS remaining, COUNT(*) FILTER (WHERE priority = \'high\' AND done = false) AS high_priority FROM todos';
    const result = await pool.query(sql);
    return Response.json(result.rows[0]);
}