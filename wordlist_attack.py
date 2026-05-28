import hashlib
import time
import bcrypt

# --- Hash a candidate word (matches what we stored) ---

def hash_candidate(word, algorithm):
    word = word.strip()
    if algorithm == "md5":
        return hashlib.md5(word.encode()).hexdigest()
    elif algorithm == "sha1":
        return hashlib.sha1(word.encode()).hexdigest()
    elif algorithm == "sha256":
        return hashlib.sha256(word.encode()).hexdigest()
    elif algorithm == "sha512":
        return hashlib.sha512(word.encode()).hexdigest()
    return None

# --- Dictionary attack against a plain hash ---

def dictionary_attack(target_hash, wordlist_path, algorithm="sha256"):
    print(f"\n[*] Starting dictionary attack ({algorithm.upper()})")
    print(f"[*] Target  : {target_hash}")
    print(f"[*] Wordlist: {wordlist_path}\n")

    attempts = 0
    start = time.time()

    try:
        with open(wordlist_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                word = line.strip()
                if not word:
                    continue
                attempts += 1
                if hash_candidate(word, algorithm) == target_hash:
                    elapsed = round(time.time() - start, 4)
                    print(f"[+] CRACKED after {attempts} attempts in {elapsed}s")
                    print(f"[+] Password: {word}")
                    return word
    except FileNotFoundError:
        print(f"[!] Wordlist not found: {wordlist_path}")
        return None

    elapsed = round(time.time() - start, 4)
    print(f"[-] Not found. Tried {attempts} words in {elapsed}s")
    return None

# --- bcrypt is a special case — must use bcrypt.checkpw, can't pre-hash ---

def bcrypt_attack(target_hash, wordlist_path):
    print(f"\n[*] Starting bcrypt dictionary attack (this is slow — by design)")
    print(f"[*] Target  : {target_hash[:40]}...\n")

    attempts = 0
    start = time.time()

    try:
        with open(wordlist_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                word = line.strip()
                if not word:
                    continue
                attempts += 1
                if bcrypt.checkpw(word.encode(), target_hash.encode()):
                    elapsed = round(time.time() - start, 4)
                    print(f"[+] CRACKED after {attempts} attempts in {elapsed}s")
                    print(f"[+] Password: {word}")
                    return word
    except FileNotFoundError:
        print(f"[!] Wordlist not found: {wordlist_path}")
        return None

    elapsed = round(time.time() - start, 4)
    print(f"[-] Not found. Tried {attempts} words in {elapsed}s")
    return None

# --- Entry point ---

if __name__ == "__main__":
    import sys

    WORDLIST = "wordlist_sample.txt"

    # Test 1: crack a known SHA-256 hash of "password123"
    target = hashlib.sha256("password123".encode()).hexdigest()
    print("=== Test 1: SHA-256 crack ===")
    dictionary_attack(target, WORDLIST, algorithm="sha256")

    # Test 2: crack a known MD5 hash of "admin"
    target_md5 = hashlib.md5("admin".encode()).hexdigest()
    print("\n=== Test 2: MD5 crack ===")
    dictionary_attack(target_md5, WORDLIST, algorithm="md5")

    # Test 3: a password NOT in the wordlist
    target_miss = hashlib.sha256("Tr0ub4dor&3".encode()).hexdigest()
    print("\n=== Test 3: not in wordlist ===")
    dictionary_attack(target_miss, WORDLIST, algorithm="sha256")

    # Test 4: bcrypt (slow — demonstrates the cost)
    print("\n=== Test 4: bcrypt attack ===")
    bcrypt_hash = bcrypt.hashpw("qwerty".encode(), bcrypt.gensalt(rounds=10)).decode()
    bcrypt_attack(bcrypt_hash, WORDLIST)
