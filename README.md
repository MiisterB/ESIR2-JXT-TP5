# ESIR2 JXT TP5
## Moisan Simon
## Gégout Adrien

Rendu du TP5 de JXT

TP fait à partir du dépo git https://github.com/stfanmichel/ESIR-TP5-SUBJECT.

## Lancement du TP

Ce TP est une API protégé.

Pour pouvoir obtenir l'authorisation de l'utiliser :
  - __curl -i -H "Content-Type: application/json" -X POST -d '{"login":"pedro", "password":"JXT"}' http://localhost:3000/v1/auth/login__

Les options de lancements éxistantes sont les suivantes:
  - __start__        permet de lancer le TP, avec nodemon
  - __test__         permet d'éxécuter les tests
  - __test-report__  permet d'éxécuter les tests et de calculer le `code coverage` de ces tests