import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../services/data.service';
import 'chartjs-adapter-date-fns';
import { BehaviorSubject, combineLatest, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  private chart: Chart | undefined;
  dates: string[] = [];
  confirmedCases: number[] = [];
  confirmedDeaths: number[] = [];
  newCases: number[] = [];
  selectedOption$ = new BehaviorSubject<string>('World');
  filteredCountries: string[] = [];
  allCountries: string[] = [];

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    // Fetch all countries and set up filtering
    this.dataService.latestEntries.subscribe((entries) => {
      this.allCountries = entries.map((country: any) => country.location);
      this.filteredCountries = [...this.allCountries];
    });


    // Subscribe to both the dataService and selectedOption$ observables
    combineLatest([this.dataService.getData(), this.selectedOption$])
      .pipe(
        switchMap(([data, selectedOption]) => {
          // Filter data based on selectedOption
          const areaData = data.filter(
            (country) => country.location === selectedOption
          );

          // Extract values for chart
          this.dates = areaData.map((entry) => entry.date);
          this.confirmedCases = areaData.map((entry) => entry.total_cases);
          this.confirmedDeaths = areaData.map((entry) => entry.total_deaths);
          this.newCases = areaData.map((entry) => entry.new_cases);

          // Return an observable that resolves once data is processed
          return of(null); // Replace with actual observable if needed
        })
      )
      .subscribe({
        next: () => {
          // Create or update the chart
          this.createChart();
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }

  ngOnDestroy(): void {
    // Ensure to destroy the chart when the component is destroyed
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    // Destroy the previous chart instance if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    Chart.register(...registerables);

    const canvas = document.getElementById('chart') as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.dates,
            datasets: [
              {
                label: 'Confirmed Cases',
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgb(0, 123, 255)',
                data: this.confirmedCases,
              },
              {
                label: 'Confirmed Deaths',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                data: this.confirmedDeaths,
              },
              {
                label: 'New Cases',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                data: this.newCases,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'month',
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.error('Failed to get 2D context');
      }
    } else {
      console.error('Canvas element not found');
    }
  }

  selectCountry(location: string): void {
    this.selectedOption$.next(location);
  }

  filterCountries(event: Event): void {
    const input = event.target as HTMLInputElement;
    const search = input.value.toLowerCase();
    this.filteredCountries = this.allCountries.filter((country) =>
      country.toLowerCase().includes(search)
    );
  }
}
