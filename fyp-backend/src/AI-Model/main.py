import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)


model_path = "facemodel.pth"

def get_bounding_box(landmarks, indices, frame_width, frame_height, padding=20):
    """Calculate a bounding box from a set of landmark indices with padding."""
    x_min = min([landmarks[i].x for i in indices]) * frame_width
    y_min = min([landmarks[i].y for i in indices]) * frame_height
    x_max = max([landmarks[i].x for i in indices]) * frame_width
    y_max = max([landmarks[i].y for i in indices]) * frame_height
    
    # Increase box size by adding padding
    x_min, y_min = max(0, x_min - padding), max(0, y_min - padding)
    x_max, y_max = min(frame_width, x_max + padding), min(frame_height, y_max + padding)
    
    return int(x_min), int(y_min), int(x_max), int(y_max)

def detect_head_movement(landmarks, frame_width, frame_height):
    """Detects head movement based on nose position."""
    nose_x = landmarks[1].x * frame_width
    nose_y = landmarks[1].y * frame_height

    if nose_x < frame_width * 0.4:
        return "Head turned LEFT"
    elif nose_x > frame_width * 0.6:
        return "Head turned RIGHT"

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = face_mesh.process(rgb_frame)

    frame_height, frame_width, _ = frame.shape

    if result.multi_face_landmarks:
        for face_landmarks in result.multi_face_landmarks:
            landmarks = face_landmarks.landmark

            # Draw face bounding box
            face_indices = [10, 152, 234, 454]
            x1, y1, x2, y2 = get_bounding_box(landmarks, face_indices, frame_width, frame_height, padding=20)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Green box for face

            # Detect head movement
            head_position = detect_head_movement(landmarks, frame_width, frame_height)

            # Display movement information
            cv2.putText(frame, head_position, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

    cv2.imshow("Face Movement Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
