const { Auth } = require("@vonage/auth");
const { Video, ArchiveMode } = require("@vonage/video");

const applicationId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY_PATH;

if (!applicationId || !privateKey) {
  console.error("You must define APP_ID and PRIVATE_KEY_PATH in the .env file");
  process.exit(1);
}

const credentials = new Auth({
  applicationId: applicationId,
  privateKey: privateKey,
});
const options = {};
const videoClient = new Video(credentials, options);

const createSessionandToken = async (options) => {
  const session = await videoClient.createSession({ mediaMode: "enabled", ArchiveMode: options.recording });
  const sessionId = session.sessionId;
  const token = videoClient.generateClientToken(sessionId);
  return { sessionId: sessionId, token: token, apiKey: applicationId };
};

const generateToken = (sessionId, role) => {
  const token = role
    ? videoClient.generateClientToken(sessionId, { data: role })
    : videoClient.generateClientToken(sessionId);
  return { token: token, apiKey: applicationId };
};

const getCredentials = async (session = null, role) => {
  console.log("gen creds for " + role);
  const data = await createSessionandToken(session, role);
  let sessionId = data.sessionId;
  const token = data.token;
  return { sessionId: sessionId, token: token, apiKey: applicationId };
};

module.exports = {
  getCredentials,
  generateToken,
  createSessionandToken,
};
