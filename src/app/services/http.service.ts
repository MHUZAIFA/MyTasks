import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { delay, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class HttpService {
  constructor(protected http: HttpClient) { }

  // Error handling
  protected handleRetry(errors: Observable<HttpResponse<any>>) {
    let retries = 2;
    return errors
      .pipe(mergeMap((error: HttpResponse<any>) =>
        // All 4xx status codes we do not retry
        ((error.status !== undefined && error.status.toString().indexOf('4') === 0)) || retries-- === 0 ?
          throwError(error) :
          of(error).pipe(delay(1000))));
  }
}
