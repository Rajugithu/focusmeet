const Response = require("../models/responseModel");
const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const { Parser } = require("json2csv");

const ATTENTION_STATES = {
  ATTENTIVE: "attentive",
  DISTRACTED: "distracted",
};

const userSessions = new Map();

// Get all responses from database
exports.getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find().sort({ timestamp: -1 });
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

// Get responses by meeting ID
exports.getResponsesByMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const responses = await Response.find({ meetingId }).sort({
      timestamp: -1,
    });
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching meeting responses:", error);
    res.status(500).json({ error: "Failed to fetch meeting responses" });
  }
};

// Get responses by user ID
exports.getResponsesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const responses = await Response.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching user responses:", error);
    res.status(500).json({ error: "Failed to fetch user responses" });
  }
};

// Process frame and save data to DB
exports.processFrame = async (
  req,
  res,
  io,
  distractedStudents,
  userMeetingMap
) => {
  try {
    const {
      "meeting-id": meetingId,
      "user-id": userId,
      "user-name": name = "Unknown",
    } = req.headers;

    if (!req.file || !meetingId || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required headers or file" });
    }

    const formData = new FormData();
    formData.append("frame", fs.createReadStream(req.file.path), {
      filename: "frame.jpg",
      contentType: "image/jpeg",
    });

    const aiResponse = await axios.post(
      "http://localhost:5001/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Meeting ${meetingId}`,
        },
        timeout: 10000,
      }
    );

    console.log("AI Response:", JSON.stringify(aiResponse.data, null, 2));

    const { isAttentive, confidence = 0.8 } = aiResponse.data;
    const currentState = isAttentive
      ? ATTENTION_STATES.ATTENTIVE
      : ATTENTION_STATES.DISTRACTED;
    const timestamp = new Date();

    if (!userSessions.has(userId)) {
      userSessions.set(userId, {
        currentState,
        distractionCount: 0,
        lastStateChange: timestamp,
        lastSavedState: null,
        notified5SecDistraction: false,
        lastNotificationTime: null,
      });
    }

    const userSession = userSessions.get(userId);
    let shouldSave = false;

    // State change logic
    if (userSession.currentState !== currentState) {
      const previousStateChange = userSession.lastStateChange;
      const stateDuration = (timestamp - previousStateChange) / 1000;

      userSession.currentState = currentState;
      userSession.lastStateChange = timestamp;

      if (currentState === ATTENTION_STATES.DISTRACTED) {
        userSession.distractionCount += 1;

        // Immediate notification to teacher
        io.to(`teacher-${meetingId}`).emit("immediateTeacherNotification", {
          studentId: userId,
          studentName: name,
          meetingId,
          message: `${name} is distracted (${Math.round(confidence * 100)}% confidence)`,
          severity: confidence > 0.7 ? "high" : "medium",
          timestamp: timestamp.toISOString(),
          confidence: confidence,
        });

        // Student warning
        io.to(`user-${userId}`).emit("distractionWarning", {
          message: "You appear distracted - please focus!",
          severity: "medium",
          timestamp: timestamp.toISOString(),
        });

        // Rate-limited comprehensive notification (max once every 5 seconds)
        if (
          !userSession.lastNotificationTime ||
          timestamp - userSession.lastNotificationTime > 5000
        ) {
          io.to(`teacher-${meetingId}`).emit("teacherNotification", {
            studentId: userId,
            studentName: name,
            meetingId,
            message: `${name} is distracted (${userSession.distractionCount} times)`,
            severity:
              userSession.distractionCount >= 15
                ? "high"
                : userSession.distractionCount >= 10
                ? "medium"
                : "low",
            timestamp: timestamp.toISOString(),
            confidence: confidence,
          });
          userSession.lastNotificationTime = timestamp;
        }
      } else {
        // Reset flags when attentive
        userSession.notified5SecDistraction = false;

        // Notify attention recovery
        io.to(`teacher-${meetingId}`).emit("teacherNotification", {
          studentId: userId,
          meetingId,
          message: `${name} is now attentive`,
          confidence: confidence,
          timestamp: timestamp.toISOString(),
          isAttentive: true,
        });

        io.to(`user-${userId}`).emit("attentionUpdate", {
          meetingId,
          isAttentive: true,
          confidence: confidence,
          faceDetected: true,
        });
      }

      shouldSave = true;
    }

    // Handle prolonged distraction (unchanged)
    if (currentState === ATTENTION_STATES.DISTRACTED) {
      const distractedDuration =
        (timestamp - userSession.lastStateChange) / 1000;

      if (distractedDuration >= 5 && !userSession.notified5SecDistraction) {
        io.to(`teacher-${meetingId}`).emit("teacherNotification", {
          studentId: userId,
          meetingId,
          message: `${name} has been distracted for ${Math.floor(
            distractedDuration
          )} seconds`,
          confidence: confidence,
          timestamp: timestamp.toISOString(),
          duration: distractedDuration,
        });

        io.to(`user-${userId}`).emit("distractionWarning", {
          message: `Warning: You've been distracted for ${Math.floor(
            distractedDuration
          )} seconds`,
          severity: "high",
          timestamp: timestamp.toISOString(),
        });

        userSession.notified5SecDistraction = true;
      }

      if (distractedDuration >= 60) {
        shouldSave = true;
      }
    }

    // Save to DB if needed
    let responseData = null;
    if (shouldSave) {
      const stateDuration = (timestamp - userSession.lastStateChange) / 1000;
      responseData = await Response.create({
        userId,
        name,
        meetingId,
        isAttentive,
        confidence,
        distractionCount: userSession.distractionCount,
        timestamp: timestamp.toISOString(),
        stateDuration,
      });
      userSession.lastSavedState = currentState;
    }

    // Cleanup
    fs.unlink(req.file.path, () => {});

    res.status(200).json(
      responseData || {
        userId,
        name,
        meetingId,
        isAttentive,
        confidence,
        distractionCount: userSession.distractionCount,
        timestamp: timestamp.toISOString(),
        message: "State unchanged - not saved to DB",
      }
    );
  } catch (error) {
    console.error("Frame processing error:", error);
    if (req.file?.path) fs.unlink(req.file.path, () => {});

    const status =
      error.response?.status || (error.code === "ECONNABORTED" ? 504 : 500);
    const message =
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "AI server timeout"
        : "Processing failed");

    res.status(status).json({
      error: message,
      details: status === 500 ? error.message : undefined,
    });
  }
};

