import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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

  
  selectedStakeholder = 'general';
  stakeholders = [
    { value: 'general', label: 'General Public', icon: '👥' },
    { value: 'schools', label: 'Schools & Athletics', icon: '🏫' },
    { value: 'eldercare', label: 'Senior Care Facilities', icon: '👴' },
    { value: 'emergency', label: 'Emergency Response', icon: '🚨' }
  ];

  
  chartType: ChartType = 'line';
  selectedPeriod = '7d';
  
  
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

  
  timePeriods = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ];

  
  pollutants = [
    { key: 'aqi', name: 'AQI', color: '#4F46E5', visible: true },
    { key: 'pm25', name: 'PM2.5', color: '#EF4444', visible: false },
    { key: 'no2', name: 'NO₂', color: '#F59E0B', visible: false },
    { key: 'o3', name: 'O₃', color: '#10B981', visible: false }
  ];

  
  trendDirection = 'improving';
  trendText = 'Improving';
  trendIcon = '↗️';
  averageAQI = 0;
  bestDay = '';
  worstDay = '';

  
  currentActivityGuidance: any = {};
  
  
  private stakeholderConfig = {
    general: {
      thresholds: { safe: 50, moderate: 100, unhealthy: 150 },
      activities: [
        { name: 'Outdoor Exercise', safeLevel: 100, icon: '🏃' },
        { name: 'Walking/Jogging', safeLevel: 150, icon: '🚶' },
        { name: 'Outdoor Dining', safeLevel: 100, icon: '🍽️' }
      ]
    },
    schools: {
      thresholds: { safe: 50, moderate: 75, unhealthy: 100 },
      activities: [
        { name: 'Outdoor Recess', safeLevel: 75, icon: '⚽' },
        { name: 'Athletic Practice', safeLevel: 100, icon: '🏃‍♂️' },
        { name: 'Field Trips', safeLevel: 75, icon: '🚌' },
        { name: 'Graduation Ceremony', safeLevel: 125, icon: '🎓' }
      ]
    },
    eldercare: {
      thresholds: { safe: 35, moderate: 50, unhealthy: 75 },
      activities: [
        { name: 'Outdoor Walking', safeLevel: 50, icon: '👴' },
        { name: 'Garden Activities', safeLevel: 75, icon: '🌻' },
        { name: 'Outdoor Therapy', safeLevel: 50, icon: '🧘‍♀️' }
      ]
    },
    emergency: {
      thresholds: { safe: 100, moderate: 200, unhealthy: 300 },
      activities: [
        { name: 'Emergency Response', safeLevel: 200, icon: '🚨' },
        { name: 'Evacuation Orders', safeLevel: 300, icon: '🚁' },
        { name: 'Shelter-in-Place', safeLevel: 200, icon: '🏠' }
      ]
    },
    policy: {
      thresholds: { safe: 50, moderate: 100, unhealthy: 150 },
      activities: [
        { name: 'Outdoor Events', safeLevel: 100, icon: '🎪' },
        { name: 'Construction Work', safeLevel: 150, icon: '🏗️' },
        { name: 'Traffic Management', safeLevel: 125, icon: '🚦' }
      ]
    },
    tourism: {
      thresholds: { safe: 75, moderate: 125, unhealthy: 175 },
      activities: [
        { name: 'Outdoor Tours', safeLevel: 100, icon: '🗺️' },
        { name: 'Hiking Trails', safeLevel: 125, icon: '🥾' },
        { name: 'Beach Activities', safeLevel: 100, icon: '🏖️' },
        { name: 'Photography Tours', safeLevel: 150, icon: '📸' }
      ]
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check for stakeholder parameter in query params
    this.route.queryParams.subscribe(params => {
      if (params['stakeholder']) {
        this.selectedStakeholder = params['stakeholder'];
        console.log('Selected stakeholder from URL:', this.selectedStakeholder);
        // Update activity guidance based on new stakeholder
        if (this.aqiValue > 0) {
          this.updateActivityGuidance();
        }
      }
    });
  }

  
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

  onStakeholderChange(): void {
    this.updateActivityGuidance();
  
    if (this.aqiValue > 0) {
      this.updateAQI(this.aqiValue);
    }
  }

  private updateActivityGuidance(): void {
    const config = this.stakeholderConfig[this.selectedStakeholder as keyof typeof this.stakeholderConfig];
    if (!config) return;

    this.currentActivityGuidance = {
      stakeholder: this.selectedStakeholder,
      activities: config.activities.map(activity => ({
        ...activity,
        status: this.aqiValue <= activity.safeLevel ? 'safe' : 'caution',
        recommendation: this.aqiValue <= activity.safeLevel 
          ? 'Recommended - Air quality is suitable'
          : `Not recommended - AQI ${this.aqiValue} exceeds safe level of ${activity.safeLevel}`
      }))
    };
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
  
      this.currentLocation = 'Getting your location...';
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          
          const lat = position.coords.latitude.toFixed(2);
          const lon = position.coords.longitude.toFixed(2);
          this.currentLocation = `Your Location (${lat}, ${lon})`;
          
          const randomAQI = Math.floor(Math.random() * 150) + 40;
          this.updateAQI(randomAQI);
        },
        (error) => {
          
          
          this.currentLocation = '';
          
          
          if (error.code === error.PERMISSION_DENIED) {
            alert('Location access denied. Please select a city manually or enable location permissions.');
          } else {
            
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
    
    // Use standard EPA AQI thresholds for classification
    if (value <= 50) {
      this.aqiStatus = {
        class: 'good',
        label: 'Good',
        recommendation: this.getStakeholderRecommendation('good')
      };
    } else if (value <= 100) {
      this.aqiStatus = {
        class: 'moderate',
        label: 'Moderate',
        recommendation: this.getStakeholderRecommendation('moderate')
      };
    } else if (value <= 150) {
      this.aqiStatus = {
        class: 'unhealthy-sensitive',
        label: 'Unhealthy for Sensitive Groups',
        recommendation: this.getStakeholderRecommendation('unhealthy-sensitive')
      };
    } else if (value <= 200) {
      this.aqiStatus = {
        class: 'unhealthy',
        label: 'Unhealthy',
        recommendation: this.getStakeholderRecommendation('unhealthy')
      };
    } else if (value <= 300) {
      this.aqiStatus = {
        class: 'very-unhealthy',
        label: 'Very Unhealthy',
        recommendation: this.getStakeholderRecommendation('very-unhealthy')
      };
    } else {
      this.aqiStatus = {
        class: 'hazardous',
        label: 'Hazardous',
        recommendation: this.getStakeholderRecommendation('hazardous')
      };
    }
    
    // Update activity guidance and historical chart
    this.updateActivityGuidance();
    this.updateHistoricalChart();
  }

  getCurrentStakeholderLabel(): string {
    const stakeholder = this.stakeholders.find(s => s.value === this.selectedStakeholder);
    return stakeholder ? stakeholder.label : 'General Public';
  }

  private getStakeholderRecommendation(level: string): string {
    const recommendations = {
      general: {
        good: 'Air quality is satisfactory. Enjoy outdoor activities!',
        moderate: 'Air quality is acceptable for most people. Sensitive individuals should consider limiting outdoor activities.',
        'unhealthy-sensitive': 'Members of sensitive groups may experience health effects. Limit outdoor activities if you experience symptoms.',
        unhealthy: 'Everyone may begin to experience health effects. Avoid outdoor activities and keep windows closed.',
        'very-unhealthy': 'Health alert: everyone may experience serious health effects. Stay indoors and use air purifiers if available.',
        hazardous: 'Emergency conditions: everyone should avoid outdoor activities and stay indoors with air filtration.'
      },
      schools: {
        good: 'Perfect for all outdoor school activities including recess and sports.',
        moderate: 'Most outdoor activities are safe. Monitor sensitive students during extended activities.',
        'unhealthy-sensitive': 'Cancel outdoor recess. Move PE classes indoors. Consider postponing field trips.',
        unhealthy: 'All outdoor activities should be moved indoors. Close windows and use air filtration.',
        'very-unhealthy': 'School closure recommended. If open, keep all students indoors with air purification.',
        hazardous: 'Emergency school closure. Shelter-in-place procedures if students are present.'
      },
      eldercare: {
        good: 'Safe for all outdoor activities and therapy sessions.',
        moderate: 'Outdoor activities acceptable with monitoring of residents with respiratory conditions.',
        'unhealthy-sensitive': 'Move all activities indoors. Check on residents with breathing difficulties.',
        unhealthy: 'Facility lockdown - no outdoor activities. Increase medical monitoring.',
        'very-unhealthy': 'Medical alert status. Prepare respiratory medications and contact healthcare providers.',
        hazardous: 'Emergency protocols activated. Contact emergency services for vulnerable residents.'
      },
      emergency: {
        good: 'Normal operations. No air quality-related restrictions.',
        moderate: 'Monitor air quality trends. Prepare respiratory equipment.',
        'unhealthy-sensitive': 'Issue public health advisory. Prepare for increased emergency calls.',
        unhealthy: 'Activate air quality emergency response. Issue shelter-in-place recommendations.',
        'very-unhealthy': 'Emergency alert issued. Deploy respiratory protection for first responders.',
        hazardous: 'HAZMAT protocols active. Consider evacuation orders for vulnerable areas.'
      },
      policy: {
        good: 'Normal city operations. Promote outdoor events and activities.',
        moderate: 'Monitor vulnerable populations. Consider air quality advisories.',
        'unhealthy-sensitive': 'Issue public warnings. Restrict outdoor construction work.',
        unhealthy: 'Implement emergency air quality measures. Consider traffic restrictions.',
        'very-unhealthy': 'Declare air quality emergency. Mandatory restrictions on outdoor activities.',
        hazardous: 'State of emergency. Implement all available air quality protection measures.'
      },
      tourism: {
        good: 'Excellent conditions for all outdoor tourism activities.',
        moderate: 'Good for most activities. Inform visitors with respiratory sensitivities.',
        'unhealthy-sensitive': 'Recommend indoor attractions. Provide health advisories to visitors.',
        unhealthy: 'Cancel outdoor tours. Offer refunds or indoor alternatives.',
        'very-unhealthy': 'Tourism advisory issued. Recommend visitors stay indoors.',
        hazardous: 'Tourism emergency - advise against travel to the area.'
      }
    };

    const stakeholderRecs = recommendations[this.selectedStakeholder as keyof typeof recommendations];
    return stakeholderRecs ? stakeholderRecs[level as keyof typeof stakeholderRecs] || recommendations.general[level as keyof typeof recommendations.general] : recommendations.general[level as keyof typeof recommendations.general];
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