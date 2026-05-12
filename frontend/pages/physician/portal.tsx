import React from 'react';

const PhysicianPortal = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Physician Portal - GovernaCann</h1>
      <section>
        <h2>Patient Care</h2>
        <button>Issue New Prescription (A3/B1/C1)</button>
      </section>
      <section style={{ marginTop: '20px' }}>
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
