const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { contract } = require("../contract");
const isAuthorize = require("../util/isAuthorizedAdmin");
routes = express.Router();

routes.put("/report/addcomment", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "AddCommentsToReport",
      req.body.report_id,
      req.body.comment,
      req.body.ref_doctor,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `Successfuly added comment to report ${req.body.report_id}`,
        });
      }
    }
  );
});

routes.post("/report/reftest", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "RefTest",
      req.body.patient_id,
      req.body.report_id,
      req.body.labID,
      req.body.name,
      req.body.ref_doctor,
      req.body.type_of_test,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `Successfuly created test of type ${req.body.type_of_test}`,
          test_id: payload.toString(),
        });
      }
    }
  );
});
routes.post("/report/reftreatment", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "RefTreatment",
      req.body.patient_id,
      req.body.report_id,
      req.body.ref_doctor,
      req.body.name,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `Successfuly created treatment of name ${req.body.name}`,
          test_id: payload.toString(),
        });
      }
    }
  );
});

routes.post("/report/presdrugs", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "PrescribeDrugs",
      req.body.patient_id,
      req.body.pharamacyID,
      req.body.report_id,
      req.body.ref_doctor,
      req.body.drugs,
      req.body.doses,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `Successfuly prescribe drugs`,
          drug_id: payload.toString(),
        });
      }
    }
  );
});

routes.put("/treatment/addcomment", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "AddCommentsToTreatment",
      req.body.treatment_id,
      req.body.supervisor,
      req.body.comment,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({
          message: `Successfuly commented on treatment`,
        });
      }
    }
  );
});

routes.put("/treatment/addmediafile", (req, res) => {
  contract(
    req.body.clientId,
    "INVOKE",
    [
      "AddMediaToTreatment",
      req.body.treatment_id,
      req.body.supervisor,
      req.body.no_of_mediafile,
    ],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(JSON.parse(payload));
      }
    }
  );
});

// createDoctor route
routes.post("/doctor", async (req, res) => {
  const isAuthorizedToAccess = await isAuthorize(req.headers.authorization);
  if (isAuthorizedToAccess) {
    contract(
      req.body.clientId,
      "INVOKE",
      [
        "CreateDoctor",
        uuidv4(),
        req.body.name,
        req.body.email,
        req.body.specialty,
        req.body.licenseNo,
        req.body.phoneNumber,
        req.body.address,
      ],
      (err, payload) => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json({
            message: `Successfully created doctor ${req.body.name}`,
            data: payload,
          });
        }
      }
    );
  } else {
    res.status(500).json({ message: "unauthorized!" });
  }
});

// getAllDoctors route
routes.get("/doctors", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetAllDoctors"], (err, payload) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const doctors = JSON.parse(payload);
      res.status(200).json(doctors);
    }
  });
});

routes.get("/doctors-count", (req, res) => {
  contract(req.query.clientId, "QUERY", ["GetAllDoctors"], (err, payload) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      const hospitals = JSON.parse(payload);
      res.status(200).json(hospitals.length);
    }
  });
});

routes.get("/doctor", (req, res) => {
  const doctorID = req.headers.doctorid;
  contract(
    req.query.clientId,
    "QUERY",
    ["GetDoctorByID", doctorID],
    (err, payload) => {
      if (err) {
        res.status(500).json(err);
      } else {
        const doctor = JSON.parse(payload);
        res.status(200).json(doctor);
      }
    }
  );
});

module.exports = routes;
