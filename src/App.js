import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import TimeSeriesChart from './components/TimeSeriesChart';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [topSourceIPs, setTopSourceIPs] = useState({ labels: [], values: [] });
  const [topDestIPs, setTopDestIPs] = useState({ labels: [], values: [] });
  const [alertSeverity, setAlertSeverity] = useState({ labels: [], values: [], colors: [] });
  const [httpStatusCodes, setHttpStatusCodes] = useState({ labels: [], values: [] });

  useEffect(() => {
    
    const loadJsonData = async () => {
      const response = await axios.get('network-visualizations/src/eve.json');
      const data = response.data;
      processData(data);
    };

   
    const loadCsvData = async () => {
      const response = await axios.get('network-visualizations/src/eve.csv');
      Papa.parse(response.data, {
        header: true,
        complete: (results) => {
          processData(results.data);
        }
      });
    };

    
    loadJsonData();
    
  }, []);

  const processData = (data) => {
    // Process data for time series chart
    const eventTypes = ['alert', 'http', 'ssh', 'dns'];
    const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'];
    const timeSeries = eventTypes.map((type, index) => ({
      label: type,
      data: data.filter(item => item.event_type === type).map(item => ({
        x: new Date(item.timestamp),
        y: 1,
      })),
      color: colors[index],
    }));
    setTimeSeriesData(timeSeries);

    const srcIpCounts = {};
    const destIpCounts = {};
    data.forEach(item => {
      if (srcIpCounts[item.src_ip]) {
        srcIpCounts[item.src_ip]++;
      } else {
        srcIpCounts[item.src_ip] = 1;
      }
      if (destIpCounts[item.dest_ip]) {
        destIpCounts[item.dest_ip]++;
      } else {
        destIpCounts[item.dest_ip] = 1;
      }
    });

    setTopSourceIPs({
      labels: Object.keys(srcIpCounts).slice(0, 10),
      values: Object.values(srcIpCounts).slice(0, 10),
    });

    setTopDestIPs({
      labels: Object.keys(destIpCounts).slice(0, 10),
      values: Object.values(destIpCounts).slice(0, 10),
    });

    const severityCounts = {};
    data.forEach(item => {
      if (severityCounts[item.alert__severity]) {
        severityCounts[item.alert__severity]++;
      } else {
        severityCounts[item.alert__severity] = 1;
      }
    });

    const severityLabels = Object.keys(severityCounts);
    const severityValues = Object.values(severityCounts);
    const severityColors = severityLabels.map((_, index) => colors[index % colors.length]);

    setAlertSeverity({
      labels: severityLabels,
      values: severityValues,
      colors: severityColors,
    });

    
    const httpStatusCounts = {};
    data.forEach(item => {
      if (httpStatusCounts[item.http__status]) {
        httpStatusCounts[item.http__status]++;
      } else {
        httpStatusCounts[item.http__status] = 1;
      }
    });

    setHttpStatusCodes({
      labels: Object.keys(httpStatusCounts),
      values: Object.values(httpStatusCounts),
    });
  };

  return (
    <div style={{ backgroundColor: '#2c2c2c', color: 'white', padding: '20px' }}>
      <h1>Network Visualizations</h1>
      <h2>Time Series Analysis of Events</h2>
      <TimeSeriesChart data={timeSeriesData} />
      <h2>Top Source IPs</h2>
      <BarChart data={topSourceIPs} title="Top Source IPs by Event Count" />
      <h2>Top Destination IPs</h2>
      <BarChart data={topDestIPs} title="Top Destination IPs by Event Count" />
      <h2>Alert Severity Distribution</h2>
      <PieChart data={alertSeverity} title="Alert Severity Distribution" />
      <h2>HTTP Status Codes Distribution</h2>
      <BarChart data={httpStatusCodes} title="HTTP Status Codes Distribution" />
    </div>
  );
};

export default App;
