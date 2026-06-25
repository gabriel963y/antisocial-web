# features/auth

Autenticación: login y registro de usuarios.

**Qué crear acá:**

### `Login.tsx`
- Formulario controlado con `nickName` y `password`
- `GET /users` → busca si existe un usuario con ese nickName
- Valida localmente: password debe ser "123456"
- Si ok: guarda usuario en AuthContext + localStorage, redirige a Home
- Si no: muestra mensaje de error ("Usuario no encontrado" / "Contraseña incorrecta")

### `Register.tsx`
- Formulario controlado con nickName, password, email (y otros campos requeridos)
- Valida que los campos requeridos estén completos antes de enviar
- `POST /users` con los datos del formulario
- Si el servidor devuelve error (nickName ya existe), mostrar mensaje al usuario
- Si es exitoso, redirigir a /login o loguear directamente
