// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
// --- Icons ---
import { Monitor, User, FileText, Search, RefreshCw, Menu, ShoppingCart, Plus, MinusCircle, PlusCircle, Trash2, DollarSign, AlignLeft, Cpu, Info, ServerCrash, Moon, Sun } from 'lucide-react';

// --- Layout & Common Components ---
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// --- Feature Components (Now styled with Tailwind) ---
import PcGrid from '../components/PcGrid/PcGrid';
import MemberList from '../components/MemberList/MemberList';
import NotesList from '../components/Notes/NotesList'; // Handles notes display and creation form
import { TabManager } from '../components/Tabs/TabManager'; // Handles tab checking, creation, and uses TabView

// --- Types ---
import { Member } from '../types/Member';
import { Pc, PcStatus } from '../types/Pc';
import { Tab, CreateTabRequest } from '../types/Tab'; // Import necessary Tab types

// --- API ---
import { IcafeApi } from '../api/icafeApi';
import { TabsApi } from '../api/TabsApi';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useTheme } from '../contexts/ThemeContext';
// ProductApi is likely used within TabView/TabManager now, maybe not needed directly here unless for searching outside the tab context

// --- StatCard Component --- (Keep as defined previously)
// --- StatCard Component (Add this inside Dashboard.tsx) ---
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string; // Tailwind bg color class e.g., 'bg-blue-500'
  percentage?: number; // Make percentage optional
  onClick?: () => void; // Add optional click handler
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, percentage, onClick }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg ${color} text-white flex-shrink-0`}>
          {icon}
        </div>
      </div>
      {/* Only show progress bar if percentage is a valid number */}
      {typeof percentage === 'number' && !isNaN(percentage) && (
        <div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className={`${color} h-1.5 rounded-full`} style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}></div>
          </div>
          <p className="text-right text-xs mt-1 text-gray-500 dark:text-gray-400">{percentage}%</p>
        </div>
      )}
    </div>
  );
};

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {

  const { pcs: webSocketPcs, members: webSocketMembers, activeTabsData, isConnected } = useWebSocket();
  const { isDarkMode, toggleDarkMode } = useTheme();
  // --- State Definitions ---
  const [pcs, setPcs] = useState<Pc[]>([]);
  const [pcsLoading, setPcsLoading] = useState<boolean>(true);
  const [pcsError, setPcsError] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([]); // State for members list
  const [membersLoading, setMembersLoading] = useState<boolean>(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  const [selectedPc, setSelectedPc] = useState<Pc | undefined>(undefined);

  // Tab Specific State
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [isCheckingTab, setIsCheckingTab] = useState<boolean>(false); // Loading state for checking/fetching tab
  const [isCreatingTab, setIsCreatingTab] = useState<boolean>(false); // Loading state for POST /tabs
  const [isClosingTab, setIsClosingTab] = useState<boolean>(false);   // Loading state for POST /tabs/:id/close
  const [tabError, setTabError] = useState<string | null>(null);     // Errors related to tab operations
  
  // State for member list view mode - default to true (show active tabs by default)
  const [showActiveTabsOnly, setShowActiveTabsOnly] = useState<boolean>(true);
  
  // State to trigger refresh of active tab members
  const [refreshActiveTabsTrigger, setRefreshActiveTabsTrigger] = useState<number>(0);

  // --- Data Fetching ---
  // Mock data for testing
  const generateMockPcs = () => {
    return Array.from({ length: 40 }, (_, i) => ({
      pc_id: String(i + 1),
      pc_name: `PC${String(i + 1).padStart(2, '0')}`,
      status: i % 4 === 0 ? PcStatus.IN_USE : 
              i % 4 === 1 ? PcStatus.AVAILABLE : 
              i % 4 === 2 ? PcStatus.OFFLINE : PcStatus.MAINTENANCE,
      current_member_id: i % 4 === 0 ? i + 100 : undefined,
      current_member_account: i % 4 === 0 ? `member${i + 1}` : undefined,
      time_left: i % 4 === 0 ? `${Math.floor(Math.random() * 120) + 10}min` : undefined,
      has_notes: Math.random() > 0.7,
      has_active_tab: Math.random() > 0.8
    }));
  };

  const fetchInitialData = useCallback(async () => {
    console.log("Fetching initial PC and Member data...");
    setPcsLoading(true);
    setMembersLoading(true);
    setPcsError(null);
    setMembersError(null);

    // For testing: Always use mock data (commented out for live data)
    // console.log("Using mock data for testing");
    // setPcs(generateMockPcs());
    // setPcsLoading(false);
    // setMembersLoading(false);
    // return;

    try {
      const [pcsResponse, membersResponse] = await Promise.all([
        IcafeApi.getAllPcs(),
        IcafeApi.getAllMembers()
      ]);

      if (pcsResponse.success && pcsResponse.data) {
        setPcs(pcsResponse.data);
      } else {
        const errorMsg = pcsResponse.error || 'Failed to fetch PC status';
        console.error("Error fetching PCs:", errorMsg);
        setPcsError(errorMsg);
        // Set default mock data for testing
        const mockPcs = Array.from({ length: 40 }, (_, i) => ({
          pc_id: String(i + 1),
          pc_name: `PC${String(i + 1).padStart(2, '0')}`,
          status: i % 4 === 0 ? PcStatus.IN_USE : 
                  i % 4 === 1 ? PcStatus.AVAILABLE : 
                  i % 4 === 2 ? PcStatus.OFFLINE : PcStatus.MAINTENANCE,
          current_member_id: i % 4 === 0 ? i + 100 : undefined,
          current_member_account: i % 4 === 0 ? `member${i + 1}` : undefined,
          time_left: i % 4 === 0 ? `${Math.floor(Math.random() * 120) + 10}min` : undefined,
          has_notes: Math.random() > 0.7,
          has_active_tab: Math.random() > 0.8
        }));
        setPcs(mockPcs);
      }

      if (membersResponse.success && membersResponse.data) {
        setMembers(membersResponse.data);
      } else {
        const errorMsg = membersResponse.error || 'Failed to fetch members';
        console.error("Error fetching Members:", errorMsg);
        setMembersError(errorMsg);
        setMembers([]);
      }

    } catch (error: any) {
      console.error("Fetch initial data error:", error);
      if (!pcsError) {
        setPcsError('Network or server error loading PC data.');
        // Set default mock data for testing even on network error
        const mockPcs = Array.from({ length: 40 }, (_, i) => ({
          pc_id: String(i + 1),
          pc_name: `PC${String(i + 1).padStart(2, '0')}`,
          status: i % 4 === 0 ? PcStatus.IN_USE : 
                  i % 4 === 1 ? PcStatus.AVAILABLE : 
                  i % 4 === 2 ? PcStatus.OFFLINE : PcStatus.MAINTENANCE,
          current_member_id: i % 4 === 0 ? i + 100 : undefined,
          current_member_account: i % 4 === 0 ? `member${i + 1}` : undefined,
          time_left: i % 4 === 0 ? `${Math.floor(Math.random() * 120) + 10}min` : undefined,
          has_notes: Math.random() > 0.7,
          has_active_tab: Math.random() > 0.8
        }));
        setPcs(mockPcs);
      }
      if (!membersError) {
        setMembersError('Network or server error loading member data.');
        setMembers([]);
      }
    } finally {
      setPcsLoading(false);
      setMembersLoading(false);
    }
  }, []); // No dependencies needed

  useEffect(() => {
    // Initial fetch only if WebSocket is not yet connected
    if (!isConnected || (!webSocketPcs && !webSocketMembers)) {
      fetchInitialData();
    }
    const intervalId = setInterval(() => {
      if (!isConnected) {
        console.log("WebSocket disconnected, using polling fallback");
        fetchInitialData();
      }
    }, 60000); // Longer interval (60s) since WebSocket is primary method
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [fetchInitialData, isConnected, webSocketPcs, webSocketMembers]);

  // Update PC data when WebSocket sends updates
  useEffect(() => {
    // Temporarily disabled for testing - always use mock data (commented out for live data)
    // console.log("WebSocket PC update disabled for testing");
    // return;
    
    if (webSocketPcs && webSocketPcs.length > 0) {
      console.log("Updating PCs from WebSocket data");
      setPcs(webSocketPcs);
      setPcsLoading(false);
      setPcsError(null);
    } else if (webSocketPcs && webSocketPcs.length === 0) {
      console.log("WebSocket returned empty PCs array, using mock data for testing");
      setPcs(generateMockPcs());
      setPcsLoading(false);
      setPcsError('Using mock data - WebSocket returned empty');
    }
  }, [webSocketPcs]);

  // New effect to update members when WebSocket sends updates
  useEffect(() => {
    if (webSocketMembers) {
      console.log("Updating members from WebSocket data");
      setMembers(webSocketMembers);
      setMembersLoading(false);
      setMembersError(null);
    }
  }, [webSocketMembers]);

  // Sync PC has_active_tab flags with real-time tab data
  useEffect(() => {
    if (activeTabsData && pcs.length > 0) {
      const activeMemberIds = new Set(
        activeTabsData.activeMembersWithTabs.map(tab => tab.memberId)
      );

      setPcs(prevPcs => 
        prevPcs.map(pc => ({
          ...pc,
          has_active_tab: pc.current_member_id ? activeMemberIds.has(pc.current_member_id) : false
        }))
      );
    }
  }, [activeTabsData]);


  // --- Tab Fetching Logic ---
  const checkForActiveTab = useCallback(async (memberId: number | undefined) => {
    if (!memberId) {
      setActiveTab(null);
      setTabError(null); // Clear error if no member selected
      return;
    }
    setIsCheckingTab(true); // Use dedicated loading state
    setActiveTab(null); // Clear previous tab while checking
    setTabError(null); // Clear previous errors
    try {
      const response = await TabsApi.getActiveTabForMember(memberId);
      if (response.success && response.data) {
        if ('active' in response.data && response.data.active === false) {
          setActiveTab(null); // Explicitly no active tab
        } else {
          setActiveTab(response.data as Tab); // Active tab found
        }
      } else {
        // Don't show error if it just means "no active tab found"
        if (!(response.error && response.error.includes('not found'))) {
          setTabError(response.error || 'Failed to check for active tab');
        } else {
          setActiveTab(null); // Ensure tab is null if not found
        }
      }
    } catch (error: any) {
      console.error('Error checking for active tab:', error);
      setTabError(error.message || 'An unexpected error occurred checking tab');
      setActiveTab(null); // Ensure tab is null on catch
    } finally {
      setIsCheckingTab(false); // Turn off loading state
    }
  }, []); // No dependencies needed here


  // --- Event Handlers ---
  const handlePcSelect = useCallback((pc: Pc) => {
    setSelectedPc(pc);
    
    let memberFromPc: Member | undefined = undefined;
    
    if (pc.current_member_id) {
      // First try to find the member in the registered members list
      memberFromPc = members.find(m => m.member_id === pc.current_member_id);
      
      // If not found and we have account info, create a synthetic member for guest users
      if (!memberFromPc && pc.current_member_account) {
        memberFromPc = {
          member_id: pc.current_member_id,
          member_account: pc.current_member_account,
          member_first_name: '',
          member_last_name: '',
          member_balance: '',
          member_is_active: 1
        };
      }
    }

    setSelectedMember(memberFromPc);
    checkForActiveTab(memberFromPc?.member_id); // Check tab for the PC's user
  }, [members, checkForActiveTab]); // Depend on members list

  const handleMemberSelect = useCallback((member: Member) => {
    setSelectedMember(member);
    // Find the PC this member might be using
    const pcUsedByMember = pcs.find(p => p.current_member_id === member.member_id);
    setSelectedPc(pcUsedByMember); // May be undefined if member is not on a PC
    checkForActiveTab(member.member_id); // Check tab for the selected member
  }, [pcs, checkForActiveTab]); // Depend on pcs list

  const handleCreateTab = async () => {
    if (!selectedMember) return;
    setIsCreatingTab(true); // Use dedicated loading state
    setTabError(null); // Clear errors
    try {
      const request: CreateTabRequest = {
        memberId: selectedMember.member_id,
        memberAccount: selectedMember.member_account,
        pcName: selectedPc?.pc_name, // Include PC name if selected
      };
      const response = await TabsApi.createTab(request);
      if (response.success && response.data) {
        setActiveTab(response.data); // Set the newly created tab as active
        // Optionally refresh PC/Member data if tab status affects flags
        // fetchInitialData();
      } else {
        setTabError(response.error || 'Failed to create tab');
      }
    } catch (error: any) {
      console.error('Error creating tab:', error);
      setTabError(error.message || 'An unexpected error occurred creating the tab.');
    } finally {
      setIsCreatingTab(false); // Turn off loading state
    }
  };

  const handleCloseTab = async () => {
    if (!activeTab) return;
    // Optional: Confirmation dialog
    // if (!window.confirm("Are you sure you want to close this tab?")) return;
    setIsClosingTab(true); // Use dedicated loading state
    setTabError(null); // Clear errors
    try {
      const response = await TabsApi.closeTab(activeTab.id);
      if (response.success) {
        setActiveTab(null); // Clear the active tab
        // Trigger refresh of active tab members list without full data refresh
        setRefreshActiveTabsTrigger(prev => prev + 1);
      } else {
        setTabError(response.error || 'Failed to close tab');
      }
    } catch (error: any) {
      console.error('Error closing tab:', error);
      setTabError(error.message || 'An unexpected error occurred closing the tab.');
    } finally {
      setIsClosingTab(false); // Turn off loading state
    }
  };

  // Callback passed to TabView (and potentially NotesList if notes affect tabs)
  const handleTabUpdated = (updatedTab: Tab) => {
    setActiveTab(updatedTab); // Update the active tab state
    // Trigger refresh of active tab members list without full data refresh
    setRefreshActiveTabsTrigger(prev => prev + 1);
  };

  // Handler for clicking on "PCs with Tabs" stat card (optional, since it's default now)
  const handleTabsStatClick = () => {
    setShowActiveTabsOnly(true);
  };


  // --- Derived Data & Calculations ---
  const calculateStats = useCallback(() => {
    const totalPCs = pcs.length;
    if (totalPCs === 0) return { totalPCs: 0, inUsePCs: 0, availablePCs: 0, pcsWithNotes: 0, pcsWithTabs: 0, usagePercentage: 0 };

    const inUsePCs = pcs.filter(pc => pc.status === PcStatus.IN_USE).length;
    const availablePCs = pcs.filter(pc => pc.status === PcStatus.AVAILABLE).length;
    // Assuming has_notes and has_active_tab flags come directly from the API response for each Pc
    const pcsWithNotes = pcs.filter(pc => pc.has_notes ?? false).length;
    // Use WebSocket active tabs data instead of PC-based tabs count
    const pcsWithTabs = activeTabsData?.count ?? 0;

    return {
      totalPCs,
      inUsePCs,
      availablePCs,
      pcsWithNotes,
      pcsWithTabs,
      usagePercentage: totalPCs > 0 ? Math.round((inUsePCs / totalPCs) * 100) : 0
    };
  }, [pcs, activeTabsData]); // Depend on both pcs and activeTabsData

  const stats = calculateStats();

  // --- Render ---
  return (
    <Layout>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-0">Dashboard</h2>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
          </button>
          {/* WebSocket Status Indicator */}
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isConnected ? 'Real-time updates connected' : 'Real-time disconnected, using polling'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="PC Usage"
          value={pcsLoading ? '...' : `${stats.inUsePCs}/${stats.totalPCs}`}
          subtitle={`${stats.usagePercentage}% Utilization`}
          icon={<Monitor size={20} />}
          color="bg-blue-500"
          percentage={stats.usagePercentage}
        />
        <StatCard
          title="Available PCs"
          value={pcsLoading ? '...' : stats.availablePCs}
          subtitle="Ready for use"
          icon={<Cpu size={20} />}
          color="bg-green-500"
          percentage={pcsLoading ? 0 : (stats.totalPCs > 0 ? Math.round((stats.availablePCs / stats.totalPCs) * 100) : 0)}
        />
        <StatCard
          title="PCs with Notes"
          value={pcsLoading ? '...' : stats.pcsWithNotes}
          subtitle="Active notes reported"
          icon={<AlignLeft size={20} />}
          color="bg-yellow-500"
          percentage={pcsLoading ? 0 : (stats.totalPCs > 0 ? Math.round((stats.pcsWithNotes / stats.totalPCs) * 100) : 0)}
        />
        <StatCard
          title="PCs with Tabs"
          value={pcsLoading ? '...' : stats.pcsWithTabs}
          subtitle="Active tabs"
          icon={<ShoppingCart size={20} />}
          color="bg-purple-500"
          percentage={pcsLoading ? 0 : (stats.totalPCs > 0 ? Math.round((stats.pcsWithTabs / stats.totalPCs) * 100) : 0)}
          onClick={handleTabsStatClick}
        />
      </div>

      {/* Main Content Layout (PC Grid + Sidebar Panels) */}
      {/* Adjust height calculation based on header/footer/padding */}
      <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-16rem)] xl:h-[calc(100vh-14rem)]">

        {/* Left Side: PC Grid */}
        <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
          {/* PC Grid Content Area - Full height with padding */}
          <div className="flex-grow p-6 flex justify-center items-center">
            <PcGrid
              pcs={pcs}
              loading={pcsLoading}
              error={pcsError}
              selectedPc={selectedPc}
              onPcSelect={handlePcSelect}
              onRetry={fetchInitialData}
            />
          </div>
          {/* Small badge at top right */}
          <div className="absolute top-4 right-4">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">{stats.totalPCs} PCs</span>
          </div>
        </div>

        {/* Right Side: Info Panels */}
        <div className="lg:w-1/3 flex flex-col gap-6 overflow-y-auto lg:max-h-full pb-4 lg:pb-0 lg:pr-2"> {/* Allow right side to scroll independently */}

          {/* Member List Panel */}
          {/* Give MemberList a fixed or max-height if needed within this scrolling column */}
          <div className="lg:max-h-[35%] xl:max-h-[40%] flex flex-col flex-shrink-0">
            <MemberList
              onMemberSelect={handleMemberSelect}
              selectedMemberId={selectedMember?.member_id}
              showActiveTabsOnly={showActiveTabsOnly}
              onViewModeChange={setShowActiveTabsOnly}
              refreshTrigger={refreshActiveTabsTrigger}
            />
          </div>


          {/* Tab Manager Panel */}
          <div className="lg:min-h-[30%] flex flex-col flex-shrink-0">
            <TabManager
              selectedMember={selectedMember}
              selectedPc={selectedPc}
              activeTab={activeTab}
              isLoading={isCheckingTab}
              isCreating={isCreatingTab}
              isClosing={isClosingTab}
              error={tabError}
              onCreateTab={handleCreateTab}
              onCloseTab={handleCloseTab}
              onTabUpdated={handleTabUpdated}
              // Pass the members list if TabManager needs it for context fallback
              // members={members} // Uncomment and adjust TabManager if needed
              className="flex-grow" // Make TabManager fill available space
            />
          </div>

          {/* Notes List Panel */}
          <div className="lg:min-h-[30%] flex flex-col flex-shrink-0">
            <NotesList
              selectedMember={selectedMember}
              selectedPc={selectedPc}
            //  className="flex-grow" // Make NotesList fill available space
            // NotesList now handles its own data fetching based on props
            />
          </div>

        </div> {/* End Right Side Panels */}
      </div> {/* End Main Content Layout */}
    </Layout>
  );
};

export default Dashboard;
