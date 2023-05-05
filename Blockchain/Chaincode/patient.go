package main

import (
	"encoding/json"
	"fmt"
	. "fmt"
	"time"
)

func (c *Chaincode) RegisterPatient(ctx CustomTransactionContextInterface, patientID, FirstName, LastName, BloodType, DOB, permCon string) error {
	existing := ctx.GetData()

	if existing != nil {
		return Errorf("Patient ID already exists")
	}
	consent := Consent{
		DocTyp:              CONSENT,
		ID:                  patientID,
		FirstName:           FirstName,
		LastName:            LastName,
		BloodType:           BloodType,
		DOB:                 DOB,
		PermanentConsenters: make(map[string]bool),
		TemporaryConsenters: make(map[string]int64),
	}
	consent.PermanentConsenters[patientID] = true
	consent.PermanentConsenters[permCon] = true

	consentAsByte, _ := json.Marshal(consent)

	return ctx.GetStub().PutState(patientID, consentAsByte)
}

func (c *Chaincode) GetAllConsents(ctx CustomTransactionContextInterface) ([]*Consent, error) {
	// Create a new query string to get all CONSENT documents
	queryString := fmt.Sprintf(`{"selector":{"docTyp":"%s"}}`, CONSENT)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Create a slice to hold the results
	var consents []*Consent

	// Iterate over the query results and deserialize each document
	for queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Consent struct
		var consent Consent
		err = json.Unmarshal(queryResult.Value, &consent)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize consent: %v", err)
		}

		// Add the consent to the results slice
		consents = append(consents, &consent)
	}

	return consents, nil
}

func (c *Chaincode) UpdateTempConsent(ctx CustomTransactionContextInterface, consentID, typeOfUpdate, to string, till int64) error {
	existing := ctx.GetData()
	if existing == nil {
		return Errorf("Consent with key %v doesn't exists")
	}
	var consent Consent
	json.Unmarshal(existing, &consent)
	if typeOfUpdate == "ADD" {
		consent.TemporaryConsenters[to] = till
	} else if typeOfUpdate == "REMOVE" {
		if _, ok := consent.TemporaryConsenters[to]; ok {
			delete(consent.TemporaryConsenters, to)
		}
	}
	consentAsByte, _ := json.Marshal(consent)

	return ctx.GetStub().PutState(consent.ID, consentAsByte)
}

func (c *Chaincode) UpdatePermConsent(ctx CustomTransactionContextInterface, consentID, typeOfUpdate, to string, till int64) error {
	existing := ctx.GetData()
	if existing == nil {
		return Errorf("Consent with key %v doesn't exists")
	}
	var consent Consent
	json.Unmarshal(existing, &consent)
	if typeOfUpdate == "ADD" {
		consent.PermanentConsenters[to] = true
	} else if typeOfUpdate == "REMOVE" {
		if _, ok := consent.PermanentConsenters[to]; ok {
			delete(consent.PermanentConsenters, to)
		}
	}
	consentAsByte, _ := json.Marshal(consent)

	return ctx.GetStub().PutState(consent.ID, consentAsByte)
}

func (c *Chaincode) getByte(ctx CustomTransactionContextInterface, key string) ([]byte, error) {
	AsByte, _ := ctx.GetStub().GetState(key)
	if AsByte == nil {
		return []byte{}, fmt.Errorf("No state with key %v", key)
	}
	return AsByte, nil
}

func (c *Chaincode) checkConsent(ctx CustomTransactionContextInterface, consentID, checkFor string) bool {
	consentAsByte, err := c.getByte(ctx, consentID)
	if err != nil {
		return false
	}
	var consent Consent
	err = json.Unmarshal(consentAsByte, &consent)
	if err != nil {
		return false
	}

	for k := range consent.PermanentConsenters {
		if checkFor == k {
			return true
		}
	}
	for k, v := range consent.TemporaryConsenters {
		if checkFor == k && v >= time.Now().Unix() {
			return true
		}
	}
	return false
}

