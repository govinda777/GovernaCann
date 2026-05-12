import React from 'react';

const PatientPortal = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Patient Portal - GovernaCann</h1>
      <section>
        <h2>My Treatment</h2>
        <p>Status: <strong>Awaiting Document Validation</strong></p>
        <div style={{ border: '1px dotted #333', padding: '20px', textAlign: 'center' }}>
          Upload Prescription & Medical Report
        </div>
      </section>
      <section style={{ marginTop: '20px' }}>
        <h2>Order Status</h2>
        <p>Your medicine is in the <em>Extraction</em> phase.</p>
      </section>
    </div>
  );
};

export default PatientPortal;
