import React, { useState, useEffect } from 'react';

const ecoActions = [
  { id: 1, name: "Use a reusable water bottle", co2Reduction: 0.5 },
  { id: 2, name: "Take public transport", co2Reduction: 2.6 },
  { id: 3, name: "Eat a plant-based meal", co2Reduction: 0.8 },
  { id: 4, name: "Use energy-efficient light bulbs", co2Reduction: 0.1 },
  { id: 5, name: "Recycle paper", co2Reduction: 0.2 },
];

const App = () => {
  const [actions, setActions] = useState(() => {
    const savedActions = localStorage.getItem("trackedActions");
    return savedActions ? JSON.parse(savedActions) : [];
  }
);

  const handleAddAction = (action) => {
    const updatedActions = [...actions, { ...action, count: 1 }];
    setActions(updatedActions);
    localStorage.setItem("trackedActions", JSON.stringify(updatedActions));
  };

  const handleClearActions = () => {
    setActions([]);
    localStorage.removeItem("trackedActions");
  };

  const handleRemoveAction = (id) => {
    const updatedActions = actions.filter(action => action.id !== id);
    setActions(updatedActions);
    localStorage.setItem("trackedActions", JSON.stringify(updatedActions));
  };

  const totalCO2Reduction = actions.reduce((total, action) => total + action.co2Reduction * action.count, 0);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Eco Action Tracker</h1>
      <ActionList actions={ecoActions} onAddAction={handleAddAction} />
      <ImpactSummary actions={actions} totalCO2Reduction={totalCO2Reduction} onClear={handleClearActions} onRemove={handleRemoveAction} />
    </div>
  );
};

const ActionList = ({ actions, onAddAction }) => (
  <div style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px" }}>
    <h2>Eco-Friendly Actions</h2>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {actions.map(action => (
        <li key={action.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
          {action.name} - {action.co2Reduction} kg CO₂
          <button onClick={() => onAddAction(action)}>Add</button>
        </li>
      ))}
    </ul>
  </div>
);

const ImpactSummary = ({ actions, totalCO2Reduction, onClear, onRemove }) => {
  const getImpactMessageColor = () => {
    if (totalCO2Reduction > 1) return "green";
    if (totalCO2Reduction > 0.5) return "orange";
    return "red";
  };

  const impactMessage = totalCO2Reduction > 0 
    ? `You've saved the equivalent of ${Math.floor(totalCO2Reduction / 10)} trees planted!`
    : "Start tracking your eco-friendly actions!";

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px" }}>
      <h2>Your Impact</h2>
      {actions.length === 0 ? (
        <p>No actions tracked yet. Start by adding one!</p>
      ) : (
        <div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {actions.map(action => (
              <Action key={action.id} action={action} onRemove={onRemove} />
            ))}
          </ul>
          <p style={{ color: getImpactMessageColor() }}>{impactMessage}</p>
          <p>Total CO₂ Reduction: {totalCO2Reduction.toFixed(2)} kg</p>
          <button onClick={onClear}>Clear All</button>
        </div>
      )}
    </div>
  );
};

const Action = ({ action, onRemove }) => (
  <li style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
    {action.name} x {action.count} = {(action.co2Reduction * action.count).toFixed(2)} kg CO₂
    <button onClick={() => onRemove(action.id)}>Delete</button>
  </li>
);

export default App;
