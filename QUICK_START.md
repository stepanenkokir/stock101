# Быстрый запуск Stock 101 Telegram MiniApp

## 1. Установка зависимостей

```bash
npm install
```

## 2. Настройка переменных окружения

```bash
cp env.example .env
```

Отредактируйте `.env` файл и добавьте ваш Telegram Bot Token:

```env
BOT_TOKEN=your_telegram_bot_token_here
WEBHOOK_URL=https://your_domain.com/webhook
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_random_secret_here
```

## 3. Запуск сервера

```bash
# Для разработки (с автоперезагрузкой)
npm run dev

# Для локальной разработки (без автоперезагрузки)
npm run dev:local

# Для продакшена
npm start
```

Сервер будет доступен по адресу:

- **Разработка**: http://127.0.0.1:3000
- **Продакшен**: https://your_domain.com

## 4. Настройка Caddy

Скопируйте `Caddyfile` в директорию конфигурации Caddy и перезапустите:

```bash
sudo systemctl reload caddy
```

## 5. Тестирование

1. Отправьте `/start` вашему боту в Telegram
2. Нажмите кнопку "🎮 Играть в Stock 101"
3. Игра должна открыться с отображением вашего username

## Структура файлов

- `server.js` - Express сервер с Telegram интеграцией
- `js/telegram-integration.js` - Клиентская интеграция с Telegram
- `js/app.js` - Основное приложение (обновлено)
- `Caddyfile` - Конфигурация Caddy
- `package.json` - Зависимости проекта

## Полезные команды

```bash
# Проверить статус webhook
curl -X GET "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"

# Посмотреть логи
tail -f logs/app.log

# Перезапустить сервис (если настроен systemd)
sudo systemctl restart stock101-telegram
```

Подробная документация: [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md)
