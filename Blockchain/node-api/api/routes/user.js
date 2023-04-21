const express = require("express");
const { registerUser } = require("../../test-client/registerUser");
routes = express.Router();

routes.get("/register", async (req, res) => {
  const res = await registerUser();
  if (!res) {
    res.status(500).json("Something went wrong!");
  } else {
    const jsonRes = JSON.parse(res);
    res.status(200).json(jsonRes);
  }
});

module.exports = routes;
