import {waitForAsync, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });

  }));

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });

  it('should display only beginner courses', () => {

    const beginnerCourses = setupCourses()
      .filter(course => course.category === 'BEGINNER');

    // 'of()' subscribed to an observable
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });


  it('should display only advanced courses', () => {

    const advancedCourses = setupCourses()
      .filter(course => course.category === 'ADVANCED');

    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });


  it('should display both tabs', () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Unexpected number of tabs found');

  });

  // Recommended fakeAsync as best practice. Doesn't support httpRequests
  it('should display advanced courses when tab is clicked - fakeAsync', fakeAsync(() => {
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));

      fixture.detectChanges();

      const tabs = el.queryAll(By.css('.mat-tab-label'));

      // Utility function from common/test-utils.ts
      click(tabs[1]);

      fixture.detectChanges();

      // flush for animation frame or tick(16) flush best practice
      // tick(16)
      flush();

      const cardTitles = el.queryAll(By.css('.mat-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Testing Course');
    }
  ));

  // waitForAsync supports httpRequests and used for beforeEach
  it('should display advanced courses when tab is clicked - waitForAsync', waitForAsync(() => {
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));

      fixture.detectChanges();

      const tabs = el.queryAll(By.css('.mat-tab-label'));

      // Utility function from common/test-utils.ts
      click(tabs[1]);

      fixture.detectChanges();

      // Called when all async operations completed
      fixture.whenStable().then(() => {

        console.log('Called whenStable');

        const cardTitles = el.queryAll(By.css('.mat-card-title'));

        expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Testing Course');
      });
    }
  ));

});


