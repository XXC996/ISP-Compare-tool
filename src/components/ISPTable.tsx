import React, { useState, useEffect } from 'react';
import { IspTable } from '../types';
import '../styles/ISPTable.css';

const API_HOST = 'http://localhost:3100';

const ISPTable: React.FC = () => {
  const [isps, setIsps] = useState<IspTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchISPs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_HOST}/isp`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        console.log(response);

        const data = await response.json();
        console.log(data);
        setIsps(data);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch ISP data. Please try again later.');
        console.error('Error fetching ISP data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchISPs();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading ISP data...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="isp-table-container">
      <h2>ISP Comparison</h2>
      <div className="table-responsive">
        <table className="isp-table">
          <thead>
            <tr>
              <th>Speed</th>
              <th>Telstra</th>
              <th>TPG</th>
              <th>Optus</th>
              <th>ABB</th>
              <th>Superloop</th>
              <th>OzCom</th>
            </tr>
          </thead>
          <tbody>
            {isps.length > 0 ? (
              isps.map((isp) => (
                <tr key={isp.id}>
                  <td>{isp.speed}</td>
                  <td>${isp.telstra}/mo</td>
                  <td>${isp.tpg}/mo</td>
                  <td>${isp.optus}/mo</td>
                  <td>${isp.abb}/mo</td>
                  <td>${isp.superloop}/mo</td>
                  <td>${isp.ozcom}/mo</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-data">No ISP data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ISPTable; 