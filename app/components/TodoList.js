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

    function addTodo() {
        if (!input.trim()) return;
        setTodos([...todos, { id: Date.now(), text: input, done: false }]);
        setInput('');
    }

    function toggleTodo(id) {
        setTodos(todos.map(t =>
            t.id === id ? { ...t, done: !t.done } : t
        ));
    }

    return (
        <div>
            <div>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add a task..." style={{ marginRight: 8, padding: 8 }} />
                <button onClick={addTodo} style={{ padding: '8px 16px' }}>Add</button>
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