func (c *Chaincode) GetTest(ctx CustomTransactionContextInterface, key, requester string) (Test, error) {
	existing, err := ctx.GetStub().GetState(key)
	if err != nil {
		return Test{}, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if existing == nil {
		return Test{}, fmt.Errorf("Test with ID %v doesn't exist", key)
	}

	var test Test
	err = json.Unmarshal(existing, &test)
	if err != nil {
		return Test{}, fmt.Errorf("Failed to unmarshal test data: %v", err)
	}

	if ok := c.checkConsent(ctx, test.PatientID, requester); !ok && test.TypeOfT == 0 {
		return Test{}, fmt.Errorf("Please get consent from the patient")
	}
	return test, nil
}

func (c *Chaincode) GetTestByID(ctx CustomTransactionContextInterface, testID string) (*Test, error) {
	// Create a new query string to get the TESTS document for the given reportID
	queryString := fmt.Sprintf(`{"selector":{"docType":"%s", "test_id": "%s"}}`, TESTS, testID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Iterate over the query results and deserialize the document
	if queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Test struct
		var test Test
		err = json.Unmarshal(queryResult.Value, &test)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize test: %v", err)
		}

		return &test, nil
	}

	return nil, nil // return nil if no matching test found
}

func (c *Chaincode) GetTestsByPatientID(ctx CustomTransactionContextInterface, patientID string) ([]*Test, error) {
	// Create a new query string to get all TESTS documents for the given patientID
	queryString := fmt.Sprintf(`{"selector":{"docTyp":"%s", "patient_id": "%s"}}`, TESTS, patientID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Create a slice to hold the results
	var tests []*Test

	// Iterate over the query results and deserialize each document
	for queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Test struct
		var test Test
		err = json.Unmarshal(queryResult.Value, &test)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize test: %v", err)
		}

		// Add the test to the results slice
		tests = append(tests, &test)
	}

	return tests, nil
}

func (c *Chaincode) GetReport(ctx CustomTransactionContextInterface, key, requester string) (Report, error) {
	existing, err := ctx.GetStub().GetState(key)
	if err != nil {
		return Report{}, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if existing == nil {
		return Report{}, fmt.Errorf("Report with ID %v doesn't exist", key)
	}

	var report Report
	err = json.Unmarshal(existing, &report)
	if err != nil {
		return Report{}, fmt.Errorf("Failed to unmarshal report data: %v", err)
	}

	if ok := c.checkConsent(ctx, report.PatientID, requester); !ok {
		return Report{}, fmt.Errorf("Please get consent from the patient")
	}
	return report, nil
}

func (c *Chaincode) GetReportByID(ctx CustomTransactionContextInterface, reportID string) (*Report, error) {
	// Create a new query string to get the REPORT document for the given reportID
	queryString := fmt.Sprintf(`{"selector":{"docType":"%s", "report_id": "%s"}}`, REPORT, reportID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Iterate over the query results and deserialize the document
	if queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Report struct
		var report Report
		err = json.Unmarshal(queryResult.Value, &report)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize report: %v", err)
		}

		return &report, nil
	}

	return nil, nil // return nil if no matching report found
}

func (c *Chaincode) GetReportsByPatientID(ctx CustomTransactionContextInterface, patientID string) ([]*Report, error) {
	// Create a new query string to get all REPORT documents for the given patientID
	queryString := fmt.Sprintf(`{"selector":{"docTyp":"%s", "patient_id": "%s"}}`, REPORT, patientID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Create a slice to hold the results
	var reports []*Report

	// Iterate over the query results and deserialize each document
	for queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Report struct
		var report Report
		err = json.Unmarshal(queryResult.Value, &report)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize report: %v", err)
		}

		// Add the report to the results slice
		reports = append(reports, &report)
	}

	return reports, nil
}

