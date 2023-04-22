const express = require("express");
const fs = require("fs");
const registerUser = require("../../test-client/registerUser");
const registerAdmin = require("../../test-client/enrollAdmin");
const path = require("path");
routes = express.Router();

routes.post("/register-admin", async (req, res) => {
  const response = await registerAdmin();
  if (!response) {
    res.status(500).json("Something went wrong!");
  } else {
    res.status(200).send(response);
  }
});

routes.post("/register-user", async (req, res) => {
  const response = await registerUser(req.body.client);
  if (!response) {
    res.status(500).json("Something went wrong!");
  } else {
    const privateKey = response.credentials.privateKey;
    const privateKeyRegex =
      /-----BEGIN PRIVATE KEY-----(.*)-----END PRIVATE KEY-----/s;
    const extractedPrivateKey = privateKey.match(privateKeyRegex)[1].trim();
    res
      .status(200)
      .json({ privatekey: extractedPrivateKey, clientId: response.client });
  }
});

routes.post("/login", async (req, res) => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "../../wallet") + `/${req.body.id}.id`,
      "utf-8"
    );

    const privateKey = JSON.parse(data)["credentials"]["privateKey"];

    const privateKeyRegex =
      /-----BEGIN PRIVATE KEY-----(.*)-----END PRIVATE KEY-----/s;
    const extractedPrivateKey = privateKey.match(privateKeyRegex)[1].trim();
    if (extractedPrivateKey === req.body.privateKey) {
      res.status(200).json({ message: "success", id: req.body.id });
    } else {
      res.status(500).json("Unauthorize!");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = routes;
