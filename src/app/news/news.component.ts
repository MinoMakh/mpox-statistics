import { HttpClient } from '@angular/common/http';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { map } from 'rxjs';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewsComponent implements OnInit {
  newsArticles: any[] = [];

  constructor(private http: HttpClient, private configService: ConfigService) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews(): void {
    const apiKey: string = this.configService.getApiKey();
    const url: string = `https://newsapi.org/v2/everything?q=mpox&apiKey=${apiKey}`;

    this.http
      .get(url)
      .pipe(
        map((response: any) => response.articles.slice(0, 10))
      )
      .subscribe((articles: any[]) => {
        this.newsArticles = articles;
      });
  }
}
