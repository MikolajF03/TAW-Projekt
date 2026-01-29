import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pl`;
    
    return this.http.get(geoUrl).pipe(
      switchMap((geoData: any) => {
        const city = geoData.city || geoData.locality || 'Nieznano';
        
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        
        return this.http.get(weatherUrl).pipe(
          map((weatherData: any) => ({
            temp: Math.round(weatherData.current_weather.temperature),
            code: weatherData.current_weather.weathercode,
            name: city
          }))
        );
      })
    );
  }

  getWeatherByCity(city: string): Observable<any> {
    return this.getWeatherByCoords(52.2297, 21.0122).pipe(
      map(data => ({ ...data, name: city }))
    );
  }
}