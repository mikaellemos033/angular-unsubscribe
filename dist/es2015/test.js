import { assert } from 'chai';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AngularUnsubscribe } from './index';
var FakeComp = /** @class */ (function () {
    function FakeComp() {
    }
    FakeComp.prototype.ngOnDestroy = function () {
    };
    return FakeComp;
}());
var NOOP = function () {
};
describe("destroyed", function () {
    it("emits a value when ngOnDestroy() gets called", function () {
        var fakeComp = new FakeComp();
        var signal$ = AngularUnsubscribe.destroyed(fakeComp);
        var called = false;
        signal$.subscribe(function () { return called = true; });
        fakeComp.ngOnDestroy();
        assert.isTrue(called);
    });
    it("can be used with the pipe and takeUntil operators", function () {
        var fakeComp = new FakeComp();
        var closed = false;
        var source = new Subject();
        source.pipe(takeUntil(AngularUnsubscribe.destroyed(fakeComp)))
            .subscribe(NOOP, NOOP, function () { return closed = true; });
        fakeComp.ngOnDestroy();
        assert.isTrue(closed);
    });
});
describe("untilDestroyed", function () {
    it("can be used as a pipe operator", function () {
        var fakeComp = new FakeComp();
        var closed = false;
        var source = new Subject();
        source.pipe(AngularUnsubscribe.untilDestroyed(fakeComp))
            .subscribe(NOOP, NOOP, function () { return closed = true; });
        fakeComp.ngOnDestroy();
        assert.isTrue(closed);
    });
    it("can be used with other pipe operators", function () {
        var fakeComp = new FakeComp();
        var closed = false;
        var vals = [];
        var source = new Subject();
        source
            .pipe(AngularUnsubscribe.untilDestroyed(fakeComp), switchMap(function (val) { return of(val + 100); }))
            .subscribe(function (val) { return vals.push(val); }, NOOP, function () { return closed = true; });
        source.next(1);
        source.next(2);
        source.next(3);
        fakeComp.ngOnDestroy();
        assert.deepEqual(vals, [101, 102, 103]);
        assert.isTrue(closed);
    });
});
