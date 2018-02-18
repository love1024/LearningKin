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
  private url = 'http://abc-node-server.herokuapp.com/';

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
  public post(data: any): Observable<any> {
    return this.http.post(this.url, data);
  }

  /**
   *  To store general information about blog
   *  store it in tile database
   * @param {*} data
   * @returns {Observable<any>}
   * @memberof HttpService
   */
  public postTile(data: any): Observable<any> {
    return this.http.post(this.url + '/tile', data);
  }

  /**
   * Get all data from the server
   *
   * @memberof HttpService
   */
  public getAll(): Observable<any> {
    return this.http.get(this.url);
  }

  /**
   * Get all tiles of blogs
   *
   * @returns {Observable<any>}
   * @memberof HttpService
   */
  public getAllTiles(): Observable<any> {
    return this.http.get(this.url + '/tiles');
  }

  /**
   * Get the blog by id
   *
   * @param {string} id
   * @returns
   * @memberof HttpService
   */
  public getById(id: string): Observable<any> {
    return this.http.get(this.url + '/' + id);
  }
}
