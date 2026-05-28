# Password Security Auditor

A Python tool that checks password strength, simulates wordlist-based dictionary attacks, and generates a full security audit report across multiple accounts.

---

## What it does

| File | Purpose |
|---|---|
| `strength_checker.py` | Scores a password by length, charset, and entropy |
| `hash_engine.py` | Hashes passwords using MD5, SHA-1, SHA-256, SHA-512, and bcrypt |
| `wordlist_attack.py` | Simulates a dictionary attack by comparing hashes against a wordlist |
| `auditor.py` | Combines all phases into a full audit report with risk classification |

---

## How to run it

**Install dependency**
```bash
pip install bcrypt
```

**Check a single password**
```bash
python3 strength_checker.py
```

**See hashing in action**
```bash
python3 hash_engine.py
```

**Simulate a dictionary attack**
```bash
python3 wordlist_attack.py
```

**Run a full audit on a password list**
```bash
python3 auditor.py sample_passwords.txt wordlist_sample.txt
```

Password file format (`username:password`, one per line):
```
alice:password123
bob:Tr0ub4dor&3!
```

To use the real rockyou wordlist on Kali:
```bash
python3 auditor.py sample_passwords.txt /usr/share/wordlists/rockyou.txt
```

---

## Concepts covered

- **Shannon entropy** — measures how unpredictable a password is in bits
- **Hashing algorithms** — MD5, SHA-1, SHA-256, SHA-512 and why the first two are considered weak for passwords
- **Salting** — why two identical passwords produce different hashes, defeating rainbow table attacks
- **bcrypt** — a deliberately slow hashing algorithm designed to resist brute-force at scale
- **Dictionary attack** — hashing every word in a wordlist and comparing against a target hash
- **Risk classification** — mapping strength + crackability into CRITICAL / HIGH / MEDIUM / LOW tiers

---

## Project structure

```
password_auditor/
├── strength_checker.py
├── hash_engine.py
├── wordlist_attack.py
├── auditor.py
├── wordlist_sample.txt
└── sample_passwords.txt
```
