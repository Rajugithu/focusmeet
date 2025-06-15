const express = require("express");
const router = express.Router();
const responseController = require("../../controllers/responseController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

module.exports = (io, distractedStudents, userMeetingMap) => {
  // Frame processing endpoint
  router.post("/process-frame", upload.single("frame"), (req, res) =>
    responseController.processFrame(req, res, io, distractedStudents, userMeetingMap)
  );

  // Get all responses endpoint
  router.get("/responses", (req, res) =>
    responseController.getAllResponses(req, res)
  );

  // Get responses by meeting ID endpoint
  router.get("/responses/:meetingId", (req, res) =>
    responseController.getResponsesByMeeting(req, res)
  );

  // Get responses by user ID endpoint
  router.get("/responses/user/:userId", (req, res) =>
    responseController.getResponsesByUser(req, res)
  );

  // Reset distraction count endpoint
  router.post("/reset-distraction-count", responseController.resetDistractionCount);

  return router;
};
