import { useState } from "react";
import "./SwitchTabs.css";

const SwitchTabs = ({ tabs, onChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    onChange(tabValue);
  };

  return (
    <div className="switch-container">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={`switch-tab ${activeTab === tab.value ? "active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SwitchTabs;
