import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h1>{process.env.NEXT_PUBLIC_APP_TITLE}</h1>
      <TodoList />
    </main>
  );
}