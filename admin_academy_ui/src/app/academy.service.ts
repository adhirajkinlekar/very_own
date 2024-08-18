import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademyService {
  private apiUrl = 'http://localhost:5001'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getAcademy(id:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/academy/${id}`);
  }

  createAcademy(formValue :any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/academy`, formValue);
  }

  createCourse(formValue :any, academyId: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/academy/${academyId}/course`, formValue);
  }
}