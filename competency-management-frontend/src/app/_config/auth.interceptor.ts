import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {ErrorSnackbarService} from "../_services/error-snackbar.service";
import {SpinnerLoaderService} from "../_services/spinner-loader.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private errorSnack: ErrorSnackbarService, private spinnerLoaderService: SpinnerLoaderService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem("authToken");

        let authReq = req;

        if (token) {
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                let message = 'An unknown error occurred';
                this.spinnerLoaderService.hide();

                if (error.error?.message) {
                    message = error.error.message;
                } else if (error.status) {
                    message = `Error ${error.status}: ${error.statusText}`;
                }

                this.errorSnack.showError(message);

                return throwError(() => error);
            })
        );
    }
}
