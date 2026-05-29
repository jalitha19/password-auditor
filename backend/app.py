from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib, os, bcrypt, io, sys

from strength_checker import rate_strength
from hash_engine import hash_md5, hash_sha1, hash_sha256, hash_sha512, hash_bcrypt, hash_salted_sha256
from wordlist_attack import dictionary_attack
from auditor import audit_password

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",                    # local dev
    "https://password-auditor.vercel.app/",              # your Vercel URL (update after deploy)
])

WORDLIST = os.path.join(os.path.dirname(__file__), "wordlist_sample.txt")

# --- /check  POST { password } ---
@app.route("/check", methods=["POST"])
def check():
    data = request.get_json()
    pw = data.get("password", "")
    if not pw:
        return jsonify({"error": "No password provided"}), 400
    result = rate_strength(pw)
    return jsonify(result)

# --- /hash  POST { password } ---
@app.route("/hash", methods=["POST"])
def hash_route():
    data = request.get_json()
    pw = data.get("password", "")
    if not pw:
        return jsonify({"error": "No password provided"}), 400
    return jsonify({
        "md5":      hash_md5(pw),
        "sha1":     hash_sha1(pw),
        "sha256":   hash_sha256(pw),
        "sha512":   hash_sha512(pw),
        "bcrypt":   hash_bcrypt(pw),
        "salted_1": hash_salted_sha256(pw),
        "salted_2": hash_salted_sha256(pw),
    })

# --- /audit  POST multipart file ---
@app.route("/audit", methods=["POST"])
def audit():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    content = request.files["file"].read().decode("utf-8", errors="ignore")
    entries = []
    for line in content.splitlines():
        line = line.strip()
        if ":" in line:
            user, pw = line.split(":", 1)
            entries.append((user.strip(), pw.strip()))

    if not entries:
        return jsonify({"error": "No valid username:password entries found"}), 400

    results = []
    for username, password in entries:
        r = audit_password(username, password, WORDLIST)
        results.append(r)

    total   = len(results)
    cracked = sum(1 for r in results if r["cracked"])
    avg_ent = round(sum(r["entropy"] for r in results) / total, 1)

    return jsonify({
        "results": results,
        "summary": {
            "total":       total,
            "cracked":     cracked,
            "avg_entropy": avg_ent,
        }
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
