# 🛠️ Troubleshooting Guide — GameMarket

## ❌ Ошибка: `ECONNRESET` / `network read ECONNRESET`

Это **проблема с сетевым соединением** при загрузке пакетов из npm registry. Часто встречается в России/СНГ из-за блокировок или медленного соединения.

### 🔧 Решение 1: Использовать российское зеркало (РЕКОМЕНДУЕТСЯ)

```cmd
# В папке проекта:
install-ru.bat
```

Или вручную:
```cmd
npm config set registry https://registry.npmmirror.com
npm cache clean --force
rmdir /s /q node_modules
npm install --legacy-peer-deps --ignore-scripts
```

### 🔧 Решение 2: Использовать другое зеркало

```cmd
# Китайское зеркало:
npm config set registry https://registry.npm.taobao.org

# Или через yarn:
yarn config set registry https://registry.npmmirror.com
yarn install --ignore-scripts
```

### 🔧 Решение 3: Включить VPN

Если зеркала не помогают:
1. Включите любой рабочий VPN
2. Выполните: `npm install --legacy-peer-deps --ignore-scripts`
3. После установки можно отключить VPN

---

## ❌ Ошибка: `EPERM: operation not permitted, rmdir`

Это ошибка прав доступа Windows при удалении файлов `node_modules`.

### 🔧 Решение:

```cmd
# 1. Закройте ВСЕ редакторы кода (VS Code, WebStorm, etc.)
# 2. Запустите терминал ОТ ИМЕНИ АДМИНИСТРАТОРА:
#    - Нажмите Win+X → Terminal (Admin) или PowerShell (Admin)
# 3. Выполните:

rmdir /s /q "C:\Users\genius\Downloads\gamemarket\node_modules"
npm cache clean --force
npm install --legacy-peer-deps --ignore-scripts
```

### Если не помогает:
```cmd
# Перезагрузите компьютер и попробуйте снова:
install-ru.bat
```

---

## ❌ Ошибка: `Prisma schema not found` или `@prisma/client not found`

### 🔧 Решение:

```cmd
# 1. Убедитесь, что находитесь в папке проекта:
cd C:\Users\genius\Downloads\gamemarket

# 2. Проверьте наличие schema.prisma:
dir prisma\schema.prisma

# 3. Если файл есть — сгенерируйте клиент:
npx prisma generate

# 4. Если ошибка — попробуйте с флагом:
npx prisma generate --schema=./prisma/schema.prisma
```

---

## ❌ Ошибка: `port 3000 already in use`

### 🔧 Решение:

```cmd
# Запустите на другом порту:
npm run dev -- --port 3001

# Или:
set PORT=3001 && npm run dev

# Откройте: http://localhost:3001
```

### Найти и убить процесс на порту 3000:
```cmd
# Найти PID:
netstat -aon | findstr :3000

# Убить процесс (замените 12345 на ваш PID):
taskkill /PID 12345 /F
```

---

## ❌ Ошибка: `Cannot find module 'next'` или `'react'`

### 🔧 Решение:

```cmd
# Полная переустановка:
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --legacy-peer-deps --ignore-scripts
```

---

## 🚀 Самый простой способ запустить (с зеркалом)

```cmd
# 1. Откройте терминал ОТ ИМЕНИ АДМИНИСТРАТОРА
# 2. Перейдите в папку проекта:
cd C:\Users\genius\Downloads\gamemarket

# 3. Запустите установку с российским зеркалом:
install-ru.bat

# 4. После успешной установки запустите:
npm run dev

# 5. Откройте в браузере:
# 👉 http://localhost:3000
```

> ⚠️ Если `install-ru.bat` тоже выдаёт ошибку — попробуйте **Ручную установку** ниже.

---

## 🔧 Ручная установка (пошагово)

```cmd
# Шаг 1: Откройте терминал ОТ ИМЕНИ АДМИНИСТРАТОРА

# Шаг 2: Перейдите в папку:
cd C:\Users\genius\Downloads\gamemarket

# Шаг 3: Настройте зеркало:
npm config set registry https://registry.npmmirror.com

# Шаг 4: Очистите кэш:
npm cache clean --force

# Шаг 5: Удалите старые файлы:
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

# Шаг 6: Установите зависимости:
npm install --legacy-peer-deps --ignore-scripts --timeout=300000

# Шаг 7: Запустите проект:
npm run dev
```

---

## 📋 Проверка системы перед установкой

```cmd
# Проверьте версии:
node --version    # Должно быть: 18+, 20+, или 22+
npm --version     # Должно быть: 9+ или 10+

# Проверьте доступ к интернету:
ping -n 3 registry.npmmirror.com

# Проверьте права доступа:
whoami /priv | findstr SeTakeOwnership
```

---

## 💡 Советы для России/СНГ

1. **Используйте зеркала** — `registry.npmmirror.com` работает стабильнее
2. **Увеличьте таймаут** — `--timeout=300000` (5 минут на запрос)
3. **Игнорируйте скрипты** — `--ignore-scripts` обходит проблемы с Prisma
4. **Запускайте от админа** — решает ошибки `EPERM`
5. **Закрывайте VS Code** — он блокирует файлы в `node_modules`

---

## 🆘 Всё ещё не работает?

**Скопируйте и отправьте мне:**

1. 🔴 **Полный текст ошибки** (от начала до конца)
2. 🪟 **Версия Windows** (`winver` в терминале)
3. 📦 **Версии** (`node --version` и `npm --version`)
4. 🌐 **Есть ли интернет** (`ping 8.8.8.8`)

И я дам точное решение для вашего случая! 🛠️

---

## 🎯 Быстрая проверка за 1 минуту

```cmd
# Вставьте в терминал (от админа):
cd C:\Users\genius\Downloads\gamemarket
npm config set registry https://registry.npmmirror.com
npm cache clean --force
rmdir /s /q node_modules 2>nul
npm install --legacy-peer-deps --ignore-scripts --timeout=300000
```

Если установка прошла — запустите:
```cmd
npm run dev
```

И откройте: 👉 **http://localhost:3000** 🎮✨
