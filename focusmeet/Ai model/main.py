import cv2
import mediapipe as mp
import numpy as np
import winsound  # For beeping (Windows only)
import time

# Constants
EYE_CLOSED_THRESHOLD = 0.2  # EAR threshold for closed eyes
EYE_CLOSED_CONSEC_FRAMES = 10  # How many frames eyes must be closed to trigger
DISTRACTION_BEEP_DELAY = 5  # Seconds before beeping when distracted

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Indices for left and right eye landmarks
LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380]

def eye_aspect_ratio(eye_landmarks, landmarks):
    """Calculate Eye Aspect Ratio (EAR) for eye openness detection."""
    # Get 2D coordinates for eye landmarks
    eye_points = np.array([(landmarks[i].x, landmarks[i].y) for i in eye_landmarks])
    
    # Compute vertical distances
    vert1 = np.linalg.norm(eye_points[1] - eye_points[5])
    vert2 = np.linalg.norm(eye_points[2] - eye_points[4])
    
    # Compute horizontal distance
    horiz = np.linalg.norm(eye_points[0] - eye_points[3])
    
    # Calculate EAR
    ear = (vert1 + vert2) / (2.0 * horiz)
    return ear

def get_bounding_box(landmarks, indices, frame_width, frame_height, padding=20):
    """Calculate a bounding box from a set of landmark indices with padding."""
    x_coords = [landmarks[i].x for i in indices]
    y_coords = [landmarks[i].y for i in indices]
    
    x_min = min(x_coords) * frame_width
    y_min = min(y_coords) * frame_height
    x_max = max(x_coords) * frame_width
    y_max = max(y_coords) * frame_height
    
    # Apply padding with boundary checks
    x_min = max(0, x_min - padding)
    y_min = max(0, y_min - padding)
    x_max = min(frame_width, x_max + padding)
    y_max = min(frame_height, y_max + padding)
    
    return int(x_min), int(y_min), int(x_max), int(y_max)

def detect_distraction(landmarks, frame_width, frame_height, eye_closed_counter):
    """Detects distraction based on head position and eye closure."""
    # Check head position (nose)
    nose_x = landmarks[1].x * frame_width
    central_region_start = frame_width * 0.35
    central_region_end = frame_width * 0.65
    
    # Check eye closure
    left_ear = eye_aspect_ratio(LEFT_EYE_INDICES, landmarks)
    right_ear = eye_aspect_ratio(RIGHT_EYE_INDICES, landmarks)
    avg_ear = (left_ear + right_ear) / 2.0
    
    eyes_closed = avg_ear < EYE_CLOSED_THRESHOLD
    
    # Determine distraction state
    head_distracted = not (central_region_start <= nose_x <= central_region_end)
    eyes_distracted = eye_closed_counter >= EYE_CLOSED_CONSEC_FRAMES
    
    return head_distracted or eyes_distracted, eyes_closed

def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open video capture.")
        return

    distracted_start_time = None
    eye_closed_counter = 0
    last_beep_time = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture frame.")
            break

        frame_height, frame_width = frame.shape[:2]
        
        # Convert to RGB and process
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = face_mesh.process(rgb_frame)

        if result.multi_face_landmarks:
            for face_landmarks in result.multi_face_landmarks:
                landmarks = face_landmarks.landmark

                # Draw face bounding box
                face_indices = [10, 152, 234, 454]
                x1, y1, x2, y2 = get_bounding_box(landmarks, face_indices, frame_width, frame_height)

                # Detect distraction
                distracted, eyes_closed = detect_distraction(landmarks, frame_width, frame_height, eye_closed_counter)
                
                # Update eye closed counter
                if eyes_closed:
                    eye_closed_counter += 1
                else:
                    eye_closed_counter = 0

                # Display status
                status = "Distracted" if distracted else "Attentive"
                cv2.putText(frame, status, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
                
                # Add eye status
                eye_status = "Eyes Closed" if eyes_closed else "Eyes Open"
                cv2.putText(frame, eye_status, (50, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

                # Change bounding box color and beep if distracted
                if distracted:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)  # Red box
                    if distracted_start_time is None:
                        distracted_start_time = time.time()
                    elif time.time() - distracted_start_time >= DISTRACTION_BEEP_DELAY:
                        current_time = time.time()
                        if current_time - last_beep_time >= DISTRACTION_BEEP_DELAY:
                            try:
                                winsound.Beep(2500, 500)  # Beep at 2500Hz for 500ms
                                last_beep_time = current_time
                            except:
                                print("Beep failed (Windows only)")
                else:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Green box
                    distracted_start_time = None

        cv2.imshow("Attention Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()