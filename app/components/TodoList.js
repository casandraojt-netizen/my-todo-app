'use client';
import { useState, useEffect } from 'react';

export default function TodoList() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch('api/todos')
            .then(res => res.json())
            .then(data => setTodos(data));
    }, []);


    const [input, setInput] = useState('');

    async function addTodo() {
        if (!input.trim()) return;
        const res = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input, done: false }),
        });
        const newTodo = await res.json();
        setTodos([newTodo, ...todos]);
        setInput('');
    }

    async function deleteTodo(id) {
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        setTodos(todos.filter(t => t.id !== id));
    }

    async function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: !todo.done }),
        });
        setTodos(todos.map(t =>
            t.id === id ? { ...t, done: !t.done } : t
        ));
    }

    return (
        <div>
            <div>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add a task..." style={{ marginRight: 8, padding: 8 }} />
                <button onClick={addTodo} style={{ padding: '8px 16px' }}>Add</button>
                <button onClick={() => deleteTodo(todo.id)}
                    style={{ marginLeft: 12, color: 'red', cursor: 'pointer', background: 'None', border: 'none', fontSize: 16 }}>
                    x
                </button>
            </div>
            <ul style={{marginTop: 24 }}>
                {todos.map(todo => (
                    <li key={todo.id} onClick={() => toggleTodo(todo.id)}
                        style={{ cursor: 'pointer', listStyle: 'none', padding: 8,
                            textDecoration: todo.done ? 'line-through' : 'none' }}>
                        {todo.done ? '□' : '◻'} {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}