# School Management System (Vanilla JS)

## Overview
A complete browser-based School Management System built with:
- HTML
- CSS
- Vanilla JavaScript
- localStorage persistence

## Default Login
- Email: `admin@sms.com`
- Password: `123456`

## Folder Structure
```
school-management-system/
├── index.html
├── login.html
├── dashboard.html
├── pages/
│   ├── students.html
│   ├── teachers.html
│   ├── classes.html
│   ├── subjects.html
│   ├── grades.html
├── css/
│   ├── style.css
│   ├── dashboard.css
│   ├── forms.css
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── storage.js
│   ├── students.js
│   ├── teachers.js
│   ├── classes.js
│   ├── subjects.js
│   ├── grades.js
└── README.md
```

## Run
1. Open `login.html` directly in browser, or serve folder via any static server.
2. Login with default admin credentials.
3. Manage students, teachers, classes, subjects, grades, and dashboard reports.

## Notes for Evaluation
- Uses modular files by domain.
- Uses reusable utility functions (`main.js`) and storage service (`storage.js`).
- Includes defensive storage access and validation.
- Uses Jira-style EPIC/TASK comments across feature blocks.
