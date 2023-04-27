const express = require("express");
const { contract } = require("../contract");

const { v4: uuidv4 } = require("uuid");
const routes = express.Router();

routes.post("/register", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "RegisterPatient",
      uuidv4(),
      req.body.fname,
      req.body.lname,
      req.body.boodType,
      req.body.age,
      req.body.consenter,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: "successfully registered",
        });
      }
    }
  );
});

routes.get("/all", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetAllConsents"], (err, payload) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const patients = JSON.parse(payload);
      res.status(200).json(patients);
    }
  });
});

routes.get("/patients-count", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetAllConsents"], (err, payload) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      const hospitals = JSON.parse(payload);
      res.status(200).json(hospitals.length);
    }
  });
});

routes.put("/giveconsent", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "UpdateTempConsent",
      req.body.aadhaar,
      req.body.type,
      req.body.to,
      req.body.till,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `successfully given consent to ${req.body.to} till ${req.body.till}`,
        });
      }
    }
  );
});

routes.put("/permconsent", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    ["UpdatePermConsent", req.body.aadhaar, req.body.type, req.body.to],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `successfully given consent to ${req.body.to} till ${req.body.till}`,
        });
      }
    }
  );
});

routes.put("/giveconsent", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "UpdateTempConsent",
      req.body.aadhaar,
      req.body.type,
      req.body.to,
      req.body.till,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `successfully given consent to ${req.body.to} till ${req.body.till}`,
        });
      }
    }
  );
});

routes.get("/test", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetTest"], (err, payload) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const test = JSON.parse(payload);
      res.status(200).json(test);
    }
  });
});

routes.get("/report", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetReport"], (err, payload) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const test = JSON.parse(payload);
      res.status(200).json(test);
    }
  });
});

routes.get("/treatment", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetTreatment"], (err, payload) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const test = JSON.parse(payload);
      res.status(200).json(test);
    }
  });
});

routes.get("/drugs", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetDrugs"], (err, payload) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const test = JSON.parse(payload);
      res.status(200).json(test);
    }
  });
});

module.exports = routes;
