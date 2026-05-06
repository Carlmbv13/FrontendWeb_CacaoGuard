import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    pageTitle: {
      fontSize: '28px',
      marginBottom: '20px',
      color: '#333'
    },
    loading: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    statValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#2e7d32'
    },
    statLabel: {
      color: '#666',
      marginTop: '10px'
    },
    section: {
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    healthScore: {
      textAlign: 'center'
    },
    healthValue: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#2e7d32',
      marginBottom: '15px'
    },
    progressBar: {
      background: '#e0e0e0',
      borderRadius: '10px',
      height: '20px',
      overflow: 'hidden'
    },
    progressFill: {
      background: '#2e7d32',
      height: '100%',
      transition: 'width 0.3s'
    },
    riskGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '15px',
      textAlign: 'center'
    },
    severityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '15px',
      textAlign: 'center'
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Dashboard</h1>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats?.total_farms || 0}</div>
            <div style={styles.statLabel}>Total Farms</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats?.total_scans || 0}</div>
            <div style={styles.statLabel}>Total Scans</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#ff9800'}}>{stats?.active_alerts || 0}</div>
            <div style={styles.statLabel}>Active Alerts</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statValue, color: '#f44336'}}>{stats?.critical_alerts || 0}</div>
            <div style={styles.statLabel}>Critical Alerts</div>
          </div>
        </div>

        <div style={styles.section}>
          <h2>Farm Health Overview</h2>
          <div style={styles.healthScore}>
            <div style={styles.healthValue}>{stats?.avg_health_score?.toFixed(1) || 0}%</div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${stats?.avg_health_score || 0}%`}}></div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2>Risk Distribution</h2>
          <div style={styles.riskGrid}>
            <div><strong>Low Risk:</strong> {stats?.risk_breakdown?.Low || 0}</div>
            <div><strong>Medium Risk:</strong> {stats?.risk_breakdown?.Medium || 0}</div>
            <div><strong>High Risk:</strong> {stats?.risk_breakdown?.High || 0}</div>
            <div><strong>Critical:</strong> {stats?.risk_breakdown?.Critical || 0}</div>
          </div>
        </div>

        <div style={styles.section}>
          <h2>Scan Results</h2>
          <div style={styles.severityGrid}>
            <div><strong>Healthy:</strong> {stats?.severity_breakdown?.Healthy || 0}</div>
            <div><strong>Mild:</strong> {stats?.severity_breakdown?.Mild || 0}</div>
            <div><strong>Moderate:</strong> {stats?.severity_breakdown?.Moderate || 0}</div>
            <div><strong>Severe:</strong> {stats?.severity_breakdown?.Severe || 0}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;