# Quickstart: validar GAMES-15

1. `cd English && npm test`: todo en verde (`tests/environment.test.mjs`).
2. Abrir `QuizA.html` con internet → el navegador pide la ubicación. Con permiso: "… in where you are"; sin permiso: Ciudad de México y el aviso para elegir la ciudad.
3. Elegir "Monterrey" en el menú → cambia el clima; recargar → sigue Monterrey.
4. Modo de prueba: `QuizA.html?ambiente=noche&clima=lluvia&estacion=invierno` → noche, lluvia, invierno y "test mode".
   - Momento: `ambiente=dia|tarde|noche` · Clima: `clima=sol|nubes|niebla|lluvia|nieve|tormenta` · Estación: `estacion=primavera|verano|otono|invierno`.
5. Sin internet (o con el servicio bloqueado) → ambiente sin clima y el aviso "No weather right now".
6. Imprimir una guía → el ambiente no sale. Activar "reducir movimiento" → la lluvia se queda quieta.
7. Hoja con todas las combinaciones revisada a ojo; huella de GAMES-1 sin cambios; 390 px sin scroll horizontal.
