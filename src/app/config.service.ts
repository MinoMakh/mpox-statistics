import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config = {
    // Google news api key
    apiKey: 'dfdde1d982e441da99801a5d1bc92901'
  }

  getApiKey() : string {
    return this.config.apiKey;
  }
}
