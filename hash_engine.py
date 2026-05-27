import hashlib
import os
import bcrypt

# --- Hash generators ---

def hash_md5(password):
    return hashlib.md5(password.encode()).hexdigest()

def hash_sha1(password):
    return hashlib.sha1(password.encode()).hexdigest()

def hash_sha256(password):
    return hashlib.sha256(password.encode()).hexdigest()

def hash_sha512(password):
    return hashlib.sha512(password.encode()).hexdigest()

def hash_bcrypt(password):
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt).decode()

# --- Salted SHA-256 (manual, to show the concept) ---

def hash_salted_sha256(password):
    salt = os.urandom(16).hex()
    digest = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}${digest}"

# --- Hash identifier ---

HASH_SIGNATURES = {
    32:  "MD5",
    40:  "SHA-1",
    64:  "SHA-256",
    128: "SHA-512",
}

def identify_hash(hash_str):
    if hash_str.startswith("$2b$") or hash_str.startswith("$2a$"):
        return "bcrypt"
    return HASH_SIGNATURES.get(len(hash_str), "Unknown")

# --- Verify functions ---

def verify_bcrypt(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

def verify_salted_sha256(password, stored):
    salt, digest = stored.split("$")
    check = hashlib.sha256((salt + password).encode()).hexdigest()
    return check == digest

# --- Display ---

def display_hashes(password):
    salted = hash_salted_sha256(password)
    bcrypt_hash = hash_bcrypt(password)

    print(f"\nPassword  : {password}")
    print(f"MD5       : {hash_md5(password)}   [{identify_hash(hash_md5(password))}]")
    print(f"SHA-1     : {hash_sha1(password)}   [{identify_hash(hash_sha1(password))}]")
    print(f"SHA-256   : {hash_sha256(password)}   [{identify_hash(hash_sha256(password))}]")
    print(f"SHA-512   : {hash_sha512(password)[:40]}...   [{identify_hash(hash_sha512(password))}]")
    print(f"Salted256 : {salted}")
    print(f"bcrypt    : {bcrypt_hash}")

    print(f"\n--- Verification tests ---")
    print(f"bcrypt verify      : {verify_bcrypt(password, bcrypt_hash)}")
    print(f"salted256 verify   : {verify_salted_sha256(password, salted)}")

# --- Entry point ---

if __name__ == "__main__":
    print("=== Hashing Engine ===")
    while True:
        pw = input("\nEnter password (or 'q' to quit): ")
        if pw.lower() == 'q':
            break
        display_hashes(pw)
