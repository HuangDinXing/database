# main.py

from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
import subprocess
import glob
from openai import OpenAI
import requests
from dotenv import load_dotenv
load_dotenv() 


app = Flask(__name__)
CORS(app)  # allow your React app to call these APIs

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
student_DIR  = os.path.join(BASE_DIR, "student")
teacher_DIR  = os.path.join(BASE_DIR, "teacher")
music_DIR = os.path.join(BASE_DIR, "music")
OPENROUTER_API_KEY = "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"

# ─── Return full MP4 filename for students ────────────────────────────────
@app.route("/api/student-videos/by-file", methods=["GET"])
def list_student_videos_by_file():
    videos = []
    for name in os.listdir(student_DIR):
        folder = os.path.join(student_DIR, name)
        if not os.path.isdir(folder):
            continue
        filename = f"{name}_front.mp4"
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            videos.append({
                "name": filename,
                "url": f"/student/{name}/{filename}"
            })
    return jsonify(videos)


# ─── Return only the folder name for students ────────────────────────────
@app.route("/api/student-videos/by-folder", methods=["GET"])
def list_student_videos_by_folder():
    videos = []
    for name in os.listdir(student_DIR):
        folder = os.path.join(student_DIR, name)
        if not os.path.isdir(folder):
            continue
        filename = f"{name}_front.mp4"
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            videos.append({
                "name": name,
                "url": f"/student/{name}/{filename}"
            })
    return jsonify(videos)


# ─── Serve student static files ──────────────────────────────────────────
@app.route("/student/<folder>/<filename>", methods=["GET"])
def serve_student_video(folder, filename):
    return send_from_directory(os.path.join(student_DIR, folder), filename)


# ─── Upload endpoint (snapshots & recordings) for students ───────────────
@app.route("/api/student/<folder>/upload", methods=["POST"])
def upload_to_student(folder):
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    base = os.path.join(student_DIR, folder)
    os.makedirs(base, exist_ok=True)
    save_path = os.path.join(base, file.filename)
    file.save(save_path)
    return jsonify({"status": "ok"})

# ─── Upload endpoint (snapshots & recordings) for teachers ───────────────
@app.route("/api/teacher/<folder>/upload", methods=["POST"])
def upload_to_teacher(folder):
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    base = os.path.join(teacher_DIR, folder)
    os.makedirs(base, exist_ok=True)
    save_path = os.path.join(base, file.filename)
    file.save(save_path)
    return jsonify({"status": "ok"})


# ─── Return full MP4 filename for teachers ───────────────────────────────
@app.route("/api/teacher-videos/by-file", methods=["GET"])
def list_teacher_videos_by_file():
    videos = []
    for name in os.listdir(teacher_DIR):
        folder = os.path.join(teacher_DIR, name)
        if not os.path.isdir(folder):
            continue
        filename = f"{name}_front.mp4"
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            videos.append({
                "name": filename,
                "url": f"/teacher/{name}/{filename}"
            })
    return jsonify(videos)


# ─── Return only the folder name for teachers ────────────────────────────
@app.route("/api/teacher-videos/by-folder", methods=["GET"])
def list_teacher_videos_by_folder():
    videos = []
    for name in os.listdir(teacher_DIR):
        folder = os.path.join(teacher_DIR, name)
        if not os.path.isdir(folder):
            continue
        filename = f"{name}_front.mp4"
        path = os.path.join(folder, filename)
        if os.path.exists(path):
            videos.append({
                "name": name,
                "url": f"/teacher/{name}/{filename}"
            })
    return jsonify(videos)


# ─── Serve teacher static files ─────────────────────────────────────────
@app.route("/teacher/<folder>/<filename>", methods=["GET"])
def serve_teacher_video(folder, filename):
    return send_from_directory(os.path.join(teacher_DIR, folder), filename)


