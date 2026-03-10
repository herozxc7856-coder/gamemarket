# 🚀 GameMarket — Быстрый старт (обновлено)

## ⚠️ Исправление ошибки "Foreign key constraint violated"

Если при создании товара видите ошибку `P2003` — это значит, что **игра не найдена в базе данных**.

### 🔧 Решение: Заполните базу тестовыми данными

```cmd
# 1. Убедитесь, что проект установлен и VPN включён
# 2. В терминале (Admin) в папке проекта:

# Сгенерируйте Prisma клиент:
npx prisma generate

# Обновите схему БД:
npx prisma db push --accept-data-loss

# Заполните тестовыми данными:
npx prisma db seed

# Запустите сервер:
npm run dev
```

### 🎯 После этого:

```
✅ Игры появятся в каталоге
✅ Товары можно создавать (gameId будет валидным)
✅ Тестовый пользователь: test@gamemarket.local
✅ Тестовые товары уже в базе
```

---

## 📋 Полный чеклист запуска

```cmd
# 1. Terminal (Admin) → папка проекта:
cd C:\Users\genius\Downloads\gamemarket

# 2. VPN включён? → Да ✅

# 3. Зависимости (если ещё не установлены):
npm install --legacy-peer-deps --timeout=300000

# 4. Prisma:
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed

# 5. Запуск:
npm run dev

# 6. Открыть:
# 👉 http://localhost:3000
# 👉 http://localhost:3000/sell
```

---

## 🔄 Если `prisma db seed` не работает:

### Вариант А: Запустите сид вручную
```cmd
node prisma/seed.js
```

### Вариант Б: Пропустите сид (интерфейс будет работать)
```cmd
# Просто запустите сервер:
npm run dev

# При создании товара:
# - Выберите игру из списка (они создадутся автоматически)
# - Или используйте любой gameId из списка: 1,2,3,4,5...
```

### Вариант В: Минимальный режим (без БД)
```cmd
# Используйте минимальную версию:
copy package.minimal.json package.json
npm install --legacy-peer-deps --timeout=300000
npm run dev
```
> ⚠️ Данные не сохраняются, но интерфейс работает для тестов.

---

## 🎮 Тестирование создания товара

1. Откройте `http://localhost:3000/sell`
2. Заполните форму:
   - **Игра**: Выберите из списка (CS2, WoT, GTA V...)
   - **Название**: `"Тестовый товар"`
   - **Цена**: `100`
   - **Фото**: Можно пропустить
3. Нажмите **"Опубликовать"**
4. ✅ Должно появиться: `"Товар успешно создан!"`
5. Перейдите в каталог — товар должен быть там!

---

## ❌ Всё ещё ошибка?

### Ошибка: `Foreign key constraint violated on gameId`
```
Решение: Запустите "npx prisma db seed" для создания игр
```

### Ошибка: `Foreign key constraint violated on sellerId`
```
Решение: Сид создаёт пользователя "default-seller"
         Или передайте валидный sellerId из таблицы User
```

### Ошибка: `Table 'product' doesn't exist`
```
Решение: Выполните "npx prisma db push --accept-data-loss"
```

### Ошибка: `Prisma schema validation`
```
Решение: Выполните "npx prisma generate" после изменений schema.prisma
```

---

## 📁 Что я создал для вас:

| Файл | Назначение |
|------|-----------|
| 📄 `prisma/seed.js` | Скрипт заполнения БД тестовыми данными |
| 📄 `src/app/api/products/route.ts` | API с проверкой foreign keys |
| 📄 `src/lib/db.ts` | Безопасное подключение к БД + mock-режим |
| 📝 `QUICK_FIX.md` | Эта инструкция |

---

## 🎯 Кратко: что делать прямо сейчас

```cmd
# В терминале (Admin), VPN включён:
cd C:\Users\genius\Downloads\gamemarket
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
npm run dev
```

**Через 2-3 минуты** сайт должен работать полностью! 🎉

---

## 🆘 Нужна помощь?

Напишите:
1. 🔴 Точную ошибку (последние 5 строк)
2. 📋 Результат `npx prisma db seed`
3. 🗄️ Есть ли файл `prisma/dev.db`

И я дам точное решение! 🛠️🚀
