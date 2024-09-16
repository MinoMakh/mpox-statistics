import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'brief-statistics',
  standalone: true,
  templateUrl: './brief-statistics.component.html',
  styleUrls: ['./brief-statistics.component.scss'],
})
export class BriefStatisticsComponent implements OnInit {
  totalCases: number = 0;
  totalDeaths: number = 0;
  newCases: number = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(() => {
      this.totalCases = this.dataService.totalCases;
      this.totalDeaths = this.dataService.totalDeaths;
      this.newCases = this.dataService.newCases;
    });
  }
}
