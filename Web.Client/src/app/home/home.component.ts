import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Breathe Safe';
  
  
  whoStats = {
    globalPopulationAffected: 99,
    annualDeaths: 4200000,
    childrenDeaths: 600000,
  economicCost: 2900000000000,
    countriesMostAffected: 'Low- and middle-income countries'
  };

  
  formatNumber(num: number): string {
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(1) + ' trillion';
    } else if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + ' billion';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' million';
    }
    return num.toLocaleString();
  }
}