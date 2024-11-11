import { useState, useEffect } from "react";

interface EcoAction {
  id: number;
  name: string;
  co2Reduction: number;
}

interface TrackedAction extends EcoAction {
  count: number;
}

const ecoActions: EcoAction[] = [
  { id: 1, name: "Use a reusable water bottle", co2Reduction: 0.5 },
  { id: 2, name: "Take public transport", co2Reduction: 2.6 },
  { id: 3, name: "Eat a plant-based meal", co2Reduction: 0.8 },
  { id: 4, name: "Use energy-efficient light bulbs", co2Reduction: 0.1 },
  { id: 5, name: "Recycle paper", co2Reduction: 0.2 },
];

function App() {
  const [trackedActions, setTrackedActions] = useState<TrackedAction[]>([]);

  useEffect(() => {
    const savedActions = localStorage.getItem("trackedActions");
    if (savedActions) setTrackedActions(JSON.parse(savedActions));
  }, []);

  useEffect(() => {
    localStorage.setItem("trackedActions", JSON.stringify(trackedActions));
  }, [trackedActions]);

  const addAction = (action: EcoAction) => {
    setTrackedActions((prev) => {
      const existing = prev.find((a) => a.id === action.id);
      if (existing)
        return prev.map((a) =>
          a.id === action.id ? { ...a, count: a.count + 1 } : a,
        );
      return [...prev, { ...action, count: 1 }];
    });
  };

  const removeAction = (id: number) => {
    setTrackedActions((prev) => prev.filter((a) => a.id !== id));
  };

  const clearActions = () => {
    setTrackedActions([]);
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Eco Actions Tracker</h1>
      <ActionList actions={ecoActions} addAction={addAction} />
      <ImpactSummary
        actions={trackedActions}
        clearActions={clearActions}
        removeAction={removeAction}
      />
    </div>
  );
}

interface ActionListProps {
  actions: EcoAction[];
  addAction: (action: EcoAction) => void;
}

function ActionList({ actions, addAction }: ActionListProps) {
  return (
    <div style={styles.section}>
      <h2 style={styles.subtitle}>Available Actions</h2>
      {actions.map((action) => (
        <div key={action.id} style={styles.actionItem}>
          <span>
            {action.name} - Reduces CO₂ by {action.co2Reduction} kg
          </span>
          <button onClick={() => addAction(action)} style={styles.button}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
}

interface ImpactSummaryProps {
  actions: TrackedAction[];
  clearActions: () => void;
  removeAction: (id: number) => void;
}

function ImpactSummary({
  actions,
  clearActions,
  removeAction,
}: ImpactSummaryProps) {
  const totalCO2 = actions.reduce(
    (acc, action) => acc + action.co2Reduction * action.count,
    0,
  );
  const treeEquivalent = Math.floor(totalCO2 / 10);
  const impactColor =
    totalCO2 < 0.5 ? "red" : totalCO2 < 1 ? "orange" : "green";

  return (
    <div style={styles.section}>
      <h2 style={styles.subtitle}>Impact Summary</h2>
      {actions.length === 0 ? (
        <p style={styles.noActions}>No actions tracked yet.</p>
      ) : (
        <div>
          <p style={styles.totalCO2}>
            Total CO₂ Reduction: {totalCO2.toFixed(2)} kg
          </p>
          <p style={{ ...styles.impactMessage, color: impactColor }}>
            You've saved the equivalent of {treeEquivalent}{" "}
            {treeEquivalent === 1 ? "tree" : "trees"} planted!
          </p>
          {actions.map((action) => (
            <Action
              key={action.id}
              action={action}
              removeAction={removeAction}
            />
          ))}
          <button
            onClick={clearActions}
            style={{ ...styles.button, marginTop: "10px" }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

interface ActionProps {
  action: TrackedAction;
  removeAction: (id: number) => void;
}

function Action({ action, removeAction }: ActionProps) {
  return (
    <div style={styles.actionItem}>
      <span>
        {action.name} - {action.co2Reduction * action.count} kg CO₂ saved
      </span>
      <button onClick={() => removeAction(action.id)} style={styles.button}>
        Delete
      </button>
    </div>
  );
}

const styles = {
  app: {
    color: "#000000",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#f4f4f9",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#2c3e50",
    textAlign: "center" as const,
    fontSize: "2em",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  subtitle: {
    color: "#34495e",
    fontSize: "1.5em",
    borderBottom: "2px solid #ddd",
    paddingBottom: "8px",
    marginBottom: "10px",
  },
  actionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9em",
  },
  noActions: {
    color: "#95a5a6",
    textAlign: "center" as const,
    fontSize: "1em",
  },
  totalCO2: {
    color: "#2c3e50",
    fontSize: "1.2em",
    marginBottom: "8px",
  },
  impactMessage: {
    fontWeight: "bold" as const,
    fontSize: "1.1em",
  },
};

export default App;
