# features/posts

Publicaciones: feed, detalle y creación.

**Qué crear acá:**

### `Feed.tsx` (para la Home)
- `GET /posts` → trae todas las publicaciones
- Muestra: descripción, imágenes, etiquetas, cantidad de comentarios
- Botón "Ver más" → navega a `/post/:id`
- (Opcional) filtro por etiquetas, scroll infinito

### `PostDetail.tsx`
- Ruta: `/post/:id`
- `GET /posts/:id` → detalle de la publicación
- `GET /postimages/post/:postId` → imágenes asociadas
- Muestra descripción completa, imágenes, etiquetas
- Renderiza `CommentList` y `CommentForm` del feature comments

### `CreatePost.tsx`
- Vista protegida (solo si hay usuario logueado)
- Formulario con:
  - `description` (textarea, obligatorio)
  - URLs de imágenes (inputs opcionales, pueden ser dinámicos: botón "Agregar imagen")
  - Selección de etiquetas: `GET /tags` → lista checkboxes o multiselect
- Al enviar:
  - `POST /posts` con `description`, `userId`, `tags`
  - Si hay URLs: por cada una, `POST /postimages` con `url` y `postId`
- Redirigir a /profile o mostrar confirmación
