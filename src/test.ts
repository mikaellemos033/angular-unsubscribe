import {assert} from 'chai';
import {of, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {AngularUnsubscribe} from './index';

class FakeComp {
    ngOnDestroy() {
    }
}

const NOOP = () => {
};

describe("destroyed", () => {

    it("emits a value when ngOnDestroy() gets called", () => {
        const fakeComp = new FakeComp();
        const signal$ = AngularUnsubscribe.destroyed(fakeComp);
        let called = false;
        signal$.subscribe(() => called = true);
        fakeComp.ngOnDestroy();
        assert.isTrue(called);
    });

    it("can be used with the pipe and takeUntil operators", () => {
        const fakeComp = new FakeComp();

        let closed = false;
        const source = new Subject();
        source.pipe(takeUntil(AngularUnsubscribe.destroyed(fakeComp)))
            .subscribe(NOOP, NOOP, () => closed = true);

        fakeComp.ngOnDestroy();
        assert.isTrue(closed);
    });

});

describe("untilDestroyed", () => {

    it("can be used as a pipe operator", () => {
        const fakeComp = new FakeComp();

        let closed = false;
        const source = new Subject();
        source.pipe(AngularUnsubscribe.untilDestroyed(fakeComp))
            .subscribe(NOOP, NOOP, () => closed = true);

        fakeComp.ngOnDestroy();
        assert.isTrue(closed);
    });

    it("can be used with other pipe operators", () => {
        const fakeComp = new FakeComp();

        let closed = false;
        const vals: number[] = [];
        const source = new Subject<number>();
        source
            .pipe(
                AngularUnsubscribe.untilDestroyed(fakeComp),
                switchMap<number, number>((val: number) => of(val + 100))
            )
            .subscribe((val: number) => vals.push(val), NOOP, () => closed = true);

        source.next(1);
        source.next(2);
        source.next(3);
        fakeComp.ngOnDestroy();

        assert.deepEqual(vals, [101, 102, 103]);
        assert.isTrue(closed);
    });

});
