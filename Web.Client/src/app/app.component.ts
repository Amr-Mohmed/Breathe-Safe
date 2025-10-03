import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Breathe Safe';
  selectedCity = '';
  currentLocation = '';
  aqiValue = 0;
  aqiPercentage = 0;
  aqiStatus = { 
    class: '', 
    label: '', 
    recommendation: '' 
  };

  // Chart configuration
  chartType: ChartType = 'line';
  selectedPeriod = '7d';
  
  // Chart data
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 14
          },
          color: '#64748b'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        beginAtZero: true,
        max: 200,
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          color: '#64748b'
        },
        title: {
          display: true,
          text: 'AQI Value',
          color: '#64748b'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // Time period options
  timePeriods = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ];

  // Pollutants configuration
  pollutants = [
    { key: 'aqi', name: 'AQI', color: '#4F46E5', visible: true },
    { key: 'pm25', name: 'PM2.5', color: '#EF4444', visible: false },
    { key: 'no2', name: 'NO₂', color: '#F59E0B', visible: false },
    { key: 'o3', name: 'O₃', color: '#10B981', visible: false }
  ];

  // Trend insights
  trendDirection = 'improving';
  trendText = 'Improving';
  trendIcon = '↗️';
  averageAQI = 0;
  bestDay = '';
  worstDay = '';

  // Mock AQI data for different cities
  private cityAQIData: { [key: string]: number } = {
    'new-york': 85,
    'los-angeles': 142,
    'chicago': 68,
    'houston': 95,
    'phoenix': 78,
    'philadelphia': 91,
    'san-antonio': 73,
    'san-diego': 56
  };

  private cityNames: { [key: string]: string } = {
    'new-york': 'New York, NY',
    'los-angeles': 'Los Angeles, CA',
    'chicago': 'Chicago, IL',
    'houston': 'Houston, TX',
    'phoenix': 'Phoenix, AZ',
    'philadelphia': 'Philadelphia, PA',
    'san-antonio': 'San Antonio, TX',
    'san-diego': 'San Diego, CA'
  };

  onCityChange(): void {
    if (this.selectedCity) {
      this.currentLocation = this.cityNames[this.selectedCity];
      this.updateAQI(this.cityAQIData[this.selectedCity]);
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      // Show loading state
      this.currentLocation = 'Getting your location...';
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Successfully got location
          const lat = position.coords.latitude.toFixed(2);
          const lon = position.coords.longitude.toFixed(2);
          this.currentLocation = `Your Location (${lat}, ${lon})`;
          
          // Generate realistic AQI based on location (for demo)
          const randomAQI = Math.floor(Math.random() * 150) + 40; // 40-190 range
          this.updateAQI(randomAQI);
        },
        (error) => {
          // Handle different error types but don't show alert immediately
          // Reset location display
          this.currentLocation = '';
          
          // Only show error for permission denied, otherwise silently fall back
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location access denied. Please select a city manually or enable location permissions.');
          } else {
            // For other errors, just clear the loading state without alert
            console.log('Geolocation error:', error.message);
          }
        },
        {
          enableHighAccuracy: false, // Less strict for better compatibility
          timeout: 15000, // 15 seconds - more time
          maximumAge: 600000 // 10 minutes cache
        }
      );
    } else {
      this.currentLocation = '';
      alert('Geolocation is not supported by this browser. Please select a city manually.');
    }
  }



  private updateAQI(value: number): void {
    this.aqiValue = value;
    this.aqiPercentage = (value / 500) * 100;
    
    if (value <= 50) {
      this.aqiStatus = {
        class: 'good',
        label: 'Good',
        recommendation: 'Air quality is satisfactory. Enjoy outdoor activities!'
      };
    } else if (value <= 100) {
      this.aqiStatus = {
        class: 'moderate',
        label: 'Moderate',
        recommendation: 'Air quality is acceptable for most people. Sensitive individuals should consider limiting outdoor activities.'
      };
    } else if (value <= 150) {
      this.aqiStatus = {
        class: 'unhealthy-sensitive',
        label: 'Unhealthy for Sensitive Groups',
        recommendation: 'Members of sensitive groups may experience health effects. Limit outdoor activities if you experience symptoms.'
      };
    } else if (value <= 200) {
      this.aqiStatus = {
        class: 'unhealthy',
        label: 'Unhealthy',
        recommendation: 'Everyone may begin to experience health effects. Avoid outdoor activities and keep windows closed.'
      };
    } else if (value <= 300) {
      this.aqiStatus = {
        class: 'very-unhealthy',
        label: 'Very Unhealthy',
        recommendation: 'Health alert: everyone may experience serious health effects. Stay indoors and use air purifiers if available.'
      };
    } else {
      this.aqiStatus = {
        class: 'hazardous',
        label: 'Hazardous',
        recommendation: 'Emergency conditions: everyone should avoid outdoor activities and stay indoors with air filtration.'
      };
    }
    
    // Update historical chart when AQI is updated
    this.updateHistoricalChart();
  }

  selectTimePeriod(period: string): void {
    this.selectedPeriod = period;
    this.updateHistoricalChart();
  }

  togglePollutant(pollutantKey: string): void {
    const pollutant = this.pollutants.find(p => p.key === pollutantKey);
    if (pollutant) {
      pollutant.visible = !pollutant.visible;
      this.updateHistoricalChart();
    }
  }

  private updateHistoricalChart(): void {
    const datasets: any[] = [];
    const labels = this.generateTimeLabels(this.selectedPeriod);
    
    // Generate data for each visible pollutant
    this.pollutants.forEach(pollutant => {
      if (pollutant.visible) {
        const data = this.generateHistoricalData(pollutant.key, labels.length);
        datasets.push({
          label: pollutant.name,
          data: data,
          borderColor: pollutant.color,
          backgroundColor: pollutant.color + '20', // 20% opacity
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: pollutant.color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        });
      }
    });

    this.chartData = {
      labels: labels,
      datasets: datasets
    };

    // Update trend insights
    this.updateTrendInsights(datasets[0]?.data || []);
  }

  private generateTimeLabels(period: string): string[] {
    const labels: string[] = [];
    const now = new Date();
    let days = 7;

    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      if (period === '1y') {
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      } else if (period === '90d') {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      } else {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
    }

    return labels;
  }

  private generateHistoricalData(pollutantType: string, length: number): number[] {
    const data: number[] = [];
    let baseValue = this.aqiValue || 75;
    
    // Adjust base value for different pollutants
    switch (pollutantType) {
      case 'pm25': baseValue *= 0.8; break;
      case 'no2': baseValue *= 0.6; break;
      case 'o3': baseValue *= 0.9; break;
    }

    for (let i = 0; i < length; i++) {
      // Create realistic variations with seasonal and weekly patterns
      const seasonalFactor = Math.sin((i / length) * Math.PI * 2) * 0.2;
      const weeklyFactor = Math.sin((i / 7) * Math.PI * 2) * 0.1;
      const randomFactor = (Math.random() - 0.5) * 0.3;
      
      const value = baseValue * (1 + seasonalFactor + weeklyFactor + randomFactor);
      data.push(Math.max(10, Math.min(200, Math.round(value))));
    }

    return data;
  }

  private updateTrendInsights(data: number[]): void {
    if (data.length < 2) return;

    // Calculate average
    this.averageAQI = Math.round(data.reduce((a, b) => a + b, 0) / data.length);

    // Find best and worst days
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const minIndex = data.indexOf(minValue);
    const maxIndex = data.indexOf(maxValue);

    const labels = this.generateTimeLabels(this.selectedPeriod);
    this.bestDay = `${labels[minIndex]} (${minValue})`;
    this.worstDay = `${labels[maxIndex]} (${maxValue})`;

    // Calculate trend (comparing first half vs second half)
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg < firstAvg - 5) {
      this.trendDirection = 'improving';
      this.trendText = 'Improving';
      this.trendIcon = '📈';
    } else if (secondAvg > firstAvg + 5) {
      this.trendDirection = 'worsening';
      this.trendText = 'Worsening';
      this.trendIcon = '📉';
    } else {
      this.trendDirection = 'stable';
      this.trendText = 'Stable';
      this.trendIcon = '➡️';
    }
  }
}
