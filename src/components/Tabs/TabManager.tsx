// import React, { useState } from 'react';
import { Member } from '../../types/Member';
import { Pc } from '../../types/Pc';
import { Tab } from '../../types/Tab';
import './Tabs.css';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import TabView from './TabView';

interface TabManagerProps {
    selectedMember?: Member;
    selectedPc?: Pc;
    activeTab: Tab | null;
    isLoading: boolean;
    error: string | null;
    onCreateTab: () => void;
    onCloseTab: () => void;
    onTabUpdated: (tab: Tab) => void;
}

export const TabManager: React.FC<TabManagerProps> = ({
    selectedMember,
    selectedPc,
    activeTab,
    isLoading,
    error,
    onCreateTab,
    onCloseTab,
    onTabUpdated
}) => {
    // In TabManager.tsx
    // Get the relevant member for display
    const displayMember = selectedMember ||
        (selectedPc?.current_member_id ? {
            member_id: selectedPc.current_member_id,
            member_account: selectedPc.current_member_account || 'Unknown'
        } as Member : undefined);

    if (!displayMember) {
        return (
            <div className="tab-manager">
                <div className="tab-manager-empty">
                    <p>Select a PC in use or a Member to manage their tab</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="tab-manager">
                <LoadingSpinner size="small" message="Checking for active tab..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="tab-manager">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (!activeTab) {
        return (
            <div className="tab-manager">
                <div className="tab-manager-no-active-tab">
                    <h4>No Active Tab</h4>
                    <p>Member: {displayMember.member_account}</p>
                    <button
                        className="create-tab-button"
                        onClick={() => {
                            console.log('Button clicked!');
                            if (typeof onCreateTab === 'function') {
                                console.log('onCreateTab is a function, calling it');
                                onCreateTab();
                            } else {
                                console.log('onCreateTab is not a function, type:', typeof onCreateTab);
                            }
                        }}
                    >
                        Open New Tab
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="tab-manager">
            <TabView
                tab={activeTab}
                onCloseTab={onCloseTab}
                onTabUpdated={onTabUpdated}
            />
        </div>
    );
};