# hooks

Hooks personalizados de React compartidos en toda la app.

**Qué crear acá:**
- `useAuth.ts` — hook que consume AuthContext y devuelve `{ user, login, logout, isAuthenticated }`
- `useFetch.ts` — hook genérico para hacer fetch con estado `{ data, loading, error }`
- (Opcional) `useLocalStorage.ts` — hook para leer/escribir en localStorage con tipo genérico
