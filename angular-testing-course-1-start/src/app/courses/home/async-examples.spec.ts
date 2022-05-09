import {fakeAsync, tick, flush, flushMicrotasks} from "@angular/core/testing";
import {of} from "rxjs";
import {delay} from "rxjs/operators";


describe('Async Testing Examples', () => {

  it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {

    let test = false;

    setTimeout(() => {

      // console.log('Running assertions');

      test = true;

      expect(test).toBeTruthy();

      done();

    }, 1000);

  });


  it('Asynchronous test example - setTimeout()', fakeAsync(() => {

    let test = false;

    setTimeout(() => {
    });

    setTimeout(() => {

      // console.log('Running assertions setTimeout()')

      test = true;

    }, 1000);

    // Fast forward time
    // tick(1000);

    // Make sure all async completed
    flush();

    expect(test).toBeTruthy();

  }));

  it('Asynchronouse test example - plain Promise', fakeAsync(() => {

    let test = false;

    // console.log('Creating promise');

    // Major task que
    // setTimeout(() => {
    //
    //   console.log('setTimeout() first callback triggered');
    //
    // });
    //
    // // Major task que
    // setTimeout(() => {
    //
    //   console.log('setTimeout() second callback triggered');
    //
    // });

    // Micro task que
    Promise.resolve().then(() => {

      // console.log('Promise first evaluated successfully');

      // Micro task que
      return Promise.resolve();

    }).then(() => {

      // console.log('Promise second evaluated successfully');

      test = true;

    });

    // console.log('Running test assertions');

    flushMicrotasks();

    expect(test).toBeTruthy();

  }));

  it('Asynchronouse test example - Promises + setTimeout()', fakeAsync(() => {

    let counter = 0;

    Promise.resolve()
      .then(() => {

        counter += 10;

        setTimeout(() => {

          counter += 1;

        }, 1000);
      });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(11);

  }));

  it('Asynchronouse test example - Observables', fakeAsync(() => {
    let test = false;
    console.log('Creating Observable');
    // $ mean const is an observable
    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {

      test = true;

    });

    tick(1000);

    console.log('Running test assertions');

    expect(test).toBe(true);

  }));

});
















