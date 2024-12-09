import cv2
import numpy as np
import tensorflow as tf
import mediapipe as mp

# Load the trained model
model = tf.keras.models.load_model('eye_state_model.h5')

# Initialize MediaPipe FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1)

# Set the image dimensions (should be the same as used during training)
image_width, image_height = 640, 480

# Function to extract eye landmarks from a frame
def extract_eye_landmarks(image):
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_image)
    
    if results.multi_face_landmarks:
        landmarks = []
        for face_landmarks in results.multi_face_landmarks:
            eye_indices = [33, 133, 159, 145, 362, 263, 386, 374]
            for idx in eye_indices:
                x = face_landmarks.landmark[idx].x * image_width
                y = face_landmarks.landmark[idx].y * image_height
                landmarks.extend([x, y])
        return np.array(landmarks)
    else:
        return None

# Start video capture
cap = cv2.VideoCapture(0)  # Use 0 for webcam, or provide video file path

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Extract eye landmarks
    landmarks = extract_eye_landmarks(frame)
    
    if landmarks is not None:
        # Normalize the landmarks (if necessary)
        landmarks = landmarks / np.array([image_width, image_height] * 8)
        
        # Reshape landmarks for the model input (flattened)
        landmarks = landmarks.reshape((1, -1))
        
        # Predict using the trained model
        prediction = model.predict(landmarks)
        predicted_class = np.argmax(prediction)  # Get the class with the highest probability
        
        # Display the result on the frame
        label = f'Predicted: {predicted_class}'  # Display the predicted class
        cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    
    # Show the frame with predictions
    cv2.imshow('Real-Time Eye Landmark Detection', frame)
    
    # Break the loop on 'Esc' key press
    if cv2.waitKey(1) & 0xFF == 27:  # 27 is the keycode for 'Esc'
        break

# Release the video capture object and close the window
cap.release()
cv2.destroyAllWindows()
