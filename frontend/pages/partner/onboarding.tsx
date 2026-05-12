import React from 'react';

const PartnerOnboarding = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Partner Onboarding - GovernaCann</h1>
      <form>
        <div>
          <label>Professional Registry (CREA/CRF):</label>
          <input type="text" />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Service Area:</label>
          <select>
            <option>Agronomy</option>
            <option>Pharmacy</option>
            <option>Logistics</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Join Network</button>
      </form>
    </div>
  );
};

export default PartnerOnboarding;
