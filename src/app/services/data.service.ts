import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl =
    'https://catalog.ourworldindata.org/explorers/who/latest/monkeypox/monkeypox.csv';
  private dataSubject = new BehaviorSubject<any[]>([]);
  loading = new BehaviorSubject<boolean>(true);

  latestEntries = new BehaviorSubject<any[]>([]);
  minCases = new BehaviorSubject<number>(Number.MAX_VALUE);
  maxCases = new BehaviorSubject<number>(Number.MIN_VALUE);
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
      .get(this.dataUrl, { responseType: 'text' })
      .pipe(
        tap({
          next: (csvData) => {
            Papa.parse(csvData, {
              header: true,
              complete: (result) => {
                const data = result.data as any[];
                this.processData(data);
                this.getTotalDeathsAndNewCases(data);
                this.getTotalCases();
                this.loading.next(false);
                this.dataSubject.next(data);
              },
              error: (error: any) => {
                console.error('Error parsing CSV data.', error);
                this.loading.next(false);
              },
            });
          },
          error: (error) => {
            console.error('Error loading data.', error);
            this.loading.next(false);
          },
        })
      )
      .subscribe();
  }

  processData(data: any[]): void {
    const latestEntriesMap = new Map<string, any>();

    data.forEach((item) => {
      const location = item.location;
      const currentDate = new Date(item.date);

      if (!latestEntriesMap.has(location) ||
        currentDate > new Date(latestEntriesMap.get(location).date)) {
        latestEntriesMap.set(location, item);
        
        // Calculating min and max values
        if (item && item.total_cases && item.total_cases != 0) {
          this.minCases.next(Math.min(this.minCases.value, item.total_cases));
        }
        if (item && item.total_cases && !this.continents.some((continent) =>
            String(item.location).includes(continent))) {
          this.maxCases.next(Math.max(this.maxCases.value, item.total_cases));
        }
      }
    });

    this.latestEntries.next(Array.from(latestEntriesMap.values()));
  }

  getTotalCases() {
    const world = this.latestEntries.value.find((c) => c.location === 'World');
    if (world) {
      this.totalCases = world.total_cases;
    }
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
    }
  }
}