// Session cleanup
setInterval(() => {
  const now = new Date();
  const staleThreshold = 30 * 60 * 1000;

  for (const [userId, session] of userSessions.entries()) {
    if (now - session.lastStateChange > staleThreshold) {
      userSessions.delete(userId);
    }
  }
}, 3600000);

// Reset distraction count
exports.resetDistractionCount = async (req, res) => {
  const meetingId = req.headers["meetingid"] || req.headers["meeting-id"];
  const userId = req.headers["userid"] || req.headers["user-id"];

  if (!meetingId || !userId) {
    return res.status(400).json({
      error: "Required headers: meetingid/meeting-id and userid/user-id",
      received: {
        headers: req.headers,
        meetingId,
        userId,
      },
    });
  }

  try {
    const updatedResponse = await Response.findOneAndUpdate(
      { meetingId, userId },
      { $set: { wh: 0 } },
      { new: true }
    );

    if (!updatedResponse) {
      return res.status(404).json({
        error: "User session not found",
        meetingId,
        userId,
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error resetting distraction count:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// Export responses as CSV
exports.exportResponsesCSV = async (req, res) => {
  try {
    const responses = await Response.find().lean();
    if (!responses || responses.length === 0) {
      return res.status(404).send("No responses found");
    }

    const fields = [
      "userId",
      "name",
      "meetingId",
      "isAttentive",
      "confidence",
      "distractionCount",
      "timestamp",
      "stateDuration",
    ];

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(responses);

    res.header("Content-Type", "text/csv");
    res.attachment("responses.csv");

    return res.send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).send("Failed to export responses as CSV");
  }
};
