'use client';
import { useState, useEffect } from 'react';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTodo({ todo, toggleTodo, deleteTodo, editingId, setEditingId, editText, saveEdit, colors }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        listStyle: 'none',
        padding: 8,
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <li ref={setNodeRef} style={style}>
            <span {...attributes} {...listeners}
                style={{ marginRight: 8, cursor: 'grab', color: '#9CA3AF' }}>
                ⠿
            </span>
            {editingId === todo.id ? (
                <>
                    <input value={editText} onChange={e => setEditText(e. target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(todo.id); }}
                        style={{ padding: 4, marginRight: 8 }}/>
                    <button onClick={() => saveEdit(todo.id)} style={{ marginRight: 4 }}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
            ) : (
                <>
                    <span onClick={() => toggleTodo(todo.id)}
                        style={{ textDecoration: todo.done ? 'line-through' : 'none', cursor: 'pointer' }}>
                        {todo.done ? '✅' : '◻'} {todo.text}
                    </span>
                    <button onClick={() => { setEditingId(todo.id); setEditText(todo.text); }}
                        style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
                        ✏️
                    </button>
                </>
            )}
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
            <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 8 }}>
                {new Date(todo.created_at).toLocaleDateString()}
            </span>
        </li>
    );
}

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    const [priority, setPriority] = useState('medium');  // ← all useState together up here
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(''); 
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState(''); 

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch('/api/todos')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load todos');
                return res.json();
            })
            .then(data => {
                setTodos(data);
                setIsLoading(false);
            });
    }, []);

    const colors = { high: '#FEE2E2', medium: '#FEF9C3', low: '#DCFCE7' };

    async function addTodo() {
        if (!input.trim()) return;
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input, done: false, priority }),
            });
            if (!res.ok) throw new Error('Failed to add todo');
            const newTodo = await res.json();
            setTodos([newTodo, ...todos]);
            setInput('');
        }   catch (err) {
            setError(err.message);
        }
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

    async function saveEdit(id) {
        const res = await fetch(`/api/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: editText }),
        });
        const updated = await res.json();
        setTodos(todos.map(t => t.id === id ? updated : t));
        setEditingId(null);
        setEditText('');
    }

    const sensors = useSensors(useSensor(PointerSensor));

    async function handleDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = todos.findIndex(t => t.id === active.id);
        const newIndex = todos.findIndex(t => t.id === over.id);
        const newTodos = arrayMove(todos, oldIndex, newIndex);

        setTodos(newTodos);

        await fetch('/api/todos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds: newTodos.map(t => t.id) }),
        });
    }

    const filteredTodos = todos
    .filter(t => selectedPriority === null || t.priority === selectedPriority)
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {isLoading && <p style={{ color: '#6B7280' }}>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <div style={{ marginBottom: 12 }}>
                <button onClick={() => setSelectedPriority(null)}
                    style={{ marginRight: 8, fontWeight: selectedPriority === null ? 'bold' : 'normal' }}>
                    All
                </button>
                <button onClick={() => setSelectedPriority('high')}
                    style={{ marginRight: 8, fontWeight: selectedPriority === 'high' ? 'bold' : 'normal' }}>
                    High
                </button>
                <button onClick={() => setSelectedPriority('medium')}
                    style={{ marginRight: 8, fontWeight: selectedPriority === 'medium' ? 'bold' : 'normal' }}>
                    Medium
                </button>
                <button onClick={() => setSelectedPriority('low')}
                    style={{ marginRight: 8, fontWeight: selectedPriority === 'low' ? 'bold' : 'normal' }}>
                    Low
                </button>
            </div>
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
                style={{ marginBottom: 12, padding: 8, width: '100%', boxSizing: 'border-box' }}
            />
            <div>
                <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
                    placeholder="Add a task..." style={{ marginRight: 8, padding: 8 }} />
                <select value={priority} onChange={e => setPriority(e.target.value)}
                    style={{ marginRight: 8, padding: 8 }}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <button onClick={addTodo} style={{ padding: '8px 16px' }}>Add</button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <ul style={{ marginTop: 24, paddingLeft: 0 }}>
                        {filteredTodos.map(todo => (
                            <SortableTodo
                                key={todo.id}
                                todo={todo}
                                toggleTodo={toggleTodo}
                                deleteTodo={deleteTodo}
                                editingId={editingId}
                                setEditingId={setEditingId}
                                editText={editText}
                                setEditText={setEditText}
                                saveEdit={saveEdit}
                                colors={colors}
                            />
                        ))}
                        {search && filteredTodos.length === 0 && (
                            <li style={{ listStyle: 'none', padding: 8, color: '#9CA3AF' }}>
                                No tasks match "{search}"
                            </li>
                        )}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
}