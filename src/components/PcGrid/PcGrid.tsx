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
    // Separate and order PCs by room with custom layout
    const allPcs = pcs.filter(pc => {
      const pcNum = parseInt(pc.pc_name.replace(/\D/g, ''));
      return pcNum >= 1 && pcNum <= 40;
    });

    // Standard Room: Alternating pattern (ascending, descending, ascending, descending)
    // Row 1: PC16-PC20 (ascending), Row 2: PC15-PC11 (descending), Row 3: PC06-PC10 (ascending), Row 4: PC05-PC01 (descending)
    const standardOrder = [
      16, 17, 18, 19, 20,  // Row 1 (ascending)
      15, 14, 13, 12, 11,  // Row 2 (descending)
      6, 7, 8, 9, 10,      // Row 3 (ascending)
      5, 4, 3, 2, 1        // Row 4 (descending)
    ];
    const standardRoomPcs = standardOrder.map(num => 
      allPcs.find(pc => parseInt(pc.pc_name.replace(/\D/g, '')) === num)
    ).filter((pc): pc is Pc => pc !== undefined);

    // VIP Room: Custom ordering for columns
    // Left column: PC30→PC21 (descending), Right column: PC40→PC31 (descending)
    const vipLeftOrder = [30, 29, 28, 27, 26, 25, 24, 23, 22, 21];
    const vipRightOrder = [40, 39, 38, 37, 36, 35, 34, 33, 32, 31];
    
    const vipLeftPcs = vipLeftOrder.map(num => 
      allPcs.find(pc => parseInt(pc.pc_name.replace(/\D/g, '')) === num)
    ).filter((pc): pc is Pc => pc !== undefined);
    
    const vipRightPcs = vipRightOrder.map(num => 
      allPcs.find(pc => parseInt(pc.pc_name.replace(/\D/g, '')) === num)
    ).filter((pc): pc is Pc => pc !== undefined);

    return (
      <div className="flex gap-16 justify-center max-w-5xl mx-auto">
        {/* VIP Room - Left Side Panel */}
        <div className="flex-shrink-0">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">VIP Room</h2>
            <div className="w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
          <div className="flex gap-6">
            {/* Left column (PC30→PC21) */}
            <div className="flex flex-col gap-3 w-[100px]">
              {vipLeftPcs.map((pc) => (
                <PcCard
                  key={pc.pc_id}
                  pc={pc}
                  isSelected={selectedPc?.pc_id === pc.pc_id}
                  onClick={onPcSelect}
                />
              ))}
            </div>
            {/* Right column (PC40→PC31) */}
            <div className="flex flex-col gap-3 w-[100px]">
              {vipRightPcs.map((pc) => (
                <PcCard
                  key={pc.pc_id}
                  pc={pc}
                  isSelected={selectedPc?.pc_id === pc.pc_id}
                  onClick={onPcSelect}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Standard Room - Main Grid */}
        <div className="flex-shrink-0">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Standard Room</h2>
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
          </div>
          <div className="flex flex-col gap-12">
            {/* First 2 rows (PC01-PC10) */}
            <div className="grid grid-cols-5 gap-3 w-[548px]">
              {standardRoomPcs.slice(0, 10).map((pc) => (
                <PcCard
                  key={pc.pc_id}
                  pc={pc}
                  isSelected={selectedPc?.pc_id === pc.pc_id}
                  onClick={onPcSelect}
                />
              ))}
            </div>
            {/* Last 2 rows (PC11-PC20) */}
            <div className="grid grid-cols-5 gap-3 w-[548px]">
              {standardRoomPcs.slice(10, 20).map((pc) => (
                <PcCard
                  key={pc.pc_id}
                  pc={pc}
                  isSelected={selectedPc?.pc_id === pc.pc_id}
                  onClick={onPcSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pc-grid-content">
      {renderContent()}
    </div>
  );
};

export default PcGrid;