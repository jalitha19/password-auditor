import hashlib
import time
from strength_checker import rate_strength
from wordlist_attack import dictionary_attack

# --- Risk classifier ---

def classify_risk(strength_result, cracked):
    if cracked:
        return "CRITICAL"
    label = strength_result["label"]
    if label == "Weak":
        return "HIGH"
    elif label == "Fair":
        return "MEDIUM"
    elif label == "Strong":
        return "LOW"
    return "NONE"

RISK_COLORS = {
    "CRITICAL": "\033[91m",  # red
    "HIGH":     "\033[91m",
    "MEDIUM":   "\033[93m",  # yellow
    "LOW":      "\033[92m",  # green
    "NONE":     "\033[96m",  # cyan
}
RESET = "\033[0m"

# --- Audit a single password entry ---

def audit_password(username, password, wordlist_path, algorithm="sha256"):
    strength = rate_strength(password)

    target_hash = hashlib.sha256(password.encode()).hexdigest() if algorithm == "sha256" else \
                  hashlib.md5(password.encode()).hexdigest()

    # Suppress dictionary_attack print output during batch run
    import io, sys
    captured = io.StringIO()
    sys.stdout = captured
    cracked_word = dictionary_attack(target_hash, wordlist_path, algorithm)
    sys.stdout = sys.__stdout__

    risk = classify_risk(strength, cracked_word is not None)

    return {
        "username":    username,
        "password":    password,
        "strength":    strength["label"],
        "entropy":     strength["entropy"],
        "score":       strength["score"],
        "cracked":     cracked_word is not None,
        "cracked_as":  cracked_word,
        "risk":        risk,
        "feedback":    strength["feedback"],
    }

# --- Load password file (format: username:password) ---

def load_passwords(filepath):
    entries = []
    try:
        with open(filepath, "r") as f:
            for line in f:
                line = line.strip()
                if ":" in line:
                    user, pw = line.split(":", 1)
                    entries.append((user.strip(), pw.strip()))
    except FileNotFoundError:
        print(f"[!] File not found: {filepath}")
    return entries

# --- Print the full audit report ---

def print_report(results):
    print("\n" + "="*70)
    print("  PASSWORD SECURITY AUDIT REPORT")
    print("="*70)

    for r in results:
        color = RISK_COLORS.get(r["risk"], "")
        cracked_note = f"  --> cracked as '{r['cracked_as']}'" if r["cracked"] else ""
        print(f"\n  User     : {r['username']}")
        print(f"  Password : {'*' * len(r['password'])}  ({len(r['password'])} chars)")
        print(f"  Strength : {r['strength']}  |  Entropy: {r['entropy']} bits  |  Score: {r['score']}")
        print(f"  Risk     : {color}{r['risk']}{RESET}{cracked_note}")
        if r["feedback"]:
            print(f"  Tips     : {'; '.join(r['feedback'])}")

    print("\n" + "="*70)
    print("  SUMMARY")
    print("="*70)

    total    = len(results)
    cracked  = sum(1 for r in results if r["cracked"])
    critical = sum(1 for r in results if r["risk"] == "CRITICAL")
    high     = sum(1 for r in results if r["risk"] == "HIGH")
    medium   = sum(1 for r in results if r["risk"] == "MEDIUM")
    low      = sum(1 for r in results if r["risk"] in ("LOW", "NONE"))

    avg_entropy = round(sum(r["entropy"] for r in results) / total, 2)

    print(f"\n  Total accounts audited : {total}")
    print(f"  Cracked by wordlist    : {cracked} ({round(cracked/total*100)}%)")
    print(f"  Average entropy        : {avg_entropy} bits")
    print(f"\n  Risk breakdown:")
    print(f"    {RISK_COLORS['CRITICAL']}CRITICAL{RESET} : {critical}")
    print(f"    {RISK_COLORS['HIGH']}HIGH    {RESET} : {high}")
    print(f"    {RISK_COLORS['MEDIUM']}MEDIUM  {RESET} : {medium}")
    print(f"    {RISK_COLORS['LOW']}LOW/NONE{RESET} : {low}")
    print("\n" + "="*70)

# --- Entry point ---

if __name__ == "__main__":
    import sys

    password_file = sys.argv[1] if len(sys.argv) > 1 else "sample_passwords.txt"
    wordlist_file = sys.argv[2] if len(sys.argv) > 2 else "wordlist_sample.txt"

    print(f"[*] Loading accounts from: {password_file}")
    print(f"[*] Using wordlist       : {wordlist_file}")

    entries = load_passwords(password_file)
    if not entries:
        print("[!] No entries found.")
        exit(1)

    print(f"[*] Auditing {len(entries)} accounts...\n")

    results = []
    for username, password in entries:
        result = audit_password(username, password, wordlist_file)
        results.append(result)
        color = RISK_COLORS.get(result["risk"], "")
        print(f"  [{color}{result['risk']:8}{RESET}] {username}")

    print_report(results)
