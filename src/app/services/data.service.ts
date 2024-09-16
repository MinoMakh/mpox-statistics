import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'assets/data.json';
  private dataSubject = new BehaviorSubject<any[]>([]);

  latestEntries = new BehaviorSubject<any[]>([]);
  minCases = Number.MAX_VALUE;
  maxCases = Number.MIN_VALUE;
  totalCases = 0;
  totalDeaths = 0;
  newCases = 0;
  continents = [
    'World',
    'Africa',
    'Europe',
    'North America',
    'South America',
    'Asia',
  ];

  constructor(private http: HttpClient) {
    this.loadData();
  }

  getData(): Observable<any[]> {
    return this.dataSubject.asObservable();
  }

  private loadData(): void {
    this.http
      .get<any[]>(this.dataUrl)
      .pipe(
        tap({
          next: (data) => {
            this.processData(data);
            this.getTotalDeathsAndNewCases(data);
            this.getTotalCases();
            this.dataSubject.next(data);
          },
          error: (error) => console.error('Error loading data.', error),
        })
      )
      .subscribe();
  }

  processData(data: any[]): void {
    const latestEntriesMap = new Map<string, any>();

    data.forEach((item) => {
      const location = item.location;
      const currentDate = new Date(item.date);

      if (
        !latestEntriesMap.has(location) ||
        currentDate > new Date(latestEntriesMap.get(location).date)
      ) {
        latestEntriesMap.set(location, item);
        if (item != null && item.total_cases != 0) {
          this.minCases = Math.min(this.minCases, item.total_cases);
        }
        if (
          !this.continents.some((continent) =>
            String(item.location).includes(continent)
          )
        ) {
          this.maxCases = Math.max(this.maxCases, item.total_cases);
        }
      }
    });

    this.latestEntries.next(Array.from(latestEntriesMap.values()));
  }

  getTotalCases() {
    const world = this.latestEntries.value.filter((c) => c.location == 'World')[0];
    this.totalCases = world.total_cases;
  }

  getTotalDeathsAndNewCases(data: any[]): void {
    // Filter data for the location "World"
    const worldData = data.filter((item) => item.location === 'World');

    if (worldData.length > 0) {
      const latestEntry = worldData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      this.totalDeaths = latestEntry.total_deaths;
      this.newCases = latestEntry.new_cases;
    } else {
      console.warn('No data found for the location "World".');
    }
  }
}
