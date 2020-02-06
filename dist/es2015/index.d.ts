import { Observable } from 'rxjs';
export declare class AngularUnsubscribe {
    static destroyed(component: {
        ngOnDestroy(): void;
    }): Observable<true>;
    static untilDestroyed<T>(component: {
        ngOnDestroy(): void;
    }): (source: Observable<T>) => Observable<T>;
}
