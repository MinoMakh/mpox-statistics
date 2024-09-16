import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'world-map',
  standalone: true,
  imports: [],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.scss',
})
export class WorldMapComponent implements OnInit {
  constructor(private dataService: DataService) {}

  latestEntries: any[] = [];
  minCases = Number.MAX_VALUE;
  maxCases = Number.MIN_VALUE;
  totalCases = 0;

  ngOnInit(): void {
    this.dataService.getData().subscribe({
      next: (data: any[]) => {
        this.latestEntries = this.dataService.latestEntries.value;
        this.minCases = this.dataService.minCases;
        this.maxCases = this.dataService.maxCases;
        this.totalCases = this.dataService.totalCases;
        this.colorCountries();
        this.addToolTips();
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  colorCountries(): void {
    this.latestEntries.forEach((country) => {
      const name = country.location;

      // Find the country path elements by class or name
      const pathElements = document.querySelectorAll<SVGElement>(
        `svg path[class*="${name}"], svg path[name*="${name}"]`
      );

      if (pathElements.length === 0) {
        console.warn(`Country not found: ${name}`);
        return;
      }

      const currentCases = country.total_cases;

      pathElements.forEach((pathElement) => {
        const color = this.getRedShade(
          currentCases,
          this.minCases,
          this.maxCases,
          this.totalCases
        );
        pathElement.style.fill = color;
      });
    });
  }

  addToolTips() {
    document.addEventListener('DOMContentLoaded', () => {
      const tooltip = document.getElementById('tooltip') as HTMLDivElement;

      document.querySelectorAll<SVGElement>('path').forEach((element) => {
        element.addEventListener('mouseover', (event) => {
          const target = event.target as SVGElement;

          // Get the name from either the class attribute or name attribute
          const countryName =
            target.getAttribute('name') ||
            target.getAttribute('class') ||
            'Unknown Country';

          const country = this.latestEntries.find(
            (country) => country.location == countryName
          );

          console.log(countryName);
          
          tooltip.innerHTML = `Country: ${countryName}<br>Total Cases: ${country.total_cases ?? 0}<br>Total Deaths: ${country.total_deaths ?? 0}<br>New Cases: ${country.new_cases ?? 0}`;
          tooltip.style.display = 'block';
        });

        element.addEventListener('mousemove', (event) => {
          // Optionally, update tooltip position if needed while moving
        });

        element.addEventListener('mouseout', () => {
          tooltip.style.display = 'none';
          console.log(this.latestEntries);
          
        });
      });
    });
  }

  getRedShade(
    cases: number,
    minCases: number,
    maxCases: number,
    totalCases: number
  ): string {
    const normalizedCases = (cases - minCases) / (maxCases - minCases);

    const intensity = normalizedCases * 0.5 + 0.5;

    // Calculate the red value where higher intensity means darker red
    const maxRed = 255;
    const redValue = Math.round(maxRed * intensity);

    return `rgb(${redValue}, 0, 0)`;
  }
}
