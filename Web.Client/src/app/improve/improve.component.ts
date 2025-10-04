import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-improve',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="improve-section">
      <div class="improve-hero">
        <div class="hero-content">
          <h1 class="improve-title">Improve Public Health & Environmental Awareness</h1>
          <p class="improve-lead">Empowering communities to take action for cleaner air and a healthier future.</p>
        </div>
      </div>
      <div class="improve-grid">
        <div class="improve-card pollution">
          <div class="card-icon">🌱</div>
          <h3>Reduce Air Pollution</h3>
          <ul>
            <li>Use public transport, cycle, or walk instead of driving.</li>
            <li>Limit burning of waste and use cleaner fuels.</li>
            <li>Support local clean energy initiatives.</li>
          </ul>
        </div>
        <div class="improve-card health">
          <div class="card-icon">🏥</div>
          <h3>Protect Public Health</h3>
          <ul>
            <li>Monitor local AQI and follow health advisories.</li>
            <li>Use air purifiers and keep windows closed during high pollution events.</li>
            <li>Encourage regular health checkups for vulnerable groups.</li>
          </ul>
        </div>
        <div class="improve-card awareness">
          <div class="card-icon">📢</div>
          <h3>Raise Environmental Awareness</h3>
          <ul>
            <li>Share air quality information with your community.</li>
            <li>Participate in clean air campaigns and educational events.</li>
            <li>Advocate for stronger air quality policies.</li>
          </ul>
        </div>
        <div class="improve-card science">
          <div class="card-icon">🔬</div>
          <h3>Support Science & Innovation</h3>
          <ul>
            <li>Promote citizen science air monitoring projects.</li>
            <li>Stay informed about new air quality technologies.</li>
            <li>Collaborate with local schools and organizations.</li>
          </ul>
        </div>
      </div>
      <div class="improve-resources">
        <h2>Resources & Further Reading</h2>
        <ul>
          <li><a href="https://www.epa.gov/air-research" target="_blank"><span class="resource-icon">🔗</span> EPA Air Research</a></li>
          <li><a href="https://www.who.int/health-topics/air-pollution" target="_blank"><span class="resource-icon">🌍</span> WHO: Air Pollution & Health</a></li>
          <li><a href="https://www.airnow.gov/" target="_blank"><span class="resource-icon">📊</span> AirNow: Real-time AQI</a></li>
        </ul>
        <button class="share-btn" (click)="sharePage()">Share This Page</button>
      </div>
    </div>
  `,
  styles: [`
    .improve-section {
      padding: 0 0 3rem 0;
      background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
      min-height: 100vh;
    }
    .improve-hero {
      padding: 3.5rem 0 2.5rem 0;
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .improve-title {
      text-align: center;
      font-size: 2.3rem;
      font-weight: 700;
      color: #4F46E5;
      margin-bottom: 1.2rem;
    }
    .improve-lead {
      text-align: center;
      font-size: 1.15rem;
      color: #475569;
      margin-bottom: 2.5rem;
      font-weight: 500;
    }
    .improve-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto 3rem auto;
    }
    .improve-card {
      background: white;
      border-radius: 18px;
      box-shadow: 0 4px 20px rgba(79, 70, 229, 0.08);
      padding: 2rem 1.5rem;
      text-align: left;
      border-top: 6px solid #4F46E5;
      transition: transform 0.3s ease;
      position: relative;
      min-height: 220px;
      overflow: hidden;
    }
    .improve-card .card-icon {
      position: absolute;
      top: 1.1rem;
      right: 1.2rem;
      font-size: 2.2rem;
      opacity: 0.18;
      pointer-events: none;
    }
    .improve-card.pollution { border-top-color: #22c55e; }
    .improve-card.health { border-top-color: #ef4444; }
    .improve-card.awareness { border-top-color: #f59e0b; }
    .improve-card.science { border-top-color: #6366f1; }
    .improve-card h3 {
      font-size: 1.15rem;
      margin-bottom: 1rem;
      color: #1e293b;
      font-weight: 700;
    }
    .improve-card ul {
      margin: 0;
      padding-left: 1.2rem;
      color: #64748b;
      font-size: 0.98rem;
      line-height: 1.6;
    }
    .improve-resources {
      background: #eef2ff;
      border-radius: 14px;
      padding: 2rem 1.5rem;
      max-width: 700px;
      margin: 2rem auto 0 auto;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.05);
      text-align: left;
      position: relative;
    }
    .resource-icon { font-size: 1.1rem; margin-right: 0.3rem; }
    .share-btn {
      position: absolute;
      top: 1.2rem;
      right: 1.2rem;
      background: linear-gradient(135deg,#4F46E5,#7C3AED);
      color: #fff;
      border: none;
      border-radius: 20px;
      padding: 0.5rem 1.3rem;
      font-size: 0.95rem;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(79,70,229,0.12);
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    .share-btn:hover {
      background: linear-gradient(135deg,#7C3AED,#4F46E5);
      transform: translateY(-2px) scale(1.04);
    }
    .improve-resources h2 {
      font-size: 1.2rem;
      color: #4F46E5;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    .improve-resources ul {
      margin: 0;
      padding-left: 1.2rem;
      color: #475569;
      font-size: 0.98rem;
      line-height: 1.6;
    }
    .improve-resources a {
      color: #4F46E5;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .improve-resources a:hover {
      color: #7C3AED;
    }
    @media (max-width: 700px) {
      .improve-section { padding: 2rem 0 1.5rem 0; }
      .improve-title { font-size: 1.5rem; }
      .improve-lead { font-size: 1rem; }
      .improve-grid { gap: 1rem; }
      .improve-card { padding: 1.2rem 0.7rem; }
      .improve-resources { padding: 1rem 0.7rem; }
    }
  `]
})
export class ImproveComponent {
  sharePage() {
    if (navigator.share) {
      navigator.share({
        title: 'Improve Public Health & Environmental Awareness',
        text: 'Discover actionable tips to improve air quality and public health!',
        url: window.location.href
      });
    } else {
      window.open(window.location.href, '_blank');
    }
  }
}