func (c *Chaincode) GetTreatment(ctx CustomTransactionContextInterface, key, requester string) (Treatment, error) {
	existing, err := ctx.GetStub().GetState(key)
	if err != nil {
		return Treatment{}, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if existing == nil {
		return Treatment{}, fmt.Errorf("Treatment with ID %v doesn't exist", key)
	}

	var treatment Treatment
	err = json.Unmarshal(existing, &treatment)
	if err != nil {
		return Treatment{}, fmt.Errorf("Failed to unmarshal treatment data: %v", err)
	}

	if ok := c.checkConsent(ctx, treatment.PatientID, requester); !ok {
		return Treatment{}, fmt.Errorf("Please get consent from the patient")
	}
	return treatment, nil
}

func (c *Chaincode) GetTreatmentByID(ctx CustomTransactionContextInterface, treatmentID string) (*Treatment, error) {
	// Create a new query string to get the TESTS document for the given reportID
	queryString := fmt.Sprintf(`{"selector":{"docType":"%s", "treatment_id": "%s"}}`, TREATMENT, treatmentID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Iterate over the query results and deserialize the document
	if queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Treatment struct
		var treatment Treatment
		err = json.Unmarshal(queryResult.Value, &treatment)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize treatment: %v", err)
		}

		return &treatment, nil
	}

	return nil, nil // return nil if no matching treatment found
}

func (c *Chaincode) GetTreatmentsByPatientID(ctx CustomTransactionContextInterface, patientID string) ([]*Treatment, error) {
	// Create a new query string to get all TREATMENT documents for the given patientID
	queryString := fmt.Sprintf(`{"selector":{"docTyp":"%s", "patient_id": "%s"}}`, TREATMENT, patientID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Create a slice to hold the results
	var treatments []*Treatment

	// Iterate over the query results and deserialize each document
	for queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Treatment struct
		var treatment Treatment
		err = json.Unmarshal(queryResult.Value, &treatment)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize treatment: %v", err)
		}

		// Add the treatment to the results slice
		treatments = append(treatments, &treatment)
	}

	return treatments, nil
}

func (c *Chaincode) GetDrugs(ctx CustomTransactionContextInterface, key, requester string) (Drugs, error) {
	existing := ctx.GetData()
	if existing == nil {
		return Drugs{}, Errorf("Drugs with ID %v does not exist", key)
	}
	var drugs Drugs
	err := json.Unmarshal(existing, &drugs)
	if err != nil {
		return Drugs{}, Errorf("Error unmarshalling drugs data for ID %v: %v", key, err)
	}
	if ok := c.checkConsent(ctx, drugs.For, requester); !ok {
		return Drugs{}, Errorf("Please get consent form the Patient")
	}
	return drugs, nil
}

func (c *Chaincode) GetDrugByID(ctx CustomTransactionContextInterface, drugID string) (*Drugs, error) {
	// Create a new query string to get the TESTS document for the given reportID
	queryString := fmt.Sprintf(`{"selector":{"docType":"%s", "drugs_id": "%s"}}`, DRUGS, drugID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Iterate over the query results and deserialize the document
	if queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Drugs struct
		var drug Drugs
		err = json.Unmarshal(queryResult.Value, &drug)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize drug: %v", err)
		}

		return &drug, nil
	}

	return nil, nil // return nil if no matching treatment found
}

func (c *Chaincode) GetDrugsByPatientID(ctx CustomTransactionContextInterface, patientID string) ([]*Drugs, error) {
	// Create a new query string to get all DRUGS documents for the given patientID
	queryString := fmt.Sprintf(`{"selector":{"docTyp":"%s", "patient_id": "%s"}}`, DRUGS, patientID)

	// Create a new query iterator using the query string
	queryResults, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer queryResults.Close()

	// Create a slice to hold the results
	var drugs []*Drugs

	// Iterate over the query results and deserialize each document
	for queryResults.HasNext() {
		queryResult, err := queryResults.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to get next query result: %v", err)
		}

		// Deserialize the document into a Drugs struct
		var drug Drugs
		err = json.Unmarshal(queryResult.Value, &drug)
		if err != nil {
			return nil, fmt.Errorf("failed to deserialize drug: %v", err)
		}

		// Add the drug to the results slice
		drugs = append(drugs, &drug)
	}

	return drugs, nil
}
