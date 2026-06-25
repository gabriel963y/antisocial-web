# features/profile

Perfil de usuario logueado.

**Qué crear acá:**

### `Profile.tsx`
- Vista protegida (solo accesible con sesión activa)
- Muestra el nickName del usuario actual (desde AuthContext)
- `GET /posts?userId={userId}` → lista de publicaciones del usuario
- Por cada post: descripción, cantidad de comentarios, botón "Ver más" → `/post/:id`
- Botón "Cerrar sesión" → limpia AuthContext y localStorage, redirige a Home
