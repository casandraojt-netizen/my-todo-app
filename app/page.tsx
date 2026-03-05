import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h1>My Todo App</h1>
      <TodoList />
    </main>
  );
}