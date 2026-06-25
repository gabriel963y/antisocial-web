# lib/api

Cliente HTTP para comunicarse con el backend.

**Qué crear acá:**
- `client.ts` — función/fetch wrapper con:
  - Base URL: `http://localhost:3000/api`
  - Headers por defecto (Content-Type: application/json)
  - Manejo de errores centralizado
  - Tipado genérico: `api.get<T>(endpoint)`, `api.post<T>(endpoint, body)`
- `endpoints.ts` — (opcional) constantes con las rutas de la API:
  - USERS, POSTS, TAGS, COMMENTS, POSTIMAGES
- `types.ts` — (opcional) tipos específicos de respuestas de la API si no están en `types/`
