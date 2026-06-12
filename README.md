# SITAF Frontend (Next.js)

Este es el frontend del Sistema de Trazabilidad y Administración Farmacéutica (SITAF), construido con Next.js y React.

## Requisitos Previos
- **Node.js** (v18 o superior)
- **pnpm** (recomendado) o **npm**

## Instalación

1. Clona este repositorio.
2. Instala las dependencias ejecutando:
   ```bash
   pnpm install
   # o
   npm install
   ```

## Ejecución en Desarrollo

Para levantar el servidor de desarrollo, ejecuta:
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Notas para el Equipo
- **Módulo 2 (Trazabilidad)** y **Módulo 3 (Control Inteligente de Stock)** ya están integrados en la interfaz en modo claro (Light Mode).
- La aplicación se comunica exclusivamente con el **Spring Boot (Backend Principal)** en `http://localhost:8080`. No llama directamente a FastAPI ni a la Blockchain.
- Asegúrate de que tanto el backend de Spring Boot como la red de Blockchain estén corriendo antes de realizar consultas de historial o simulaciones.
