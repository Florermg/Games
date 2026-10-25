# Quickstart: validar las columnas de impresión

1. `npm test` en verde, con las pruebas nuevas de columnas y la de versiones.
2. Grammar Cards: "2 columns" aparece marcada. Marcar 4 tarjetas → "1 column" → 🖨. **Esperado**: `#print-area` lleva `.print-cards.one-column` y se abre la impresión.
3. Volver al menú y entrar otra vez → sigue "1 column". Recargar la página → vuelve "2 columns".
4. Verbs: agregar 3 verbos, elegir "1 column" e imprimir. **Esperado**: lo mismo que en el paso 2.
5. `sh specs/004-gramatica-verbos/validate-print/run.sh` → "All checks passed", con los casos de 1 columna. Revisar a ojo que las tarjetas ocupen todo el ancho y que las de 2 columnas sigan igual.
6. La huella del recorrido de GAMES-1 sigue en `f1 b9 82 7e 2c 76`.
