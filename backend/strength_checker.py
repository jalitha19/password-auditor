import re
import math
import string

# --- Charset detection ---

def detect_charsets(password):
    charsets = 0
    if re.search(r'[a-z]', password): charsets += 26
    if re.search(r'[A-Z]', password): charsets += 26
    if re.search(r'[0-9]', password): charsets += 10
    if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password): charsets += 32
    return charsets

# --- Entropy calculation ---

def calc_entropy(password):
    pool = detect_charsets(password)
    if pool == 0:
        return 0.0
    return len(password) * math.log2(pool)

# --- Strength rating ---

def rate_strength(password):
    score = 0
    feedback = []

    length = len(password)
    if length >= 8:  score += 1
    else:            feedback.append("Use at least 8 characters")

    if length >= 12: score += 1
    if length >= 16: score += 1

    if re.search(r'[a-z]', password) and re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Mix uppercase and lowercase letters")

    if re.search(r'[0-9]', password):
        score += 1
    else:
        feedback.append("Add at least one number")

    if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        score += 1
    else:
        feedback.append("Add special characters like !@#$")

    if re.search(r'(.)\1{2,}', password):
        score -= 1
        feedback.append("Avoid repeating characters (e.g. aaa, 111)")

    entropy = calc_entropy(password)

    if   score <= 1: label = "Weak"
    elif score <= 3: label = "Fair"
    elif score <= 5: label = "Strong"
    else:            label = "Very Strong"

    return {
        "password": password,
        "score":    score,
        "label":    label,
        "entropy":  round(entropy, 2),
        "feedback": feedback
    }

# --- Display ---

def display_result(result):
    colors = {
        "Weak":        "\033[91m",  # red
        "Fair":        "\033[93m",  # yellow
        "Strong":      "\033[92m",  # green
        "Very Strong": "\033[96m",  # cyan
    }
    reset = "\033[0m"
    color = colors.get(result["label"], "")

    print(f"\nPassword : {result['password']}")
    print(f"Strength : {color}{result['label']}{reset}  (score: {result['score']})")
    print(f"Entropy  : {result['entropy']} bits")

    if result["feedback"]:
        print("Tips:")
        for tip in result["feedback"]:
            print(f"  - {tip}")

# --- Entry point ---

if __name__ == "__main__":
    print("=== Password Strength Checker ===")
    while True:
        pw = input("\nEnter password (or 'q' to quit): ")
        if pw.lower() == 'q':
            break
        result = rate_strength(pw)
        display_result(result)
