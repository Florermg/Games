# Implementation Plan: Festividades

**Branch**: `014-festividades` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md) | **Jira**: GAMES-16

## Summary

16 festividades con fechas fijas o calculadas (Easter, Thanksgiving). Durante cada una se ven una guirnalda arriba de la hoja, adornos en la ventana del menú de GAMES-15, adornos que flotan en el fondo, un saludo de la tutora al abrir y una tarjeta de vocabulario en inglés (8+ palabras con emoji, español y ejemplo, que se escuchan). Si coinciden, se mezclan. Modo de prueba `?festividad=`.

## Technical Context

- JavaScript clásico sin build; sin red; sin imágenes (SVG en código).
- Pruebas: `node:test` + `node:vm`, fechas fijas.

## Constitution Check

- Spec y aclaraciones antes del plan; pruebas antes del código; `npm test` + workflow `Tests`: ✔.
- Principio V: commit, push, PR y merge con autorización por acción: ✔.
- Sin dependencias ni red: ✔.

## Design

- **`English/js/holidays.js`** (puro arriba, DOM abajo con guarda; en `GAME_SCRIPTS` después de `environment.js`): `HOLIDAYS`, `easterSunday(year)`, `thanksgivingDay(year)`, `holidayRange(holiday, year)`, `activeHolidays(date)`, `holidayOverrides(search)`, `holidayGarlandSvg(ids, uid)`, `holidayWindowSvg(ids, uid)`, `holidayParticles(ids)`, `holidayGreeting(ids)`, `holidayCardHtml(ids, selected)`; DOM `setupHolidays()`, `chooseHolidayTab()`, `sayHolidayWord()`.
- **`English/QuizA.html`**: `#holiday-scene` (fondo), `#holiday-garland` (arriba de la hoja), `#holiday-window` (encima de `#env-window`), `#holiday-card` (menú).
- **`English/css/quiz.css`**: estilos, flotar, movimiento reducido, impresión.
