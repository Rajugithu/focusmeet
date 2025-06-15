import os
import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp
from flask import Flask, request, jsonify
import base64
import traceback
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


LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144]  
RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380] 
FACE_ORIENTATION_INDICES = [1, 33, 263, 61, 291, 199]  


current_dir = os.path.dirname(os.path.abspath(__file__))


model_path = os.path.join(current_dir, 'best_model.h5')


if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at: {model_path}")


try:
    model = tf.keras.models.load_model(model_path)
    logger.info("Model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    exit()


try:
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    logger.info("MediaPipe Face Mesh initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize MediaPipe Face Mesh: {e}")
    face_mesh = None

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

def calculate_eye_aspect_ratio(eye_landmarks, frame_width, frame_height):
    """Calculate Eye Aspect Ratio (EAR) to detect eye blinking/closure"""
    try:
        
        v1 = (eye_landmarks[1].y - eye_landmarks[5].y) * frame_height
        v2 = (eye_landmarks[2].y - eye_landmarks[4].y) * frame_height

        
        h = (eye_landmarks[0].x - eye_landmarks[3].x) * frame_width

       
        ear = (v1 + v2) / (2.0 * h)
        return ear
    except IndexError:
        return 0.0

def is_eye_closed(ear, threshold=0.25):
    """Determine if eye is closed based on EAR threshold"""
    return ear < threshold

def estimate_gaze_direction(face_landmarks, frame_width, frame_height):
    """Estimate where the person is looking based on facial landmarks"""
    try:
        nose_tip = face_landmarks[4]  
        chin = face_landmarks[152]    
        left_eye = face_landmarks[33] 
        right_eye = face_landmarks[263] 

        
        horizontal_ratio = (nose_tip.x - left_eye.x) / (right_eye.x - left_eye.x)
        vertical_ratio = (nose_tip.y - chin.y) / (frame_height * 0.3)  

        
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
    except IndexError:
        return "unknown"

def detect_attention_state(landmarks, frame_width, frame_height):
    """Comprehensive attention detection combining eye state and gaze direction"""
    try:
       
        left_ear = calculate_eye_aspect_ratio([landmarks[i] for i in LEFT_EYE_INDICES], frame_width, frame_height)
        right_ear = calculate_eye_aspect_ratio([landmarks[i] for i in RIGHT_EYE_INDICES], frame_width, frame_height)

       
        left_closed = is_eye_closed(left_ear)
        right_closed = is_eye_closed(right_ear)

        
        if left_closed or right_closed:
            return "Distracted (eyes closed)"

       
        gaze_direction = estimate_gaze_direction(landmarks, frame_width, frame_height)

        
        if gaze_direction != "center":
            return f"Distracted (gazing {gaze_direction})"

        
        nose_x = landmarks[1].x * frame_width
        central_region_start = frame_width * 0.35
        central_region_end = frame_width * 0.65

        if not (central_region_start <= nose_x <= central_region_end):
            return "Distracted"

        return "Attentive"

    except Exception as e:
        logger.error(f"Error in detect_attention_state: {e}")
        return "Error"

def process_frame(frame):
    """Processes a single frame to detect attention."""
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
    """API endpoint to analyze a frame sent as a file."""
    try:
       
        authorization_header = request.headers.get('Authorization')
        if not authorization_header:
            return jsonify({"error": "Missing Authorization header"}), 400

       
        parts = authorization_header.split(' ')
        if len(parts) != 2 or parts[0] != 'Meeting':
            return jsonify({"error": "Invalid Authorization header format"}), 400

        meeting_id = parts[1]
        if not meeting_id:
            return jsonify({"error": "Missing meeting ID"}), 400

     
        if 'frame' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

       
        image_file = request.files['frame']
        if image_file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        
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

if __name__ == '__main__':
    try:
        logger.info("Starting Attention Tracker server...")
        app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
    except Exception as e:
        logger.error(f"Server failed to start: {e}")