# Типографика интерфейсов · Interface Typography Lab

Интерактивный курс канала [«Чердак»](https://t.me/engattic) о том, как подбирать шрифты для интерфейсов и веб-страниц: классы и характер шрифтов, начертание, кегль, интерлиньяж, длина строки, пары шрифтов, адаптивность и доступность. Короткие карточки «практика — теория — проверка», песочница с подсказками и итоговый мини-проект.

Сайт статический: HTML + CSS + JS без сборки и без сервера. Прогресс хранится в `localStorage` браузера, его можно скачать и загрузить JSON-файлом.

## Структура

```
index.html                 оболочка: шапка, навигация, подвал
assets/css/style.css       стили (бренд «Чердак», светлая и тёмная тема)
assets/css/fonts.css       @font-face — генерируется скриптом
assets/fonts/<id>/         WOFF2 (кириллица + латиница) и лицензия каждого шрифта
assets/js/i18n.js          строки интерфейса RU / EN
assets/js/course.js        содержание модулей: карточки, шпаргалки, литература
assets/js/demos*.js        интерактивные демо внутри карточек (по модулям)
assets/js/sandbox.js       песочница
assets/js/project.js       итоговый проект: конструктор системы, проверки, экспорт CSS и отчёта
assets/js/project-cases.js кейсы итогового проекта (брифы и тексты страниц)
assets/js/store.js         прогресс (localStorage, экспорт/импорт)
assets/js/app.js           роутер (#/, #/m/<id>/<шаг>, #/sandbox, #/project, #/reading, #/progress)
assets/js/fonts-data.js    каталог шрифтов — генерируется скриптом
scripts/fonts.config.js    список шрифтов (редактировать здесь)
scripts/fetch-fonts.js     скачивает шрифты с Fontsource и генерирует fonts.css / fonts-data.js
```

## Как добавить шрифт

1. Добавьте строку в `scripts/fonts.config.js` (пакет Fontsource, класс, подкласс, насыщенности).
2. Выполните `node scripts/fetch-fonts.js` (нужны Node.js и npm).
3. Закоммитьте изменения в `assets/fonts`, `assets/css/fonts.css`, `assets/js/fonts-data.js`.

## Как добавить урок

Откройте `assets/js/course.js`, найдите модуль, уберите `draft: true` и заполните `cards`, `cheatsheet`, `readings`. Формат описан в начале файла. Тексты карточек — не длиннее 60–80 слов.

## Локальный запуск

Запустите `npx serve .` (или `python3 -m http.server`) в папке проекта. При открытии `index.html` напрямую из файла экспорт CSS в итоговом проекте не сможет включить правила `@font-face`.

## Публикация

GitHub: Settings, раздел Pages, Deploy from a branch, ветка `main`, папка root.

## Лицензии

Код — MIT. Шрифты — SIL Open Font License 1.1, файл лицензии лежит в папке каждого шрифта.
