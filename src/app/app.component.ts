import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BriefStatisticsComponent } from './brief-statistics/brief-statistics.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { TitleDescriptionComponent } from './title-description/title-description.component';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './chart/chart.component';
import { ContentComponent } from './content/content.component';
import { NewsComponent } from './news/news.component';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BriefStatisticsComponent,
    WorldMapComponent,
    TitleDescriptionComponent,
    TableComponent,
    ChartComponent,
    ContentComponent,
    NewsComponent,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  {

}
