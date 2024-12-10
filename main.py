import cv2
import numpy as np
import tensorflow as tf

# Load the trained model
model = tf.keras.models.load_model('vgg16_face_model.keras')
class_names = ['Closed_eyes', 'Open_Eyes'] 

# Function to preprocess the webcam frame
def preprocess_frame(frame):
    frame_resized = cv2.resize(frame, (224, 224))
    frame_normalized = frame_resized / 255.0
    return frame_normalized[np.newaxis, ...]

# Function to check if the frame is blank (camera covered)
def is_blank_frame(frame, threshold=10):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    mean_pixel_value = np.mean(gray)
    return mean_pixel_value < threshold  # Adjust threshold if needed

# Initialize the webcam
cap = cv2.VideoCapture(0)  # Use 0 for the default camera
if not cap.isOpened():
    print("Error: Could not access the camera.")
    exit()

# Real-time inference loop
while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame. Exiting...")
        break

    # Check if the frame is blank (camera covered)
    if is_blank_frame(frame):
        print("Camera covered or frame too dark, skipping detection")
        continue  # Skip the detection step if the frame is too dark

    # Preprocess the frame
    processed_frame = preprocess_frame(frame)

    # Predict the class
    predictions = model.predict(processed_frame)
    predicted_class = class_names[np.argmax(predictions)]

    # Display the prediction on the frame
    cv2.putText(frame, f"Prediction: {predicted_class}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    
    # Show the frame with prediction
    cv2.imshow("Real-Time Testing", frame)

    # Break the loop on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
