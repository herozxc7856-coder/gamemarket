# 🚀 GameMarket — Deployment Guide (Public Access)

## 📋 Что нужно для публикации сайта:

```
✅ Код готов (в папке gamemarket/)
✅ База данных: SQLite (локально) или PostgreSQL (продакшн)
✅ Хостинг: Vercel (рекомендуется) или любой Node.js сервер
✅ Домен: ваш-сайт.com (опционально)
```

---

## 🎯 Вариант 1: Vercel (БЕСПЛАТНО, рекомендуется)

### Шаг 1: Подготовьте проект

```cmd
# 1. Создайте файл vercel.json в корне проекта:
```

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://your-project.vercel.app"
  }
}
```

### Шаг 2: Настройте базу данных для продакшена

**SQLite не работает на Vercel** (файловая система временная). Используйте:

#### 🗄️ Вариант А: PostgreSQL (рекомендуется)

1. Создайте бесплатную БД на [Neon.tech](https://neon.tech) или [Supabase](https://supabase.com)
2. Получите строку подключения: `postgresql://user:pass@host/db`
3. Обновите `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. Создайте файл `.env` в корне проекта:

```env
# Для локальной разработки
DATABASE_URL="file:./dev.db"

# Для продакшена (Vercel)
# Добавьте в настройках Vercel → Environment Variables:
# DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

### Шаг 3: Деплой на Vercel

```cmd
# 1. Установите Vercel CLI:
npm install -g vercel

# 2. Авторизуйтесь:
vercel login

# 3. Задеплойте:
vercel --prod
```

**ИЛИ через веб-интерфейс:**

