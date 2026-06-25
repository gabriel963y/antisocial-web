# features/comments

Comentarios en publicaciones.

**Qué crear acá:**

### `CommentList.tsx`
- Recibe `postId` como prop
- `GET /comments/post/:postId` → trae comentarios visibles del post
- Muestra la lista con autor y contenido

### `CommentForm.tsx`
- Formulario controlado (textarea)
- Campo obligatorio
- `POST /comments` con `description`, `userId`, `postId`
- Al enviar, limpia el form y actualiza la lista de comentarios
