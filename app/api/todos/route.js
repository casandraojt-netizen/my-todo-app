let todos = [
    { id: 1, text: 'Learn Next.js', done: false },
];

export async function GET() {
    return Response.json(todos);
}

export async function POST(request) {
    const body = await request.json();
    const todo = { id: Date.now(), ...body };
    todos.push(todo);
    return Response.json(todo, { status: 201 });
}