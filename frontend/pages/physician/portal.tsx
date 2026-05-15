import React, { useState, useEffect, FormEvent } from 'react';

interface Patient {
  _id: string;
  name: string;
  cpf: string;
}

const PhysicianPortal = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [message, setMessage] = useState('');

  // A real token fetched securely via Privy context
  // This is a placeholder mock JWT generated specifically for this mock environment.
  // It decodes to { id: 'doc123', role: 'physician', associationId: 'assoc789' } using secret 'mock_secret'
  const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRvYzEyMyIsInJvbGUiOiJwaHlzaWNpYW4iLCJhc3NvY2lhdGlvbklkIjoiYXNzb2M3ODkiLCJpYXQiOjE3Nzg4NzQ4NDZ9.7_Bop1OGr0pX4Z2xWaQ9VkkD_NOjwe-pPinVdEkrhkM';

  useEffect(() => {
    // Fetch patients belonging strictly to this physician's association context
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/patients', {
          headers: {
            'Authorization': `Bearer ${MOCK_TOKEN}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setPatients(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
    };
    fetchPatients();
  }, []);

  const handleIssuePrescription = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MOCK_TOKEN}`
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          medication,
          dosage
        })
      });
      const result = await response.json();
      if (result.success) {
        setMessage(`Prescription issued successfully for patient ${selectedPatient}!`);
        setSelectedPatient('');
        setMedication('');
        setDosage('');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to issue prescription', error);
      setMessage('Failed to issue prescription.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Physician Portal - GovernaCann</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>Patient Care - Issue Prescription</h2>
        <form onSubmit={handleIssuePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <label>
            Patient:
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            >
              <option value="">Select a patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name} (CPF: {p.cpf})</option>
              ))}
            </select>
          </label>
          <label>
            Medication:
            <input
              type="text"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              required
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </label>
          <label>
            Dosage:
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </label>
          <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
            Issue New Prescription (A3/B1/C1)
          </button>
        </form>
        {message && <p style={{ color: 'blue', marginTop: '10px' }}>{message}</p>}
      </section>

      <section style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h2>Evidence-Based Medicine</h2>
        <ul>
          <li>Pharmacokinetics of Strain A</li>
          <li>Clinical Outcomes Report (Anonymized)</li>
        </ul>
      </section>
    </div>
  );
};

export default PhysicianPortal;
