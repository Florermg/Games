# Quickstart: validar los sujetos en las tarjetas

1. `npm test`: todo en verde, con la prueba nueva de estructura (`grammar-cards.test.mjs`) y la de versiones.
2. Navegador → Grammar Cards → "All tenses". **Esperado**: las 10 tarjetas de tiempos muestran sujetos y una forma de *play* en sus tres líneas (+, −, ?).
3. `sh specs/004-gramatica-verbos/validate-print/run.sh` → "All checks passed". Revisar a ojo el PDF de las 22 tarjetas.
4. La huella del recorrido de GAMES-1 sigue en `f1 b9 82 7e 2c 76`.
