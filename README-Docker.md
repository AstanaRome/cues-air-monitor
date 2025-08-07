# CUES Air Monitor - Docker Setup

## Быстрый старт

### Сборка и запуск
```bash
# Собрать образ
docker build -t cues-air-monitor .

# Запустить контейнер
docker run -p 3000:3000 cues-air-monitor

# Запустить в фоновом режиме
docker run -d -p 3000:3000 --name cues-app cues-air-monitor
```

### Остановка
```bash
# Остановить контейнер
docker stop cues-app

# Удалить контейнер
docker rm cues-app

# Удалить образ
docker rmi cues-air-monitor
```

## Структура файлов

- `Dockerfile` - инструкции для сборки образа
- `.dockerignore` - файлы, исключаемые из сборки
- `next.config.ts` - настроен для standalone режима

## Переменные окружения

Создайте файл `.env` для локальной разработки:
```env
NEXT_PUBLIC_API_URL=https://test.cuesproject.com
```

## Порт

Приложение доступно на порту `3000`

## Проверка работоспособности

```bash
# Проверить статус контейнеров
docker ps

# Посмотреть логи
docker logs cues-app

# Войти в контейнер
docker exec -it cues-app sh
```

## Продакшн деплой

Для продакшена рекомендуется:
1. Использовать nginx как reverse proxy
2. Настроить SSL сертификаты
3. Использовать Docker Swarm или Kubernetes для масштабирования 