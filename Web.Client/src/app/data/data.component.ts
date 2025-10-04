import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data',
  imports: [CommonModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {
  title = 'Data Sources';

  // TEMPO data information
  tempoData = {
    title: 'NASA TEMPO (Tropospheric Emissions: Monitoring of Pollution)',
    description: 'NASA\'s TEMPO instrument provides hourly observations of air quality over North America from geostationary orbit. It measures key air pollutants including nitrogen dioxide (NO₂), formaldehyde (HCHO), and ozone (O₃).',
    features: [
      'Hourly measurements of air pollution',
      'Geostationary Earth orbit coverage',
      'High spatial resolution (2.1 km x 4.4 km)',
      'Real-time monitoring capabilities',
      'Covers North America from space'
    ],
    reference: 'NASA Goddard Space Flight Center. (2023). TEMPO: Tropospheric Emissions Monitoring of Pollution. https://tempo.si.edu/',
    imageUrl: '',
    imageAlt: 'NASA TEMPO satellite monitoring air pollution over North America with atmospheric data visualization'
  };

  // Ground data information
  groundData = {
    title: 'Ground-Based Air Quality Measurements',
    description: 'Ground-based air quality measurements from networks like Pandora, TolNet, and OpenAQ provide precise, localized air quality data. These systems include spectrometers, lidars, and sensor networks that measure atmospheric pollutants with high accuracy.',
    features: [
      'Pandora spectrometer networks for column measurements',
      'TolNet lidar systems for vertical profiling',
      'OpenAQ crowdsourced air quality data',
      'High-precision ground-truth validation',
      'Real-time atmospheric composition monitoring'
    ],
    reference: 'NASA Pandora Project, NOAA TolNet, OpenAQ. Ground-based atmospheric monitoring networks. See Resources tab for detailed information.',
    imageUrl: '',
    imageAlt: 'Ground-based atmospheric monitoring station with equipment under aurora display'
  };

  // Weather data information
  weatherData = {
    title: 'Weather Data',
    description: 'NOAA\'s National Weather Service provides comprehensive meteorological data including temperature, humidity, wind patterns, and atmospheric conditions that directly influence air quality and pollutant dispersion.',
    features: [
      'Real-time weather observations',
      'Atmospheric pressure measurements',
      'Wind speed and direction data',
      'Temperature and humidity tracking',
      'Precipitation and visibility data'
    ],
    reference: 'National Oceanic and Atmospheric Administration. (2024). National Weather Service. https://www.weather.gov/',
    imageUrl: '',
    imageAlt: 'NOAA weather monitoring station with meteorological instruments'
  };
}