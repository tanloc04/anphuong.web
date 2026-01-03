import { useRecoilState } from 'recoil';
import { tabsState, activeTabIdState } from '../store/tabAtom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Tab } from '../ProductManagement/types';

const TabHistoryBar = () => {
  const [tabs, setTabs] = useRecoilState(tabsState);
  const [activeTabId, setActiveTabId] = useRecoilState(activeTabIdState);
  const navigate = useNavigate();

  const handleCloseTab = (e: React.MouseEvent, tabIdToRemove: string) => {
    e.preventDefault();
    e.stopPropagation();

    let newActiveTabId = activeTabId;
    const closedTabIndex = tabs.findIndex(tab => tab.id === tabIdToRemove);
    const updatedTabs = tabs.filter(tab => tab.id !== tabIdToRemove);
    
    if (activeTabId === tabIdToRemove) {
      if (updatedTabs.length > 0) {
        newActiveTabId = updatedTabs[Math.max(0, closedTabIndex - 1)].id;
      } else {
        newActiveTabId = null;
      }
    }
    
    setTabs(updatedTabs);
    setActiveTabId(newActiveTabId);
    
    if (newActiveTabId) {
      const newActiveTab = updatedTabs.find(t => t.id === newActiveTabId) as Tab;
      if (newActiveTab) {
        navigate(newActiveTab.path);
      }
    } else {
      navigate('/'); 
    }
  };

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTabId(tabId);
    navigate(path);
  };

  return (
    <div className="flex items-center w-full h-12 bg-white border-b border-gray-200">
      <nav className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {tabs.length === 0 && (
          <div className="text-sm text-gray-500 px-4 py-3">Welcome</div>
        )}
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={`inline-flex items-center h-12 px-5 text-sm font-medium border-b-2 ${
              activeTabId === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            style={{ minWidth: 'max-content' }}
          >
            {tab.label}
            <span
              onClick={(e) => handleCloseTab(e, tab.id)}
              className="ml-3 p-1 rounded-full hover:bg-gray-300"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabHistoryBar;

