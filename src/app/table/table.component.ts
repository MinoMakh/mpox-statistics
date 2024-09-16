import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  sortedData: any[] = [];
  currentSortColumn: string | null = null;
  currentSortOrder: number = 1; // 1 for ascending, -1 for descending

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.latestEntries.subscribe((data) => {
      this.sortedData = [...data]; // Copy the data to sortedData
    });
  }

  sortTable(column: string): void {
    // Toggle sort order if the same column is clicked, otherwise reset to ascending
    if (this.currentSortColumn === column) {
      this.currentSortOrder = -this.currentSortOrder;
    } else {
      this.currentSortColumn = column;
      this.currentSortOrder = -1;
    }

    this.sortedData.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Parse as numbers if they are numeric strings
      if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      // Handle cases where the values are numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * this.currentSortOrder;
      }

      // Handle cases where the values are strings (for example, 'location')
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * this.currentSortOrder;
      }

      return 0; // If the values are equal
    });
  }
}
