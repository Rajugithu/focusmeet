from flask import Flask, request, jsonify
import cv2
import traceback
import numpy as np
import mediapipe as mp
import logging
from flask_cors import CORS
from datetime import datetime
import math

app = Flask(__name__)
CORS(app, supports_credentials=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("attention-tracker")

# Face mesh indices for different facial features (MediaPipe 468 landmarks)
LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144]  # Outer points of left eye
RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380]  # Outer points of right eye
FACE_ORIENTATION_INDICES = [1, 33, 263, 61, 291, 199]  # Key points for head pose estimation

def get_bounding_box(landmarks, indices, frame_width, frame_height, padding=20):
    """Calculate bounding box around specified facial landmarks"""
    try:
        x_coords = [landmarks[i].x * frame_width for i in indices]
        y_coords = [landmarks[i].y * frame_height for i in indices]
        
        x_min = max(0, min(x_coords) - padding)
        y_min = max(0, min(y_coords) - padding)
        x_max = min(frame_width, max(x_coords) + padding)
        y_max = min(frame_height, max(y_coords) + padding)
        
        return int(x_min), int(y_min), int(x_max), int(y_max)
    except Exception as e:
        logger.error(f"Error in get_bounding_box: {e}")
        return 0, 0, 0, 0

try:
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    logger.info("MediaPipe Face Mesh initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize MediaPipe: {e}")
    face_mesh = None

class SessionManager:
    def __init__(self):
        self.active_sessions = {}
        logger.info(f"Current active sessions: {self.active_sessions}")

    def start_session(self, room_id):
        if room_id in self.active_sessions:
            logger.warning(f"Session for meeting {room_id} is already active.")
            return False, "Session already active"
        
        self.active_sessions[room_id] = {
            "start_time": datetime.now(),
            "active": True
        }
        logger.info(f"Session started for meeting: {room_id}")
        return True, "Session started"

    def stop_session(self, room_id):
        if room_id not in self.active_sessions:
            logger.warning(f"No active session found for meeting: {room_id}")
            return False, "No active session found"
        
        duration = datetime.now() - self.active_sessions[room_id]["start_time"]
        del self.active_sessions[room_id]
        logger.info(f"Session stopped for meeting {room_id}. Duration: {duration}")
        return True, "Session stopped"

session_manager = SessionManager()

def calculate_eye_aspect_ratio(eye_landmarks, frame_width, frame_height):
    """Calculate Eye Aspect Ratio (EAR) to detect eye blinking/closure"""
    # Vertical eye landmarks
    v1 = (eye_landmarks[1].y - eye_landmarks[5].y) * frame_height
    v2 = (eye_landmarks[2].y - eye_landmarks[4].y) * frame_height
    
    # Horizontal eye landmarks
    h = (eye_landmarks[0].x - eye_landmarks[3].x) * frame_width
    
    # Calculate EAR
    ear = (v1 + v2) / (2.0 * h)
    return ear

def is_eye_closed(ear, threshold=0.25):
    """Determine if eye is closed based on EAR threshold"""
    return ear < threshold

def estimate_gaze_direction(face_landmarks, frame_width, frame_height):
    """Estimate where the person is looking based on facial landmarks"""
    # Get relevant landmarks
    nose_tip = face_landmarks[4]  # Tip of the nose
    chin = face_landmarks[152]    # Chin
    left_eye = face_landmarks[33]  # Left eye outer corner
    right_eye = face_landmarks[263]  # Right eye outer corner
    
    # Calculate horizontal and vertical ratios
    horizontal_ratio = (nose_tip.x - left_eye.x) / (right_eye.x - left_eye.x)
    vertical_ratio = (nose_tip.y - chin.y) / (frame_height * 0.3)  # Normalized ratio
    
    # Determine gaze direction
    if horizontal_ratio < 0.35:
        return "left"
    elif horizontal_ratio > 0.65:
        return "right"
    elif vertical_ratio < -0.1:
        return "up"
    elif vertical_ratio > 0.1:
        return "down"
    else:
        return "center"

