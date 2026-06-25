# components/layout

Componentes de estructura general de la app.

**Qué crear acá:**
- `Header.tsx` — barra de navegación superior con:
  - Logo / nombre de la app
  - Links a Home, Perfil (protegido), Crear Post (protegido)
  - Si está logueado: mostrar nickName + botón Logout
  - Si no está logueado: links a Login / Register
- `Footer.tsx` — pie de página con info del grupo / materia
- `MainLayout.tsx` — layout que envuelve las rutas con Header y Footer
