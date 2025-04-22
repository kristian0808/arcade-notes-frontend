import React, { useState, useEffect } from 'react';
import { RankingsApi } from '../../api/rankingsApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { MemberRanking, TimeframeType } from '../../types/Member';
import { Trophy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// Helper formatting functions
const formatHours = (hours: number) => `${hours.toFixed(1)}h`;
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};
const formatCurrency = (amount: number) => `${amount.toFixed(0)} L`;

type SortField = 'totalHours' | 'sessionCount' | 'avgSessionHours' | 'totalTopups';
type SortDirection = 'asc' | 'desc';

const MemberRankings: React.FC = () => {
  const [rankings, setRankings] = useState<MemberRanking[]>([]);
  const [timeframe, setTimeframe] = useState<TimeframeType>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('totalHours');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await RankingsApi.getMemberRankings(timeframe);
        if (response.success && response.data) {
          setRankings(response.data);
        } else {
          setError(response.error || 'Failed to fetch rankings');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRankings();
  }, [timeframe]);
  
  // Sort rankings when sort field or direction changes
  const sortedRankings = React.useMemo(() => {
    return [...rankings].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [rankings, sortField, sortDirection]);
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-indigo-600" />
      : <ArrowDown size={14} className="text-indigo-600" />;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Loading member rankings..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  if (rankings.length === 0) {
    return (
      <div className="text-center py-16">
        <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No member activity data found for the selected time period.</p>
      </div>
    );
  }
  
  // Helper function to determine rank styling
  const getRankClass = (index: number) => {
    // Only apply special styling if sorted by totalHours (default ranking)
    if (sortField === 'totalHours' && sortDirection === 'desc') {
      switch (index) {
        case 0: return "bg-yellow-50 border-l-4 border-yellow-400";
        case 1: return "bg-gray-50 border-l-4 border-gray-400";
        case 2: return "bg-orange-50 border-l-4 border-orange-400";
        default: return "";
      }
    }
    return "";
  };
  
  // Top 3 members (only show if sorted by totalHours descending)
  const showTopThree = sortField === 'totalHours' && sortDirection === 'desc';
  const topThree = showTopThree ? sortedRankings.slice(0, 3) : [];
  
  return (
    <div className="space-y-6">
      {/* Time Period Selectors */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600 mb-3">Time Period</p>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'all'] as TimeframeType[]).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 text-sm font-medium rounded-md
                        ${timeframe === period
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {period === 'day' ? 'Today' :
                period === 'week' ? 'This Week' :
                  period === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Top 3 Cards - Only show for default sort */}
      {showTopThree && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((member, idx) => (
            <div key={member.memberAccount} 
                 className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 
                            ${idx === 0 ? 'border-yellow-400' : 
                              idx === 1 ? 'border-gray-400' : 
                              'border-orange-400'}`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                                  ${idx === 0 ? 'bg-yellow-500' : 
                                    idx === 1 ? 'bg-gray-500' : 
                                    'bg-orange-500'}`}>
                      {idx + 1}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">{member.memberAccount}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{formatHours(member.totalHours)}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-gray-600">
                  <div>
                    <p className="font-medium">Sessions</p>
                    <p className="text-gray-900 font-semibold">{member.sessionCount}</p>
                  </div>
                  <div>
                    <p className="font-medium">Avg. Time</p>
                    <p className="text-gray-900 font-semibold">{formatHours(member.avgSessionHours)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Top-ups</p>
                    <p className="text-gray-900 font-semibold">{formatCurrency(member.totalTopups)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Rankings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalHours')}>
                  <div className="flex items-center justify-end gap-1">
                    Hours
                    {getSortIcon('totalHours')}
                  </div>
                </th>
                <th scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sessionCount')}>
                  <div className="flex items-center justify-end gap-1">
                    Sessions
                    {getSortIcon('sessionCount')}
                  </div>
                </th>
                <th scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('avgSessionHours')}>
                  <div className="flex items-center justify-end gap-1">
                    Avg. Session
                    {getSortIcon('avgSessionHours')}
                  </div>
                </th>
                <th scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalTopups')}>
                  <div className="flex items-center justify-end gap-1">
                    Top-ups
                    {getSortIcon('totalTopups')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRankings.map((member, index) => (
                <tr key={member.memberAccount} className={getRankClass(index)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                        {member.memberAccount.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">@{member.memberAccount}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatHours(member.totalHours)}</div>
                    {/* Progress bar removed */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {member.sessionCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatHours(member.avgSessionHours)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(member.totalTopups)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatDate(member.lastActive)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberRankings;
