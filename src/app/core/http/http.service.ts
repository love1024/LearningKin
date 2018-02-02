import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/**
 * Http Service to handle all http
 * request with the server
 * @export
 * @class HttpService
 */
@Injectable()
export class HttpService {
  /** Url of the server */
  private url = 'http://localhost:3000';

  /**
   * Creates an instance of HttpService.
   * @param {HttpClient} http
   * @memberof HttpService
   */
  constructor(private http: HttpClient) { }

  /**
   * Save data to the server using post request
   *
   * @param {*} data
   * @memberof HttpService
   */
  public post(data: any): void {
    this.http.post(this.url, data)
      .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
      );
  }

  /**
   * Get all data from the server
   *
   * @memberof HttpService
   */
  public getAll(): Observable<any> {
    return this.http.get(this.url);
  }
}
