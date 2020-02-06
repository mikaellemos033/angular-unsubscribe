import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
var AngularUnsubscribe = /** @class */ (function () {
    function AngularUnsubscribe() {
    }
    AngularUnsubscribe.destroyed = function (component) {
        var modifiedComponent = component;
        if (modifiedComponent.__componentDestroyed$) {
            return modifiedComponent.__componentDestroyed$;
        }
        var oldNgOnDestroy = component.ngOnDestroy;
        var stop$ = new ReplaySubject();
        modifiedComponent.ngOnDestroy = function () {
            oldNgOnDestroy && oldNgOnDestroy.apply(component);
            stop$.next(true);
            stop$.complete();
        };
        return modifiedComponent.__componentDestroyed$ = stop$.asObservable();
    };
    AngularUnsubscribe.untilDestroyed = function (component) {
        return function (source) { return source.pipe(takeUntil(AngularUnsubscribe.destroyed(component))); };
    };
    return AngularUnsubscribe;
}());
export { AngularUnsubscribe };
