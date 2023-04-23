package main

import (
	"encoding/json"
	"fmt"
	. "fmt"
	"time"
)

func (c *Chaincode) CreateNewReport(ctx CustomTransactionContextInterface, patientID, refDoctor string) (string, error) {
	if ctx.GetData() == nil {
		return "", Errorf("Patient of ID %v doesn't exists", patientID)
	}
	id := REPORT + getSafeRandomString(ctx.GetStub())
	report := Report{
		DocTyp:      REPORT,
		ID:          id,
		PatientID:   patientID,
		Status:      "0",
		RefDoctorID: refDoctor,
		Comments:    make(map[string]string),
		CreateTime:  time.Now().Unix(),
		UpdateTime:  time.Now().Unix(),
	}
	reportAsByte, _ := json.Marshal(report)
	return report.ID, ctx.GetStub().PutState(id, reportAsByte)
}

func (c *Chaincode) StartTreatment(ctx CustomTransactionContextInterface, treatmentID, supervisor string) error {
	if ctx.GetData() == nil {
		return Errorf("Treatment with ID %v doesn't exists", treatmentID)
	}
	var treatment Treatment
	json.Unmarshal(ctx.GetData(), &treatment)
	if treatment.Status != 0 {
		return Errorf("Cannot start allready started treatment")
	}
	treatment.Supervisor = supervisor
	treatment.Status = 1
	treatment.UpdateTime = time.Now().Unix()

	treatmentAsByte, _ := json.Marshal(treatment)

	return ctx.GetStub().PutState(treatment.ID, treatmentAsByte)
}

// Create a new hospital
func (c *Chaincode) CreateHospital(ctx CustomTransactionContextInterface, id string, name string, email string, licenseNo string, phoneNumber string, address string) error {
	// Check if the hospital with the given ID already exists
	exists, err := c.hospitalExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the hospital with ID %s already exists", id)
	}

	// Create a new hospital struct
	hospital := Hospital{
		ID:          id,
		Name:        name,
		Email:       email,
		LicenseNo:   licenseNo,
		PhoneNumber: phoneNumber,
		Address:     address,
		CreatedAt:   time.Now().Unix(),
		UpdatedAt:   time.Now().Unix(),
	}

	// Convert the hospital struct to JSON format
	hospitalJSON, err := json.Marshal(hospital)
	if err != nil {
		return err
	}

	// Save the hospital to the world state
	err = ctx.GetStub().PutState(id, hospitalJSON)
	if err != nil {
		return err
	}

	return nil
}

// hospitalExists returns true if the hospital with given ID exists in the ledger
func (c *Chaincode) hospitalExists(ctx CustomTransactionContextInterface, id string) (bool, error) {
	hospitalJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, err
	}
	return hospitalJSON != nil, nil
}

// getAllHospitals returns all hospitals in the ledger
func (s *Chaincode) GetAllHospitals(ctx CustomTransactionContextInterface) ([]*Hospital, error) {
	hospitalIterator, err := ctx.GetStub().GetStateByPartialCompositeKey(HOSPITAL, []string{})
	if err != nil {
		return nil, fmt.Errorf("failed to get all hospitals: %v", err)
	}
	defer hospitalIterator.Close()

	var hospitals []*Hospital
	for hospitalIterator.HasNext() {
		hospitalResult, err := hospitalIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate over all hospitals: %v", err)
		}

		hospital := new(Hospital)
		err = json.Unmarshal(hospitalResult.GetValue(), hospital)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal hospital data: %v", err)
		}

		hospitals = append(hospitals, hospital)
	}

	return hospitals, nil
}
