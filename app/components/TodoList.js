'use client';
import { useState, useEffect } from 'react';

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [priority, setPriority] = useState('medium');  // ← all useState together up here

    useEffect(() => {
        fetch('/api/todos')
            .then(res => res.json())
            .then(data => setTodos(data));
    }, []);

    const colors = { high: '#FEE2E2', medium: '#FEF9C3', low: '#DCFCE7' };  // ← moved down here

    async function addTodo() {
        if (!input.trim()) return;
        const res = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input, done: false, priority }),
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
                <input value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Add a task..." style={{ marginRight: 8, padding: 8 }} />
                <select value={priority} onChange={e => setPriority(e.target.value)}
                    style={{ marginRight: 8, padding: 8 }}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <button onClick={addTodo} style={{ padding: '8px 16px' }}>Add</button>
            </div>
            <ul style={{ marginTop: 24 }}>
                {todos.map(todo => (
                    <li key={todo.id}
                        style={{ cursor: 'pointer', listStyle: 'none', padding: 8,
                            textDecoration: todo.done ? 'line-through' : 'none',
                            display: 'flex', alignItems: 'center' }}>
                        <span onClick={() => toggleTodo(todo.id)}>
                            {todo.done ? '✅' : '◻'} {todo.text}
                        </span>
                        <span style={{
                            background: colors[todo.priority] || colors.medium,
                            borderRadius: 4, padding: '2px 8px',
                            fontSize: 12, marginLeft: 8
                        }}>
                            {todo.priority}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}
                            style={{ marginLeft: 12, color: 'red', cursor: 'pointer',
                                background: 'none', border: 'none', fontSize: 16 }}>
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}