1. Зарегистрируйтесь: [vercel.com](https://vercel.com)
2. Нажмите **"New Project"** → **"Import"** → выберите репозиторий с кодом
3. Настройте:
   - **Framework**: Next.js (авто-определение)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Environment Variables**: добавьте `DATABASE_URL`
4. Нажмите **"Deploy"** 🎉

### Шаг 4: Настройте домен (опционально)

1. В панели Vercel: **Settings** → **Domains**
2. Добавьте ваш домен: `ваш-сайт.com`
3. Настройте DNS у регистратора домена:
   ```
   A record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

---

## 🎯 Вариант 2: Свой сервер (VPS)

### Требования:
- 🐧 Linux (Ubuntu 22.04+)
- 📦 Node.js 18+ и npm 9+
- 🗄️ PostgreSQL 14+ (или SQLite для теста)
- 🌐 Nginx (reverse proxy)
- 🔒 SSL сертификат (Let's Encrypt)

### Установка:

```bash
# 1. Обновите систему:
sudo apt update && sudo apt upgrade -y

# 2. Установите Node.js:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Установите PM2 (менеджер процессов):
sudo npm install -g pm2

# 4. Установите PostgreSQL:
sudo apt install -y postgresql postgresql-contrib

# 5. Создайте БД:
sudo -u postgres psql
> CREATE DATABASE gamemarket;
> CREATE USER gmuser WITH PASSWORD 'your_secure_password';
> GRANT ALL PRIVILEGES ON DATABASE gamemarket TO gmuser;
> \q

# 6. Загрузите код на сервер:
git clone https://github.com/yourusername/gamemarket.git /var/www/gamemarket
cd /var/www/gamemarket

# 7. Установите зависимости:
npm install --legacy-peer-deps

# 8. Настройте .env:
cp .env.example .env
# Отредактируйте DATABASE_URL и другие переменные

# 9. Подготовьте БД:
npx prisma generate
npx prisma db push

# 10. Соберите проект:
npm run build

# 11. Запустите через PM2:
pm2 start npm --name "gamemarket" -- start
pm2 save
pm2 startup

# 12. Настройте Nginx:
sudo nano /etc/nginx/sites-available/gamemarket
```

```nginx
# /etc/nginx/sites-available/gamemarket
server {
    listen 80;
    server_name ваш-сайт.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активируйте конфиг:
sudo ln -s /etc/nginx/sites-available/gamemarket /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL сертификат (бесплатно):
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-сайт.com -d www.ваш-сайт.com
```

---

## 🧹 Удаление тестовых данных

### 1. Очистите базу данных:

```cmd
# В папке проекта:
npx prisma db push --force-reset
```

### 2. Удалите тестовый сид:

```cmd
# Удалите или закомментируйте в package.json:
# "prisma": { "seed": "node prisma/seed.js" }

# Или создайте пустой seed:
echo "// Empty seed for production" > prisma/seed.js
```

### 3. Проверьте, что в коде нет mock-данных:

```cmd
# Поиск по проекту:
grep -r "mockProducts" src/
grep -r "mockGames" src/
grep -r "default-seller" src/
```

Все найденные вхождения должны быть удалены или заменены на реальные API-вызовы.

---

## 🔐 Безопасность для продакшена

### 1. Настройте переменные окружения:

```env
# .env.production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://ваш-сайт.com

# База данных:
DATABASE_URL=postgresql://...

# Авторизация (если используете NextAuth):
NEXTAUTH_SECRET=your_super_secret_key_32_chars_min
NEXTAUTH_URL=https://ваш-сайт.com

# Загрузка файлов:
UPLOAD_MAX_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

### 2. Добавьте middleware для защиты API:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Защита API-роутов
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // TODO: добавить проверку JWT/сессии
    // const token = request.headers.get('authorization');
    // if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
```

### 3. Ограничьте загрузку файлов:

```typescript
// В src/app/api/upload/route.ts добавьте:
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Проверка в POST handler:
if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json({ error: 'File too large' }, { status: 400 });
}
if (!ALLOWED_TYPES.includes(file.type)) {
  return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
}
```

---

## 📊 Мониторинг и логи

### Для Vercel:
- Логи: **Vercel Dashboard** → ваш проект → **Logs**
- Метрики: **Analytics** (платно) или подключите Google Analytics

### Для своего сервера:
```bash
# Логи PM2:
pm2 logs gamemarket

# Логи Nginx:
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Мониторинг:
sudo apt install -y htop glances
glances  # запуск мониторинга
```

---

## 🔄 Обновление сайта

### На Vercel:
```cmd
# Просто запушьте изменения в репозиторий:
git add .
git commit -m "fix: update products API"
git push origin main
# Vercel автоматически пересоберёт и обновит сайт!
```

### На своём сервере:
```bash
# В папке проекта:
git pull origin main
npm install --legacy-peer-deps
npx prisma generate
npm run build
pm2 restart gamemarket
```

---

## 🆘 Частые проблемы при деплое

| Проблема | Решение |
|----------|---------|
| ❌ `Error: Prisma schema validation` | Выполните `npx prisma generate` перед билдом |
| ❌ `DATABASE_URL not found` | Добавьте переменную в настройках хостинга |
| ❌ `Build failed: memory limit` | На Vercel: добавьте `"buildCommand": "NODE_OPTIONS='--max-old-space-size=4096' next build"` |
| ❌ `Upload not working` | На Vercel: файлы удаляются после деплоя → используйте S3/Cloudflare R2 |
| ❌ `CORS errors` | Добавьте заголовки в API-роуты или настройте `next.config.ts` |

---

## ✅ Чеклист перед публикацией

```
□ 1. Удалены все mock-данные из store.ts
□ 2. База данных настроена для продакшена (PostgreSQL)
□ 3. Переменные окружения (.env) настроены
□ 4. Тестовый пользователь/товары удалены
□ 5. Протестированы: регистрация, создание товара, покупка, отзывы, чат
□ 6. Настроен HTTPS (Vercel — автоматически, свой сервер — certbot)
□ 7. Добавлены заголовки безопасности (CSP, XSS protection)
□ 8. Настроен мониторинг ошибок (Sentry или аналоги)
□ 9. Протестирована загрузка файлов
□ 10. Проверена работа на мобильных устройствах
```

---

## 🎉 После публикации:

```
🔗 Ваш сайт: https://ваш-проект.vercel.app
📧 Поддержка: добавьте форму обратной связи
📈 Аналитика: подключите Google Analytics / Plausible
🔔 Уведомления: настройте email-оповещения о новых заказах
```

---

## 🆘 Нужна помощь с деплоем?

**Напишите мне:**
1. Какой хостинг выбрали? (Vercel / свой сервер / другой)
2. Какая ошибка возникает? (полный текст)
3. Есть ли доступ к логам?

И я дам точную инструкцию для вашего случая! 🛠️🚀
