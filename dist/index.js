"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var AngularUnsubscribe = /** @class */ (function () {
    function AngularUnsubscribe() {
    }
    AngularUnsubscribe.destroyed = function (component) {
        var modifiedComponent = component;
        if (modifiedComponent.__componentDestroyed$) {
            return modifiedComponent.__componentDestroyed$;
        }
        var oldNgOnDestroy = component.ngOnDestroy;
        var stop$ = new rxjs_1.ReplaySubject();
        modifiedComponent.ngOnDestroy = function () {
            oldNgOnDestroy && oldNgOnDestroy.apply(component);
            stop$.next(true);
            stop$.complete();
        };
        return modifiedComponent.__componentDestroyed$ = stop$.asObservable();
    };
    AngularUnsubscribe.untilDestroyed = function (component) {
        return function (source) { return source.pipe(operators_1.takeUntil(AngularUnsubscribe.destroyed(component))); };
    };
    return AngularUnsubscribe;
}());
exports.AngularUnsubscribe = AngularUnsubscribe;