def detect_attention_state(landmarks, frame_width, frame_height):
    """Comprehensive attention detection combining eye state and gaze direction"""
    try:
        # Calculate eye aspect ratios
        left_ear = calculate_eye_aspect_ratio([landmarks[i] for i in LEFT_EYE_INDICES], frame_width, frame_height)
        right_ear = calculate_eye_aspect_ratio([landmarks[i] for i in RIGHT_EYE_INDICES], frame_width, frame_height)
        
        # Check for closed eyes
        left_closed = is_eye_closed(left_ear)
        right_closed = is_eye_closed(right_ear)
        
        # If either eye is closed, consider distracted
        if left_closed or right_closed:
            return "Distracted (eyes closed)"
        
        # Check gaze direction
        gaze_direction = estimate_gaze_direction(landmarks, frame_width, frame_height)
        
        # Only consider "center" gaze as attentive
        if gaze_direction != "center":
            return f"Distracted (looking {gaze_direction})"
        
        # Additional check for head position
        nose_x = landmarks[1].x * frame_width
        central_region_start = frame_width * 0.35
        central_region_end = frame_width * 0.65
        
        if not (central_region_start <= nose_x <= central_region_end):
            return "Distracted (head turned)"
        
        return "Attentive"
        
    except Exception as e:
        logger.error(f"Error in detect_attention_state: {e}")
        return "Error"

def process_frame(frame):
    try:
        if face_mesh is None:
            return {"error": "Face mesh model not initialized"}
            
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_frame)
        frame_height, frame_width = frame.shape[:2]
        result = {}

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                landmarks = face_landmarks.landmark
                face_indices = [10, 152, 234, 454]
                x1, y1, x2, y2 = get_bounding_box(landmarks, face_indices, frame_width, frame_height)
                
                # Enhanced attention detection
                attention_state = detect_attention_state(landmarks, frame_width, frame_height)
                
                result.update({
                    "attention_state": attention_state,
                    "is_attentive": "Attentive" in attention_state,
                    "bounding_box": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "timestamp": datetime.now().isoformat()
                })
        else:
            result["attention_state"] = "No Face Detected"
            result["is_attentive"] = False
        
        return result
    except Exception as e:
        logger.error(f"Error in process_frame: {e}")
        return {"error": str(e)}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Extract meeting ID from Authorization header
        authorization_header = request.headers.get('Authorization')
        if not authorization_header:
            return jsonify({"error": "Missing Authorization header"}), 400
        
        # The Authorization header should be in the format: "Meeting <meeting_id>"
        parts = authorization_header.split(' ')
        if len(parts) != 2 or parts[0] != 'Meeting':
            return jsonify({"error": "Invalid Authorization header format"}), 400
            
        meeting_id = parts[1]
        if not meeting_id:
            return jsonify({"error": "Missing meeting ID"}), 400

        # Check if the request has the 'frame' file part
        if 'frame' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        # Get the image file from the request
        image_file = request.files['frame']
        if image_file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Convert the file to an OpenCV image
        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"error": "Invalid image data, unable to decode file"}), 400

        # Process the frame
        result = process_frame(frame)
        if 'error' in result:
            return jsonify(result), 400
            
        # Enhanced response format
        response = {
            "isAttentive": result.get("is_attentive", False),
            "attentionState": result.get("attention_state", "Unknown"),
            "confidence": 0.9 if result.get("is_attentive", False) else 0.2,
            "faceDetected": "attention_state" in result and result["attention_state"] != "No Face Detected",
            "meetingId": meeting_id,
            "boundingBox": result.get("bounding_box", {})
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error in /predict: {traceback.format_exc()}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e),
            "traceback": traceback.format_exc()
        }), 500
    
@app.route('/start_session', methods=['POST'])
def start_session():
    try:
        data = request.get_json()
        room_id = data.get('room_id')
        if not room_id:
            return jsonify({"error": "Meeting ID required"}), 400
        
        success, message = session_manager.start_session(room_id)
        return jsonify({"message": message, "room_id": room_id}), 200
    except Exception as e:
        logger.error(f"Error starting session: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/stop_session', methods=['POST'])
def stop_session():
    try:
        data = request.get_json()
        room_id = data.get('room_id')
        if not room_id:
            return jsonify({"error": "Meeting ID required"}), 400
        
        success, message = session_manager.stop_session(room_id)
        return jsonify({"message": message}), 200
    except Exception as e:
        logger.error(f"Error stopping session: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        logger.info("Starting Attention Tracker server...")
        app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
    except Exception as e:
        logger.error(f"Server failed to start: {e}")