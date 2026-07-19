import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerLoaderService {

    private isLoading = new BehaviorSubject<boolean>(false);

    get loading() {
        return this.isLoading.asObservable();
    }

    show() {
        this.isLoading.next(true);
    }

    hide() {
        this.isLoading.next(false);
    }

}
