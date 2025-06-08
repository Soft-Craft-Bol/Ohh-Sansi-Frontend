import React, { useState, memo, useEffect, useRef } from "react";
import "./Tabs.css";

const Tabs = memo(({ 
  tabs, 
  onTabChange, 
  renderTabContent, 
  variant = "default",
  activeTab: controlledActiveTab 
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || "");
  const tabsHeaderRef = useRef(null);
  
  // Usar activeTab controlado si se proporciona, sino usar el interno
  const activeTab = controlledActiveTab || internalActiveTab;

  useEffect(() => {
    if (controlledActiveTab && controlledActiveTab !== internalActiveTab) {
      setInternalActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab, internalActiveTab]);

  const handleTabClick = (tabId) => {
    if (tabId !== activeTab) {
      setInternalActiveTab(tabId);
      onTabChange && onTabChange(tabId);
      
      // Scroll suave al tab activo en móviles
      if (tabsHeaderRef.current) {
        const activeButton = tabsHeaderRef.current.querySelector(`[data-tab-id="${tabId}"]`);
        if (activeButton) {
          activeButton.scrollIntoView({ 
            behavior: 'smooth', 
            inline: 'center',
            block: 'nearest'
          });
        }
      }
    }
  };

  const handleKeyDown = (event, tabId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tabId);
    }
  };

  return (
    <div className={`tabs-container ${variant}`}>
      <div className="tabs-header" ref={tabsHeaderRef}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            aria-label={`${tab.label}${tab.description ? ` - ${tab.description}` : ''}`}
            aria-selected={activeTab === tab.id}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.icon && (
              <span className="tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span className="tab-label">{tab.label}</span>
            {tab.description && (
              <span className="tab-description">{tab.description}</span>
            )}
            <span className="tab-indicator" aria-hidden="true"></span>
          </button>
        ))}
      </div>

      <div 
        className="tabs-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;