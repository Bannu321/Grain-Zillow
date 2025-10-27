import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import sensorService from '../../services/sensorService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const [currentReadings, setCurrentReadings] = useState({
    temperature: 0,
    humidity: 0,
    gasLevel: 0,
    lastUpdated: null
  });
  const [deviceStatus, setDeviceStatus] = useState('offline');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [chartData, setChartData] = useState({
    temperature: { labels: [], data: [] },
    humidity: { labels: [], data: [] },
    gas: { labels: [], data: [] }
  });
  const [controlLoading, setControlLoading] = useState(null);

  // Fetch current sensor readings
  const fetchCurrentReadings = async () => {
    if (!user?._id) return;

    const result = await sensorService.getCurrentReadings(user._id);
    if (result.success && result.data) {
      const { sensorData, status } = result.data;
      if (sensorData) {
        setCurrentReadings({
          temperature: sensorData.temperature || 0,
          humidity: sensorData.humidity || 0,
          gasLevel: sensorData.gasLevel || 0,
          lastUpdated: sensorData.timestamp || new Date()
        });
      }
      setDeviceStatus(status || 'offline');
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // Fetch historical data for charts
  const fetchHistoricalData = async () => {
    // Mock data for now - replace with actual API calls
    // In production, call sensorService.getHistoricalData() with appropriate params
    const mockLabels = generateTimeLabels(timeRange);
    const mockTempData = generateMockData(mockLabels.length, 20, 35);
    const mockHumidityData = generateMockData(mockLabels.length, 40, 70);
    const mockGasData = generateMockData(mockLabels.length, 0, 200);

    setChartData({
      temperature: { labels: mockLabels, data: mockTempData },
      humidity: { labels: mockLabels, data: mockHumidityData },
      gas: { labels: mockLabels, data: mockGasData }
    });
  };

  // Generate time labels based on range
  const generateTimeLabels = (range) => {
    const labels = [];
    const points = range === '1h' ? 12 : range === '6h' ? 24 : range === '24h' ? 24 : 48;
    for (let i = points; i >= 0; i--) {
      if (range === '1h') {
        labels.push(`${i * 5}m ago`);
      } else if (range === '6h') {
        labels.push(`${i * 15}m ago`);
      } else {
        labels.push(`${i}h ago`);
      }
    }
    return labels.reverse();
  };

  // Generate mock sensor data
  const generateMockData = (count, min, max) => {
    return Array.from({ length: count }, () =>
      Math.random() * (max - min) + min
    );
  };

  // Initial data fetch
  useEffect(() => {
    fetchCurrentReadings();
    fetchHistoricalData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchCurrentReadings, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Refetch historical data when time range changes
  useEffect(() => {
    fetchHistoricalData();
  }, [timeRange]);

  // Get status and color based on sensor value
  const getSensorStatus = (type, value) => {
    if (type === 'temperature') {
      if (value < 30) return { status: 'Normal', color: 'green', borderColor: 'border-grain-green', bgColor: 'bg-white' };
      if (value < 35) return { status: 'Warning', color: 'yellow', borderColor: 'border-grain-yellow', bgColor: 'bg-yellow-50' };
      return { status: 'Critical', color: 'red', borderColor: 'border-red-500', bgColor: 'bg-red-50' };
    } else if (type === 'humidity') {
      if (value >= 40 && value <= 70) return { status: 'Normal', color: 'green', borderColor: 'border-grain-green', bgColor: 'bg-white' };
      if ((value >= 30 && value < 40) || (value > 70 && value <= 80)) return { status: 'Warning', color: 'yellow', borderColor: 'border-grain-yellow', bgColor: 'bg-yellow-50' };
      return { status: 'Critical', color: 'red', borderColor: 'border-red-500', bgColor: 'bg-red-50' };
    } else if (type === 'gas') {
      if (value < 100) return { status: 'Normal', color: 'green', borderColor: 'border-grain-green', bgColor: 'bg-white' };
      if (value < 500) return { status: 'Warning', color: 'yellow', borderColor: 'border-grain-yellow', bgColor: 'bg-yellow-50' };
      return { status: 'Critical', color: 'red', borderColor: 'border-red-500', bgColor: 'bg-red-50' };
    }
    return { status: 'Unknown', color: 'gray', borderColor: 'border-gray-300', bgColor: 'bg-white' };
  };

  // IoT device control
  const handleDeviceControl = async (command) => {
    if (deviceStatus === 'offline') {
      toast.error('Device is offline');
      return;
    }

    setControlLoading(command);
    // Mock device control - replace with actual API
    const result = await sensorService.controlDevice(user?.zillowDevice?.deviceId, command);

    if (result.success) {
      toast.success(`Command ${command} sent successfully`);
    } else {
      toast.error(result.message || 'Failed to send command');
    }
    setControlLoading(null);
  };

  // Chart options generator
  const getChartOptions = (title, unit, color) => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        font: { size: 16, weight: 'bold' },
        color: '#374151'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(1)} ${unit}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: unit,
          font: { size: 12 },
          color: '#6b7280'
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  });

  // Chart data formatter
  const formatChartData = (labels, data, color) => ({
    labels,
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grain-green"></div>
      </div>
    );
  }

  const tempStatus = getSensorStatus('temperature', currentReadings.temperature);
  const humidityStatus = getSensorStatus('humidity', currentReadings.humidity);
  const gasStatus = getSensorStatus('gas', currentReadings.gasLevel);

  return (
    <div className="space-y-6">
      {/* Current Readings Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Current Sensor Readings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature Card */}
          <div className={`rounded-xl border-l-8 ${tempStatus.borderColor} ${tempStatus.bgColor} p-6 shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Temperature</p>
                <p className="text-5xl font-bold text-gray-800 mt-2">
                  {currentReadings.temperature.toFixed(1)}
                </p>
                <p className="text-gray-500 text-sm mt-1">°C</p>
                <p className={`text-xs mt-2 font-semibold text-${tempStatus.color}-600`}>
                  {tempStatus.status}
                </p>
              </div>
              <span className="text-5xl">🌡️</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Last updated: {new Date(currentReadings.lastUpdated).toLocaleTimeString()}
            </p>
          </div>

          {/* Humidity Card */}
          <div className={`rounded-xl border-l-8 ${humidityStatus.borderColor} ${humidityStatus.bgColor} p-6 shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Humidity</p>
                <p className="text-5xl font-bold text-gray-800 mt-2">
                  {currentReadings.humidity.toFixed(1)}
                </p>
                <p className="text-gray-500 text-sm mt-1">%</p>
                <p className={`text-xs mt-2 font-semibold text-${humidityStatus.color}-600`}>
                  {humidityStatus.status}
                </p>
              </div>
              <span className="text-5xl">💧</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Last updated: {new Date(currentReadings.lastUpdated).toLocaleTimeString()}
            </p>
          </div>

          {/* Gas Level Card */}
          <div className={`rounded-xl border-l-8 ${gasStatus.borderColor} ${gasStatus.bgColor} p-6 shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Gas Level</p>
                <p className="text-5xl font-bold text-gray-800 mt-2">
                  {currentReadings.gasLevel.toFixed(0)}
                </p>
                <p className="text-gray-500 text-sm mt-1">ppm</p>
                <p className={`text-xs mt-2 font-semibold text-${gasStatus.color}-600`}>
                  {gasStatus.status}
                </p>
              </div>
              <span className="text-5xl">⚠️</span>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Last updated: {new Date(currentReadings.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Historical Trends Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Historical Trends</h3>
          {/* Time range selector */}
          <div className="flex space-x-2">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-grain-green text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range === '1h' ? '1 Hour' : range === '6h' ? '6 Hours' : range === '24h' ? '24 Hours' : '7 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Temperature Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <Line
              data={formatChartData(chartData.temperature.labels, chartData.temperature.data, '#f59e0b')}
              options={getChartOptions('Temperature Trends', '°C', '#f59e0b')}
            />
          </div>

          {/* Humidity Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <Line
              data={formatChartData(chartData.humidity.labels, chartData.humidity.data, '#3b82f6')}
              options={getChartOptions('Humidity Trends', '%', '#3b82f6')}
            />
          </div>

          {/* Gas Level Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <Line
              data={formatChartData(chartData.gas.labels, chartData.gas.data, '#ef4444')}
              options={getChartOptions('Gas Level Trends', 'ppm', '#ef4444')}
            />
          </div>
        </div>
      </div>

      {/* Device Control Section */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">IoT Device Control</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Device Status</p>
            <p className={`text-lg font-semibold ${deviceStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
              {deviceStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleDeviceControl('fan_on')}
              disabled={deviceStatus === 'offline' || controlLoading === 'fan_on'}
              className="px-4 py-2 bg-grain-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {controlLoading === 'fan_on' ? 'Sending...' : 'Turn On Fan'}
            </button>
            <button
              onClick={() => handleDeviceControl('fan_off')}
              disabled={deviceStatus === 'offline' || controlLoading === 'fan_off'}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {controlLoading === 'fan_off' ? 'Sending...' : 'Turn Off Fan'}
            </button>
            <button
              onClick={() => handleDeviceControl('pump_on')}
              disabled={deviceStatus === 'offline' || controlLoading === 'pump_on'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {controlLoading === 'pump_on' ? 'Sending...' : 'Turn On Pump'}
            </button>
            <button
              onClick={() => handleDeviceControl('pump_off')}
              disabled={deviceStatus === 'offline' || controlLoading === 'pump_off'}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {controlLoading === 'pump_off' ? 'Sending...' : 'Turn Off Pump'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
