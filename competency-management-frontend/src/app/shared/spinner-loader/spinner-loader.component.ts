import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SpinnerLoaderService} from '../../_services/spinner-loader.service';

@Component({
    selector: 'app-spinner-loader',
    templateUrl: './spinner-loader.component.html',
    styleUrls: ['./spinner-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {

    isLoading$: Observable<boolean>;

    constructor(private loaderService: SpinnerLoaderService) {
        this.isLoading$ = this.loaderService.loading;
    }

    ngOnInit(): void {

    }

}
