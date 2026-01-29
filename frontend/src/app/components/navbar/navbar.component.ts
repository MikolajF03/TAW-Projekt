import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WeatherService } from '../../services/weather.service';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ThemeToggleComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  weatherData: any;

  constructor(
    public authService: AuthService,
    private router: Router,
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initWeather();
    }
  }

  private initWeather(): void {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.weatherService.getWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
            .subscribe({
              next: (data) => this.weatherData = data,
              error: () => this.loadDefaultWeather()
            });
        },
        () => this.loadDefaultWeather()
      );
    } else {
      this.loadDefaultWeather();
    }
  }

  private loadDefaultWeather(): void {
    this.weatherService.getWeatherByCity('Warszawa').subscribe({
      next: (data) => this.weatherData = data,
      error: (err) => console.error('Pogoda niedostępna', err)
    });
  }


  getWeatherIcon(): string {
    const code = this.weatherData?.code;
    if (code === 0) return '01d';
    if (code >= 1 && code <= 3) return '02d';
    if (code >= 45 && code <= 48) return '50d';
    if (code >= 51 && code <= 67) return '10d';
    if (code >= 71 && code <= 77) return '13d';
    if (code >= 80 && code <= 82) return '09d';
    if (code >= 95) return '11d';
    return '03d';
  }

  signOut(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    });
  }
}