import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${environment.authCredentials}`,
        'Content-Type': 'application/json'
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || error.message || 'An error occurred';
        this.snackBar.open(message, 'Close', {
          duration: 4000,
          panelClass: ['error']
        });
        return throwError(() => error);
      })
    );
  }
}
