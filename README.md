# PassAudit - Password Security Auditor

A full-stack cybersecurity tool that checks password strength, simulates dictionary attacks, and generates security audit reports. Built with Python (Flask) and React.

**Live demo:** https://password-auditor.vercel.app

---

## What it does

| Module | Purpose |
|---|---|
| Strength Checker | Scores a password by length, charset diversity, and Shannon entropy |
| Hash Engine | Generates MD5, SHA-1, SHA-256, SHA-512, and bcrypt hashes with salting demo |
| Audit Report | Upload a password list, get a full risk report with CRITICAL/HIGH/MEDIUM/LOW classification |

---

## Tech stack

**Frontend** — React, Tailwind CSS, FontAwesome, deployed on Vercel

**Backend** — Python, Flask, bcrypt, deployed on Render

---

## Project structure

```
password-auditor/
├── backend/
│   ├── app.py                  Flask REST API
│   ├── strength_checker.py     Phase 1 — entropy scoring
│   ├── hash_engine.py          Phase 2 — hashing algorithms
│   ├── wordlist_attack.py      Phase 3 — dictionary attack simulator
│   ├── auditor.py              Phase 4 — batch audit report generator
│   ├── wordlist_sample.txt     Sample wordlist for testing
│   ├── sample_passwords.txt    Sample password list for testing
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── StrengthChecker.jsx
    │   │   ├── HashEngine.jsx
    │   │   └── AuditReport.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Run locally

### Prerequisites
- Python 3.8+
- Node.js 18+

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/password-auditor.git
cd password-auditor
```

### 2. Start the backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs at `http://localhost:5000`

### 3. Start the frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### 4. Open the app
Go to `http://localhost:5173` in your browser.

---

## Using a larger wordlist (rockyou.txt)

The audit report uses a sample wordlist by default. To use the real rockyou.txt wordlist (14 million passwords) on Kali Linux:

```bash
# rockyou.txt is pre-installed on Kali at:
/usr/share/wordlists/rockyou.txt

# run the auditor directly from terminal:
cd backend
python auditor.py sample_passwords.txt /usr/share/wordlists/rockyou.txt
```

This will crack significantly more passwords than the sample wordlist.

---

## Concepts covered

- Shannon entropy and password scoring
- Hashing algorithms — MD5, SHA-1, SHA-256, SHA-512, bcrypt
- Salting and why it defeats rainbow table attacks
- Dictionary attacks and why bcrypt resists brute-force at scale
- Risk classification — CRITICAL / HIGH / MEDIUM / LOW
- REST API design with Flask
- Full-stack deployment with Vercel and Render

---

## Note

Backend is hosted on Render free tier. The first request after a period of inactivity may take up to 60 seconds to wake up.
