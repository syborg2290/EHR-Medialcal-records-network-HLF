const express = require("express");
const { v4: uuidv4 } = require("uuid");
const isAuthorize = require("../util/isAuthorizedAdmin");
const { contract } = require("../contract");

const routes = express.Router();

routes.post("/createreport", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    ["CreateNewReport", req.body.patient_id, req.body.ref_doctor],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(payload.toString());
      }
    }
  );
});

routes.put("/starttreatment", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    ["StartTreatment", req.headers.treatment_id, req.body.supervisor],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `successfully started the treatment`,
        });
      }
    }
  );
});

// createHospital route
routes.post("/create-hospital", async (req, res) => {
  const isAuthorizedToAccess = await isAuthorize(req.headers.authorization);
  if (isAuthorizedToAccess) {
    contract(
      req.body.clientId,
      "INVOKE",
      [
        "CreateHospital",
        uuidv4(),
        req.body.name,
        req.body.email,
        req.body.licenseNo,
        req.body.phoneNumber,
        req.body.address,
      ],
      (err, payload) => {
        if (err) {
          console.log(err);
          res.status(500).json(err);
        } else {
          res.status(200).json({
            message: `Successfully created hospital ${req.body.name}`,
            data: payload,
          });
        }
      }
    );
  } else {
    res.status(500).json({ message: "unauthorized!" });
  }
});

// getAllHospitals route
routes.get("/hospitals", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetAllHospitals"], (err, payload) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const hospitals = JSON.parse(payload);
      res.status(200).json(hospitals);
    }
  });
});

module.exports = routes;
