import cv2
import torch
import threading
import time
from datetime import datetime

class AttentionService:
    _instance = None
    active_sessions = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AttentionService, cls).__new__(cls)
            cls._instance.model = torch.load(
                'D:/Coding/Webapp/focusmeet/fyp-backend/src/AI-Model/facemodel.pth'
            )
            cls._instance.model.eval()
        return cls._instance

    def start_for_user(self, user_id):
        if user_id not in self.active_sessions:
            self.active_sessions[user_id] = {
                'running': True,
                'cap': cv2.VideoCapture(0),
                'last_update': datetime.now()
            }
            threading.Thread(
                target=self._monitor_loop,
                args=(user_id,),
                daemon=True
            ).start()

    def stop_for_user(self, user_id):
        if user_id in self.active_sessions:
            self.active_sessions[user_id]['running'] = False
            self.active_sessions[user_id]['cap'].release()
            del self.active_sessions[user_id]

    def _preprocess(self, frame):
        # Adjust based on your model's requirements
        frame = cv2.resize(frame, (224, 224))
        frame = torch.from_numpy(frame).permute(2, 0, 1).float() / 255.0
        return frame.unsqueeze(0)

    def _monitor_loop(self, user_id):
        while self.active_sessions.get(user_id, {}).get('running', False):
            ret, frame = self.active_sessions[user_id]['cap'].read()
            if ret:
                input_tensor = self._preprocess(frame)
                with torch.no_grad():
                    output = self.model(input_tensor)
                    is_attentive = torch.argmax(output).item() == 1
                
                # Send update to your backend every 5 seconds
                if (datetime.now() - self.active_sessions[user_id]['last_update']).seconds >= 5:
                    self._send_update(user_id, is_attentive)
                    self.active_sessions[user_id]['last_update'] = datetime.now()
            
            time.sleep(0.1)  # Adjust sampling rate

    def _send_update(self, user_id, status):
        # Implement your actual API call here
        print(f"User {user_id} attention: {'Attentive' if status else 'Distracted'}")