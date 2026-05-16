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
  // In development, this should be fetched from a secure local context or cookie, NOT NEXT_PUBLIC.
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    // Simulate fetching the token securely (e.g. from Privy SDK in a real implementation)
    // For local dev without a real SDK, we check if there's a token in local storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || '' : '';
    setAuthToken(token);
  }, []);

  useEffect(() => {
    // Fetch patients belonging strictly to this physician's association context
    const fetchPatients = async () => {
      if (!authToken) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${apiUrl}/patients`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
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
  }, [authToken]);

  const handleIssuePrescription = async (e: FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      setMessage('Error: Not authenticated.');
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
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

      {!authToken && <p style={{ color: 'orange' }}>Warning: You are not authenticated. Please log in.</p>}

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
              disabled={!authToken}
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
              disabled={!authToken}
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
              disabled={!authToken}
            />
          </label>
          <button type="submit" disabled={!authToken} style={{ padding: '10px', cursor: authToken ? 'pointer' : 'not-allowed', backgroundColor: authToken ? '#4CAF50' : '#ccc', color: 'white', border: 'none' }}>
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
