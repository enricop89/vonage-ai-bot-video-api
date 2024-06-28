const express = require("express");
const app = express();
const router = express.Router();
const { createSessionandToken, generateToken } = require("../vonage/index");

router.get("/room/:roomName", async (req, res) => {
  const { roomName } = req.params;
  console.log("Room exists", app.get(roomName));
  if (app.get(roomName)) {
    const sessionId = app.get(roomName);
    const cred = generateToken(sessionId, "publisher");
    console.log("Room exists", cred);
    res.render("index", {
      apiKey: cred.apiKey,
      sessionId: sessionId,
      token: cred.token,
      roomName: roomName,
    });
  } else {
    const roomOptions = app.get(`${roomName}-Options`);
    const data = await createSessionandToken(
      roomName,
      "publisher",
      roomOptions
    );
    console.log("Room does not exist", data);

    app.set(roomName, data.sessionId);
    // serve the index page
    res.render("index", {
      apiKey: data.apiKey,
      sessionId: data.sessionId,
      token: data.token,
      roomName: roomName,
    });
  }
});

router.post("/room", async (req, res) => {
  const { recording, meeting_type, expiryDate } = req.body;
  console.log("Room options", req.body);
  // This code should handle the instant or long term meeting generation, recording, etc.
  const randomRoomName = Math.random().toString(36).substring(7);
  app.set(`${randomRoomName}-Options`, { recording, meeting_type, expiryDate });
  res.send({
    url: process.env.APP_SUBDOMAIN + "/api/video/room/" + randomRoomName,
  });
});

module.exports = router;
