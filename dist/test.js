"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var index_1 = require("./index");
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
        var signal$ = index_1.AngularUnsubscribe.destroyed(fakeComp);
        var called = false;
        signal$.subscribe(function () { return called = true; });
        fakeComp.ngOnDestroy();
        chai_1.assert.isTrue(called);
    });
    it("can be used with the pipe and takeUntil operators", function () {
        var fakeComp = new FakeComp();
        var closed = false;
        var source = new rxjs_1.Subject();
        source.pipe(operators_1.takeUntil(index_1.AngularUnsubscribe.destroyed(fakeComp)))
            .subscribe(NOOP, NOOP, function () { return closed = true; });
        fakeComp.ngOnDestroy();
        chai_1.assert.isTrue(closed);
    });
});
describe("untilDestroyed", function () {
    it("can be used as a pipe operator", function () {
        var fakeComp = new FakeComp();
        var closed = false;
        var source = new rxjs_1.Subject();
        source.pipe(index_1.AngularUnsubscribe.untilDestroyed(fakeComp))
            .subscribe(NOOP, NOOP, function () { return closed = true; });
        fakeComp.ngOnDestroy();
        chai_1.assert.isTrue(closed);
    });
    it("can be used with other pipe operators", function () {
        var fakeComp = new FakeComp();
        var closed = false;
        var vals = [];
        var source = new rxjs_1.Subject();
        source
            .pipe(index_1.AngularUnsubscribe.untilDestroyed(fakeComp), operators_1.switchMap(function (val) { return rxjs_1.of(val + 100); }))
            .subscribe(function (val) { return vals.push(val); }, NOOP, function () { return closed = true; });
        source.next(1);
        source.next(2);
        source.next(3);
        fakeComp.ngOnDestroy();
        chai_1.assert.deepEqual(vals, [101, 102, 103]);
        chai_1.assert.isTrue(closed);
    });
});
