import React, { useState } from "react";
import "./Tabs.css";

const Tabs = ({ tabs, onTabChange, renderTabContent }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange && onTabChange(tabId); // Notify parent component
  };

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
};

export default Tabs;
