# Настройка Telegram MiniApp для Stock 101

## Предварительные требования

1. Node.js 18+ с поддержкой ES модулей
2. Telegram Bot API токен
3. Домен с SSL сертификатом (your_domain.com)
4. Caddy веб-сервер

## Установка и настройка

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `env.example`:

```bash
cp env.example .env
```

Отредактируйте `.env` файл:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_actual_telegram_bot_token_here
WEBHOOK_URL=https:/your_domain/webhook

# Server Configuration
PORT=3000
NODE_ENV=production

# Security
SESSION_SECRET=your_random_session_secret_here
```

### 3. Настройка Telegram бота

1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Вставьте токен в переменную `BOT_TOKEN`
4. Настройте webhook URL в переменной `WEBHOOK_URL`

### 4. Настройка Caddy

1. Скопируйте `Caddyfile` в директорию конфигурации Caddy
2. Перезапустите Caddy:

```bash
sudo systemctl reload caddy
```

### 5. Запуск сервера

```bash
# Для разработки
npm run dev

# Для продакшена
npm start
```

## Интеграция с Telegram

### Автоматическая авторизация

Приложение автоматически определяет, запущено ли оно через Telegram, и:

1. Отображает username пользователя в заголовке
2. Адаптирует интерфейс под Telegram Web App
3. Отправляет данные о событиях игры обратно в бота

### Команды бота

- `/start` - Показывает кнопку для запуска игры
- `/help` - Показывает правила игры

### События игры

Приложение отправляет следующие события в Telegram:

- `game_started` - Игра началась
- `score_updated` - Обновлен счет
- `game_over` - Игра окончена

## Структура файлов

```
├── server.js              # Express сервер
├── js/
│   ├── app.js            # Основное приложение (обновлено)
│   └── telegram-integration.js  # Интеграция с Telegram
├── package.json          # Зависимости
├── Caddyfile            # Конфигурация Caddy
└── .env                 # Переменные окружения
```

## Проверка работы

1. Отправьте `/start` боту
2. Нажмите кнопку "🎮 Играть в Stock 101"
3. Игра должна открыться в Telegram с отображением username
4. При завершении игры появится кнопка "Поделиться результатом"

## Устранение неполадок

### Проблемы с webhook

```bash
# Проверьте статус webhook
curl -X GET "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### Проблемы с CORS

Убедитесь, что в Caddyfile правильно настроены CORS заголовки для Telegram.

### Логи

Проверьте логи сервера и Caddy:

```bash
# Логи Express сервера
tail -f /var/log/stock101/app.log

# Логи Caddy
tail -f /var/log/caddy/your_domain.com.log
```

## Безопасность

1. Никогда не коммитьте `.env` файл
2. Используйте HTTPS для всех соединений
3. Настройте правильные CORS заголовки
4. Используйте Helmet для защиты Express приложения