# ─── Run analysis script ─────────────────────────────────────────────────
@app.route('/api/run-analysis', methods=['POST'])
def run_analysis():
    data = request.json
    student_folder = data.get('A_path')  # 'hans'
    teacher_folder = data.get('B_path')  # 'xin'

    if not student_folder or not teacher_folder:
        return jsonify({"error": "Missing folder names"}), 400

    # Full path to the script
    script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'run_all_analyze_prototype.py')

    command = [
        'python', script_path,
        '--A_path', student_folder,
        '--B_path', teacher_folder
    ]

    print(f"Running analysis script with: {command}")

    result = subprocess.run(command, capture_output=True, text=True)

    print("=== Script STDOUT ===")
    print(result.stdout)
    print("=== Script STDERR ===")
    print(result.stderr)

    return jsonify({
        "stdout": result.stdout,
        "stderr": result.stderr,
        "returncode": result.returncode
    })
    
# ─── Run Photo Script ────────────────────────────────────────────────────────
@app.route('/api/run-all-photos', methods=['POST'])
def api_run_all_photos():
    data = request.get_json()
    base = data.get('base')
    role = data.get('role', 'student')  # default to student
    if not base:
        return jsonify({"error": "Missing base"}), 400

    script_path = os.path.join(BASE_DIR, 'run_all_photo.py')
    command = ['python', script_path, '--base', base, '--role', role]

    result = subprocess.run(command, capture_output=True, text=True)

    return jsonify({
        'stdout': result.stdout,
        'stderr': result.stderr,
        'returncode': result.returncode
    }), (200 if result.returncode == 0 else 500)



# ─── Run Video Script ────────────────────────────────────────────────────────
@app.route('/api/run-all-videos', methods=['POST'])
def api_run_all_videos():
    data = request.get_json()
    base = data.get('base')
    role = data.get('role', 'student')  # default to student
    if not base:
        return jsonify({"error": "Missing base"}), 400

    script_path = os.path.join(BASE_DIR, 'run_all_video.py')
    command = ['python', script_path, '--base', base, '--role', role]

    result = subprocess.run(command, capture_output=True, text=True)

    return jsonify({
        'stdout': result.stdout,
        'stderr': result.stderr,
        'returncode': result.returncode
    }), (200 if result.returncode == 0 else 500)
    
# ─── Return all MP4 and MP3 filenames in music folder ────────────────────────
@app.route("/api/music-files", methods=["GET"])
def list_music_files():
    media_files = []
    for filename in os.listdir(music_DIR):
        if filename.endswith((".mp4", ".mp3")):
            path = os.path.join(music_DIR, filename)
            if os.path.isfile(path):
                media_files.append({
                    "name": filename,
                    "url": f"/music/{filename}"
                })
    return jsonify(media_files)

@app.route('/music/<filename>', methods=["GET"])
def serve_music_file(filename):
    return send_from_directory(music_DIR, filename)


#xin0524
@app.route("/api/gpt-feedback", methods=["POST"])
def gpt_feedback():
    try:
        data = request.get_json()
        feedback_details = data.get("feedbackDetails", [])

        if not feedback_details:
            return jsonify({"error": "Missing feedback details"}), 400

        # 把 feedback_details 轉成 prompt
        lines = [f"- {d['group']}：{d['level']} 偏差"
                 for d in feedback_details[:10]]
        prompt = (
            "你是一位舞蹈老師，針對下列偏差部位給學生一段簡單中文口語建議，剛好三十字\n"
            + "\n".join(lines)
        )

        # 呼叫 OpenRouter (或 OpenAI)
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",  # 可換其他模型
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 150
            }
        )
        res_json = response.json()

        if "choices" in res_json:
            text = res_json["choices"][0]["message"]["content"].strip()
            print("[GPT回應內容]", text)
            
            return jsonify({"feedback": text})
        else:
            return jsonify({"error": res_json.get("error", {}).get("message", "Unknown")}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    os.makedirs(student_DIR, exist_ok=True)
    os.makedirs(teacher_DIR, exist_ok=True)
    app.run(host="0.0.0.0", port=5000,debug=True)
