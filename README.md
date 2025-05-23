# Простой телеграм бот, показывающий курсы валют

Бот предоставляет актуальные курсы валют с использованием API от [currencylayer](https://currencylayer.com).
Реализован на Node.js (TypeScript) с использованием long polling (без использования веб-сервера).

---

## Функциональность

- **/start**: Выводит приветствие, описание.
- **/currency**: Выводит формат ввода валютной пары (USD-EUR) и список поддерживаемых валют.
- **/help**: Выводит список доступных команд.

---

## Установка и запуск

### Требования

Для запуска бота потребуется:

- **Node.js** версии 14 и выше
- Токен телеграм бота
- Api ключ от [currencylayer](https://currencylayer.com)

### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/JbanTeam/currencies-bot.git
```

2. Перейдите в папку проекта:

```bash
cd currencies-bot
```

3. Установите зависимости:

```bash
npm install
```

4. Создайте в корне каталога .env файл, добавьте в него следующие переменные:

- EXCHANGE_API_KEY=your_currencylayer_api_key
- TELEGRAM_BOT_TOKEN=your_telegram_bot_token

### Команды

1. Запуск бота:

```bash
npm run start
```

2. Запуск в режиме разработки с использованием nodemon:

```bash
npm run dev
```

3. Сборка проекта:

```bash
npm run build
```

4. Запуск тестов:

```bash
npm run test
```
