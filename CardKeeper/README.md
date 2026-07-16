# 🃏 CardKeeper

Aplicación móvil desarrollada con **React Native + Expo** para gestionar partidas de juegos de cartas, registrar puntuaciones, consultar el historial de partidas y visualizar estadísticas de los jugadores.

Actualmente incluye soporte para los juegos **Continental** y **MauMau (Chinchón)**, con una arquitectura diseñada para facilitar la incorporación de nuevos juegos en el futuro.

---

## ✨ Características

- 🎮 Soporte para múltiples juegos de cartas.
- 📝 Creación de partidas con número variable de jugadores.
- ✅ Validación automática de las reglas de cada juego.
- 📊 Cálculo automático de puntuaciones y clasificación.
- 💾 Persistencia local mediante AsyncStorage.
- ▶️ Continuación de partidas en curso.
- 📚 Historial completo de partidas finalizadas.
- 📈 Estadísticas agregadas por jugador.
- 🧩 Arquitectura modular y fácilmente extensible.
- 🧪 Tests unitarios para la lógica de negocio.

---

# Juegos soportados

## Continental

- 7 rondas con objetivos diferentes.
- Cálculo automático de cartas repartidas.
- Bonificación por cierre.
- Detección automática de Continental.
- Victoria inmediata al conseguir un Continental en la última ronda.

## MauMau (Chinchón)

- Número ilimitado de rondas.
- Límite de puntuación configurable.
- Eliminación automática de jugadores.
- Cierre normal y cierre con escalera completa.
- Victoria automática cuando solo queda un jugador activo.

---

# Tecnologías utilizadas

## Frontend

- React Native
- Expo
- Expo Router
- TypeScript

## Persistencia

- AsyncStorage

## Testing

- Jest
- jest-expo

## Arquitectura

- Arquitectura basada en dominios.
- Motores independientes por juego.
- Componentes reutilizables.
- Hooks personalizados.
- Separación entre reglas, puntuación, validación y presentación.

---

# Arquitectura del proyecto

```text
app/
├── game/
├── history/
├── statistics/
└── ...

components/
├── game/
├── games/
├── statistics/
└── ui/

games/
├── continental/
│   ├── definition.ts
│   ├── engine.ts
│   ├── rules.ts
│   ├── scoring.ts
│   └── validation.ts
│
├── maumau/
│   ├── definition.ts
│   ├── engine.ts
│   ├── rules.ts
│   ├── scoring.ts
│   └── validation.ts
│
└── core/

hooks/

models/

services/

storage/

tests/
```

---

# Arquitectura de los juegos

Cada juego implementa de forma independiente:

- **definition.ts**
  - Información del juego.
  - Reglas mostradas al usuario.

- **rules.ts**
  - Reglas estáticas.
  - Constantes.
  - Configuración.

- **scoring.ts**
  - Cálculo de puntuaciones.
  - Ranking.
  - Ganadores.

- **validation.ts**
  - Validación de rondas.
  - Validación de reglas.

- **engine.ts**
  - Implementación del GameEngine.
  - Punto de entrada para el juego.

Gracias a esta estructura, añadir un nuevo juego únicamente requiere implementar estos cinco archivos y registrarlo en el `GameRegistry`.

---

# Funcionalidades

## Nueva partida

- Selección del juego.
- Configuración específica.
- Gestión dinámica de jugadores.
- Visualización de reglas.

---

## Durante la partida

- Registro de puntuaciones.
- Selección del jugador que cierra.
- Validaciones automáticas.
- Clasificación en tiempo real.
- Historial de rondas.

---

## Historial

- Partidas guardadas.
- Consulta del detalle completo.
- Clasificación final.
- Todas las rondas registradas.

---

## Estadísticas

A partir del historial de partidas se calculan automáticamente:

- Partidas jugadas.
- Partidas finalizadas.
- Victorias.
- Porcentaje de victorias.
- Puntuación media.
- Continentales conseguidos.
- Estadísticas por juego.

---

# Tests

La lógica de negocio está cubierta mediante pruebas unitarias con Jest.

Incluyen:

- cálculo de puntuaciones
- ranking
- validaciones
- reglas de juego
- servicios

---

# Instalación

```bash
git clone https://github.com/pedgomrev/CardKeeper.git

cd CardKeeper

npm install

npx expo start
```

---

# Scripts

```bash
npm start

npm test

npx tsc --noEmit

npx expo-doctor
```

---

# Capturas

> Próximamente.

Se añadirán capturas de pantalla de:

- Pantalla principal.
- Creación de partida.
- Partida de Continental.
- Partida de MauMau.
- Historial.
- Estadísticas.

---

# Mejoras futuras

- Publicación en Google Play.
- Exportación e importación de partidas.
- Sincronización en la nube.
- Perfiles de jugadores.
- Más juegos de cartas.
- Animaciones.
- Temas personalizables.

---

# Autor

**Pedro Gómez Revilla**

- Grado en Ingeniería Informática
- Máster en Ciencia de Datos e Inteligencia Artificial

GitHub:
https://github.com/pedgomrev