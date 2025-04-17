// src/components/PcGrid/PcGrid.tsx
import React from 'react';
import { Pc } from '../../types/Pc';
import PcCard from './PcCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { ServerCrash } from 'lucide-react';
import { useWebSocket } from '../../contexts/WebSocketContext';

interface PcGridProps {
  pcs: Pc[];
  loading: boolean;
  error: string | null;
  selectedPc: Pc | undefined;
  onPcSelect: (pc: Pc) => void;
  onRetry?: () => void;
}

const PcGrid: React.FC<PcGridProps> = ({
  pcs,
  loading,
  error,
  selectedPc,
  onPcSelect,
  onRetry
}) => {
  const { isConnected } = useWebSocket();
  
  // Render Content based on state
  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><LoadingSpinner message="Loading PCs..." /></div>;
    }
    if (error) {
      return <div className="flex justify-center items-center h-64"><ErrorMessage message={error} onRetry={onRetry} /></div>;
    }
    if (pcs.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-64 text-gray-500">
          <ServerCrash size={48} className="mb-4 text-gray-400"/>
          <p>No PCs found.</p>
        </div>
      );
    }
    // Grid for PCs
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 [&>*:focus]:outline-none">
        {pcs.map((pc) => (
          <PcCard
            key={pc.pc_id} // Use a stable key
            pc={pc}
            isSelected={selectedPc?.pc_id === pc.pc_id}
            onClick={onPcSelect} // Pass the selection handler
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pc-grid-content">
      {/* Real-time indicator */}
      {isConnected && (
        <div className="mb-3 flex items-center text-xs text-green-700">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Real-time updates active
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default PcGrid;