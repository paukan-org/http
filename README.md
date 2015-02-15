# [![Build Status](https://travis-ci.org/paukan-org/paukan-http.svg)](https://travis-ci.org/paukan-org/paukan-http) paukan-http
====

Шлюз между хттп-запросами и сетью автоматизации. Кроме этого, предоставляет базовый интерфейс для управления конечными устройствами.

Слушает на {cfg.listen} порту.

GET /service/device/state - получить состояние устройства
POST /service/device/state - установить состояние устройства
