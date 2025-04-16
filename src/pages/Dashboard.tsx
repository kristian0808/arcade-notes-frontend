// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
// --- Icons ---
import { Monitor, User, FileText, Search, RefreshCw, Menu, ShoppingCart, Plus, MinusCircle, PlusCircle, Trash2, DollarSign, AlignLeft, Cpu, Info, ServerCrash } from 'lucide-react';

// --- Layout & Common Components ---
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

// --- Feature Components (Now styled with Tailwind) ---
import PcGrid from '../components/PcGrid/PcGrid';
import MemberList from '../components/MemberList/MemberList';
import NotesList from '../components/Notes/NotesList'; // Handles notes display and creation form
import { TabManager } from '../components/Tabs/TabManager'; // Handles tab checking, creation, and uses TabView

// --- Types ---
import { Member } from '../types/Member';
import { Pc, PcStatus } from '../types/Pc';
import { Note } from '../types/Note';
import { Tab, CreateTabRequest } from '../types/Tab'; // Import necessary Tab types
import { Product } from '../types/Product';

// --- API ---
import { IcafeApi } from '../api/icafeApi';
import { NotesApi } from '../api/notesApi';
import { TabsApi } from '../api/TabsApi';
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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, percentage }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg ${color} text-white flex-shrink-0`}>
          {icon}
        </div>
      </div>
      {/* Only show progress bar if percentage is a valid number */}
      {typeof percentage === 'number' && !isNaN(percentage) && (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`${color} h-1.5 rounded-full`} style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}></div>
          </div>
          <p className="text-right text-xs mt-1 text-gray-500">{percentage}%</p>
        </div>
      )}
    </div>
  );
};

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
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

  // --- Data Fetching ---
  const fetchInitialData = useCallback(async () => {
    console.log("Fetching initial PC and Member data...");
    setPcsLoading(true);
    setMembersLoading(true);
    setPcsError(null);
    setMembersError(null);

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
        setPcs([]);
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
        setPcs([]);
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
    fetchInitialData();
    const intervalId = setInterval(fetchInitialData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [fetchInitialData]);


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
    // Find the member associated with the PC from the already fetched members list
    const memberFromPc = pc.current_member_id
      ? members.find(m => m.member_id === pc.current_member_id)
      : undefined;

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
        // Optionally refresh PC/Member data if tab status affects flags
        // fetchInitialData();
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
  };


  // --- Derived Data & Calculations ---
  const calculateStats = useCallback(() => {
    const totalPCs = pcs.length;
    if (totalPCs === 0) return { totalPCs: 0, inUsePCs: 0, availablePCs: 0, pcsWithNotes: 0, pcsWithTabs: 0, usagePercentage: 0 };

    const inUsePCs = pcs.filter(pc => pc.status === PcStatus.IN_USE).length;
    const availablePCs = pcs.filter(pc => pc.status === PcStatus.AVAILABLE).length;
    // Assuming has_notes and has_active_tab flags come directly from the API response for each Pc
    const pcsWithNotes = pcs.filter(pc => pc.has_notes ?? false).length;
    const pcsWithTabs = pcs.filter(pc => pc.has_active_tab ?? false).length;

    return {
      totalPCs,
      inUsePCs,
      availablePCs,
      pcsWithNotes,
      pcsWithTabs,
      usagePercentage: totalPCs > 0 ? Math.round((inUsePCs / totalPCs) * 100) : 0
    };
  }, [pcs]); // Depends only on the pcs list

  const stats = calculateStats();

  // --- Render ---
  return (
    <Layout>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Dashboard</h2>
        <button
          onClick={fetchInitialData}
          disabled={pcsLoading || membersLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
        >
          {pcsLoading || membersLoading ? <LoadingSpinner size="small" className="text-white"/> : <RefreshCw size={16} />}
          <span>Refresh Status</span>
        </button>
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
            subtitle="Active orders ongoing"
            icon={<ShoppingCart size={20} />}
            color="bg-purple-500"
            percentage={pcsLoading ? 0 : (stats.totalPCs > 0 ? Math.round((stats.pcsWithTabs / stats.totalPCs) * 100) : 0)}
        />
      </div>

      {/* Main Content Layout (PC Grid + Sidebar Panels) */}
      {/* Adjust height calculation based on header/footer/padding */}
      <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-16rem)] xl:h-[calc(100vh-14rem)]">

        {/* Left Side: PC Grid */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 md:p-4 border-b flex justify-between items-center flex-shrink-0">
            <h3 className="font-semibold text-base md:text-lg text-gray-800">PC Status</h3>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{stats.totalPCs} Systems</span>
          </div>
          {/* PC Grid Content Area - Apply overflow and height */}
          <div className="flex-grow p-3 md:p-4 overflow-y-auto">
             <PcGrid
                pcs={pcs}
                loading={pcsLoading}
                error={pcsError}
                selectedPc={selectedPc}
                onPcSelect={handlePcSelect}
                onRetry={fetchInitialData}
            />
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
               // Pass members data and loading states if MemberList handles its own fetching,
               // otherwise, ensure MemberList can receive `members`, `membersLoading`, `membersError` as props
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
