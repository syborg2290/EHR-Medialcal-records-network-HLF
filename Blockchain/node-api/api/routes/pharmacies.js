const express = require("express");
const { v4: uuidv4 } = require("uuid");
const isAuthorize = require("../util/isAuthorizedAdmin");
const { contract } = require("../contract");
routes = express.Router();

routes.put("/givedrugs", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    ["GiveDrugs", req.headers.drug_id],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: "DONE",
        });
      }
    }
  );
});

// createPharamcy route
routes.post("/pharmacy", async (req, res) => {
  const isAuthorizedToAccess = await isAuthorize(req.headers.authorization);
  if (isAuthorizedToAccess) {
    contract(
      req.body.clientId,
      "INVOKE",
      [
        "CreatePharmacy",
        uuidv4(),
        req.body.name,
        req.body.email,
        req.body.licenseNo,
        req.body.phoneNumber,
        req.body.address,
      ],
      (err, payload) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json({
            message: `Successfully created pharmacy ${req.body.name}`,
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
routes.get("/phramacies", (req, res) => {
  contract(
    req.query.clientId,
    "QUERY",
    ["GetAllPharmacies"],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        const doctors = JSON.parse(payload);
        res.status(200).json(doctors);
      }
    }
  );
});

routes.get("/phramacies-count", (req, res) => {
  contract(
    req.query.clientId,
    "QUERY",
    ["GetAllPharmacies"],
    (err, payload) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        if (payload) {
          const hospitals = JSON.parse(payload);
          res.status(200).json(hospitals.length);
        }
      }
    }
  );
});

module.exports = routes;
