import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
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
  }
}
