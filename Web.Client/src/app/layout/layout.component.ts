import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#4F46E5"/>
            <circle cx="12" cy="12" r="10" stroke="#4F46E5" stroke-width="2" fill="none"/>
          </svg>
          <span class="logo-text">Breathe Safe</span>
        </div>
        <div class="nav-right">
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item">
              <a routerLink="/dashboard" class="nav-link" routerLinkActive="active">AQI Predection</a>
            </li>
            <li class="nav-item">
              <a routerLink="/improve" class="nav-link" routerLinkActive="active">Health Tips</a>
            </li>
            <li class="nav-item">
              <a routerLink="/data" class="nav-link" routerLinkActive="active">Data Sources</a>
            </li>
          </ul>
          <a routerLink="/subscription" class="subscription-btn" routerLinkActive="subscription-active">
            Subscribe
          </a>
        </div>
      </div>
    </nav>

    
    <div class="main-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    /* Modern Navbar Styles */
    .navbar {
      background: linear-gradient(135deg, 
        rgba(17, 24, 39, 0.8), 
        rgba(30, 41, 59, 0.9), 
        rgba(79, 70, 229, 0.1)
      );
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.5rem 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.12),
        0 2px 8px rgba(79, 70, 229, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: transform 0.3s ease;
    }

    .nav-logo:hover {
      transform: translateY(-1px);
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      filter: drop-shadow(0 2px 8px rgba(79, 70, 229, 0.3));
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, 
        #60A5FA 0%, 
        #A78BFA 35%, 
        #F472B6 70%, 
        #FBBF24 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0.5rem;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .nav-item {
      position: relative;
    }

    .nav-link {
      display: block;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      font-size: 0.9rem;
      padding: 0.6rem 1.2rem;
      border-radius: 25px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(79, 70, 229, 0.2), 
        rgba(124, 58, 237, 0.2)
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 25px;
    }

    .nav-link:hover {
      color: rgba(255, 255, 255, 1);
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
    }

    .nav-link:hover::before {
      opacity: 1;
    }

    .nav-link.active {
      color: rgba(255, 255, 255, 1);
      background: linear-gradient(135deg, 
        rgba(79, 70, 229, 0.8), 
        rgba(124, 58, 237, 0.8)
      );
      box-shadow: 
        0 4px 20px rgba(79, 70, 229, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .subscription-btn {
      display: block;
      text-decoration: none;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.7rem 1.5rem;
      border-radius: 25px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 12px rgba(34, 197, 94, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .subscription-btn:hover {
      background: linear-gradient(135deg, #16a34a, #15803d);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
    }

    .subscription-btn.subscription-active {
      background: linear-gradient(135deg, #16a34a, #15803d);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5);
    }

    .main-layout {
      margin-top: 0;
      padding-top: 65px;
      min-height: 100vh;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .navbar {
        padding: 0.4rem 0;
      }

      .nav-container {
        padding: 0 1rem;
      }

      .nav-right {
        gap: 0.5rem;
      }
      
      .nav-menu {
        gap: 0.25rem;
        padding: 0.3rem;
      }

      .nav-link {
        padding: 0.5rem 0.8rem;
        font-size: 0.85rem;
      }

      .subscription-btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
      }

      .logo-text {
        font-size: 1.25rem;
      }

      .main-layout {
        padding-top: 60px;
      }
    }

    @media (max-width: 640px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-right {
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
      }

      .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
      }

      .nav-link {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
      }

      .subscription-btn {
        align-self: center;
        padding: 0.6rem 1.5rem;
      }

      .main-layout {
        padding-top: 80px;
      }
    }
  `]
})
export class LayoutComponent {
}