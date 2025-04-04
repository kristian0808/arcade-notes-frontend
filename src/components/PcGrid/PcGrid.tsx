import React, { useState, useEffect } from 'react';
import { Pc } from '../../types/Pc';
import PcCard from './PcCard';
import { IcafeApi } from '../../api/icafeApi';
// import { NotesApi } from '../../api/notesApi';
import './PcGrid.css';

interface PcGridProps {
  onPcSelect: (pc: Pc) => void;
}

const PcGrid: React.FC<PcGridProps> = ({ onPcSelect }) => {
  const [pcs, setPcs] = useState<Pc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPc, setSelectedPc] = useState<Pc | null>(null);

  // Fetch all PCs on component mount
  useEffect(() => {
    const fetchPcs = async () => {
      setLoading(true);
      try {
        const response = await IcafeApi.getAllPcs();
        if (response.success && response.data) {
          setPcs(response.data);
        } else {
          setError(response.error || 'Failed to fetch PCs');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPcs();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchPcs, 30000); // Poll every 30 seconds
    
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handlePcClick = (pc: Pc) => {
    setSelectedPc(pc);
    onPcSelect(pc);
  };

  if (loading && pcs.length === 0) {
    return <div className="pc-grid-loading">Loading PCs...</div>;
  }

  if (error && pcs.length === 0) {
    return <div className="pc-grid-error">Error: {error}</div>;
  }

  return (
    <div className="pc-grid-container">
      <h2>PC Status</h2>
      <div className="pc-grid">
        {pcs.map((pc) => (
          <PcCard 
          key={`${pc.pc_id}-${pc.pc_name}`}
          pc={pc} 
            isSelected={selectedPc?.pc_id === pc.pc_id}
            onClick={() => handlePcClick(pc)} 
          />
        ))}
      </div>
    </div>
  );
};

export default PcGrid;
