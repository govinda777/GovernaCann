import React from 'react';

const FounderDashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Founder Dashboard - GovernaCann</h1>
      <section>
        <h2>Governance Status</h2>
        <p>Bylaws generated and registered: <strong>Pending</strong></p>
        <button onClick={() => alert('Triggering Legal Agent...')}>Deploy Association</button>
      </section>
      <section style={{ marginTop: '20px' }}>
        <h2>IoT Live Telemetry</h2>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <p>Temperature: -- °C</p>
          <p>Humidity: -- %</p>
        </div>
      </section>
    </div>
  );
};

export default FounderDashboard;
