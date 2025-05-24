import React, { useState, memo } from "react";
import "./Tabs.css";

const Tabs = memo(({ tabs, onTabChange, renderTabContent, variant = "default" }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      onTabChange && onTabChange(tabId);
    }
  };

  return (
    <div className={`tabs-container ${variant}`}>
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
            aria-label={tab.label}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.description && (
              <span className="tab-description">{tab.description}</span>
            )}
            <span className="tab-indicator"></span>
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
});

export default Tabs;
