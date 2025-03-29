import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Tabs.css";

const Tabs = ({ tabList, renderTabContent }) => {
  const [activeTab, setActiveTab] = useState(tabList[0]?.name);

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabList.map((tab) => (
          <button
            key={tab.name}
            className={`tab-button ${activeTab === tab.name ? "active" : ""}`}
            onClick={() => setActiveTab(tab.name)}
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

Tabs.propTypes = {
  tabList: PropTypes.array.isRequired,
  renderTabContent: PropTypes.func.isRequired,
};

export default Tabs;
