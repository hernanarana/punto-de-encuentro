# Punto de Encuentro

Tienda online y sitio de servicios técnicos para un cliente real: **Néstor Verón Peralta**, técnico en reparación de heladeras y aires acondicionados. Los clientes recorren el catálogo, buscan y filtran productos, ven ofertas y piden por WhatsApp. El dueño administra los productos desde un panel propio.

> Demo: _[link pendiente de publicación]_

## Qué hace

- **Catálogo** con categorías, buscador y filtros activos visibles.
- **Detalle de producto** con galería de imágenes (Swiper).
- **Ofertas** y barra de promociones.
- **Pedidos por WhatsApp**, con el mensaje armado automáticamente.
- **Página de soporte** con horarios, zonas de atención y especialidades del técnico.
- **Mapa de fondo** con Leaflet.
- **Panel de administración** con login: tablero y editor de productos, protegido por rutas privadas.
- **Diseño adaptado al celular**, con menú lateral y categorías en hoja deslizable.

## Tecnologías

| Área | Herramientas |
| --- | --- |
| Frontend | React, Vite, React Router |
| Datos y login | Firebase (Firestore y Authentication) |
| Interfaz | Swiper, Leaflet, React Icons |
| Publicación | Vercel / GitHub Pages |

## Cómo correrlo

```bash
npm install
npm run dev
```

La configuración de Firebase se toma de variables de entorno `VITE_FIREBASE_*` (archivo `.env`). Los datos del negocio (nombre, horarios, WhatsApp) están en `src/config/business.js`.

## Estructura

```
src/
├── admin/        # login, tablero y editor de productos
├── auth/         # proveedor de autenticación
├── components/   # tarjetas, grillas, banners, botones flotantes
├── layout/       # header (desktop y mobile), menú lateral, footer
├── pages/        # inicio, categoría, búsqueda, ofertas, detalle, soporte
└── config/       # datos del negocio
```

---

Desarrollado por **Hernán Arana** · [LuSan PRO](#) — SAP HANA · Data Science · Web · Marketing digital
