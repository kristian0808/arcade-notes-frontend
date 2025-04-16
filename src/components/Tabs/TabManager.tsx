// src/components/Tabs/TabManager.tsx
import React from 'react';
import { Member } from '../../types/Member';
import { Pc } from '../../types/Pc';
import { Tab } from '../../types/Tab';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import TabView from './TabView'; // Use the adapted TabView
import { ShoppingCart, Info } from 'lucide-react'; // Icons

interface TabManagerProps {
    selectedMember?: Member;
    selectedPc?: Pc; // PC context might be useful
    activeTab: Tab | null;
    isLoading: boolean; // Loading state for fetching/checking the tab
    isCreating: boolean; // Separate loading state for creating a tab
    isClosing: boolean; // Separate loading state for closing a tab
    error: string | null; // Error related to fetching/checking/creating/closing
    onCreateTab: () => void; // Callback to trigger tab creation
    onCloseTab: () => void; // Callback to trigger tab closing
    onTabUpdated: (tab: Tab) => void; // Callback when tab is updated internally
    className?: string;
}

export const TabManager: React.FC<TabManagerProps> = ({
    selectedMember,
    selectedPc,
    activeTab,
    isLoading,
    isCreating,
    isClosing,
    error,
    onCreateTab,
    onCloseTab,
    onTabUpdated,
    className = ''
}) => {
    // Determine the member context for display/actions
    // Prioritize the explicitly selected member, fallback to the PC's current member
     const contextMember = selectedMember ||
        (selectedPc?.current_member_id
            ? members.find(m => m.member_id === selectedPc.current_member_id) // Find member from list if available
            ?? { // Construct a temporary member object if not found
                  member_id: selectedPc.current_member_id,
                  member_account: selectedPc.current_member_account || 'Unknown',
                  member_is_active: 1 // Assume active if on PC
               }
            : undefined);


    // --- Render Logic ---

    // 1. No Member Context
    if (!contextMember && !isLoading) { // Only show if not loading initial context
        return (
            <div className={`tab-manager-empty p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center h-full ${className}`}>
                 <Info size={36} className="mb-3 text-gray-300"/>
                 <p className="text-sm">Select a member</p>
                 <p className="text-xs">(or a PC currently in use)</p>
                 <p className="text-xs">to manage their tab.</p>
            </div>
        );
    }

    // 2. Loading Tab Info
    if (isLoading) {
        return (
             <div className={`p-6 flex items-center justify-center bg-white rounded-lg shadow-sm h-full ${className}`}>
                 <LoadingSpinner size="medium" message="Checking tab status..." />
             </div>
        );
    }

    // 3. Error Loading/Managing Tab
    if (error) {
        return (
            <div className={`p-6 bg-white rounded-lg shadow-sm h-full ${className}`}>
                <ErrorMessage message={error} onRetry={contextMember ? () => checkForActiveTab(contextMember.member_id) : undefined}/>
                 {/* If error occurred during creation/closing, maybe offer retry? */}
            </div>
        );
    }

    // 4. Member Context Exists, No Active Tab Found
    if (contextMember && !activeTab) {
        return (
            <div className={`tab-manager-no-active-tab p-6 text-center bg-white rounded-lg shadow-sm flex flex-col items-center justify-center h-full ${className}`}>
                <ShoppingCart size={36} className="mb-3 text-gray-300"/>
                <h4 className="font-semibold text-gray-800 mb-1">No Active Tab</h4>
                <p className="text-sm text-gray-600 mb-4">For member: {contextMember.member_account}</p>
                 <button
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-wait transition-colors"
                    onClick={onCreateTab}
                    disabled={isCreating} // Disable while creating
                >
                    {isCreating ? 'Opening...' : 'Open New Tab'}
                </button>
            </div>
        );
    }

    // 5. Active Tab Exists
    if (activeTab) {
         return (
            // The TabView component itself will be a flex container taking full height
            <div className={`tab-manager-active bg-white rounded-lg shadow-sm overflow-hidden h-full ${className}`}>
                <TabView
                    tab={activeTab}
                    onCloseTab={onCloseTab}
                    onTabUpdated={onTabUpdated}
                    isClosing={isClosing} // Pass closing state to TabView
                />
            </div>
         );
    }

    // Fallback (should ideally not be reached if logic above is correct)
     return (
        <div className={`p-6 bg-white rounded-lg shadow-sm h-full ${className}`}>
             <p className="text-center text-gray-500">Invalid state.</p>
        </div>
    );
};

// Dummy data/functions needed for the contextMember logic - replace with your actual state access
const members: Member[] = []; // Assuming you have access to the members list here or pass it as a prop
const checkForActiveTab = (id: number) => { console.log("Checking tab for", id)}; // Replace with actual function call