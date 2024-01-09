import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AppConfiguration } from "read-appsettings-json"

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private API_URL = AppConfiguration.Setting().apiBaseUrl;
    
    constructor(private http: HttpClient) {}

    async getUrbanObjectTypes(): Promise<any> {
        return lastValueFrom(this.http.request("GET", this.API_URL + 'types', {}));
    }
    
    async getDistricts(): Promise<any> {
        return lastValueFrom(this.http.request("GET", this.API_URL + 'districts', {}));
    }

    async getUrbanObjects(forbiddenIds: number[], allowedTypes: string[], allowedDistricts: number, amount: number): Promise<any> {
        const params = new HttpParams({
            fromObject: {
                'forbiddenIds[]': forbiddenIds,
                'allowedTypes[]': allowedTypes,
                'allowedDistricts': allowedDistricts,
                'amount': amount,
            }
        });
        return lastValueFrom(this.http.get(this.API_URL + 'urbanObjects', {
            params: params
        }));
    }
}
