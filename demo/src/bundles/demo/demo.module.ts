import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  NgModule,
  OnDestroy,
  Output
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

import { ArcModule, Direction, FocusService, InputService, RegistryService } from '../../../../src';

@Component({
  selector: 'demo-app',
  template: `
    <h1>Arcade Machine Demo</h1>
    <router-outlet></router-outlet>
    `
})
export class DemoAppComponent implements AfterViewInit {
  constructor(private inputService: InputService) {
    const nav: any = navigator;
    nav.gamepadInputEmulation = 'keyboard';

    Observable.fromEvent<KeyboardEvent>(window, 'keydown')
      .filter(ev => this.inputService.codeDirectionMap.get(ev.keyCode) === Direction.BACK)
      .subscribe((ev: KeyboardEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
      });
  }

  public ngAfterViewInit() {
    this.inputService.bootstrap();
  }
}

@Component({
  selector: 'page-1',
  styles: [`
    :host {
      font-family: monospace;
      max-width: 960px;
      margin: 15px auto;
      display: block;
    }

    h1 {
      font-weight: normal;
      font-size: 12px;
      margin: 0;
      padding: 0;
    }

    .area {
      border: 1px solid #000;
      margin: 15px 0;
    }

    .area:after {
      content: "";
      display: block;
    }

    .area.arc--selected {
      border-color: #f00;
    }

    .box-wrapper {
      width: 100px;
      display: inline-block;
    }

    .box {
      margin: 15px;
      background: #000;
      color: #fff;
    }

    .box.arc--selected {
      background: #f00;
    }

    form {
      display: flex;
      margin: 15px;
      align-content: center;
    }

    form div {
      margin-right: 5px;
    }

    input, button, textarea {
      border: 1px solid #000;
      padding: 5px 8px;
      border-radius: 0;
      box-shadow: 0;
      outline: 0 !important;
    }

    input.arc--selected, button.arc--selected, textarea.arc--selected {
      border-color: #f00;
    }

    .scroll-restriction {
      overflow: auto;
      height: 100px;
    }
  `],
  template: `
    <h1>Page 1</h1>

    <h1>Back Button Binding</h1>
    <div class="area">
      <a [routerLink]="['/page2']">Goto Page 2</a>
      <router-outlet></router-outlet>
    </div>

    <h1>Special Handlers</h1>
    <div class="area">
      <div class="box-wrapper" style="width:200px">
        <div class="box" arc arc-default-focus
          *ngIf="defaultBox"
          (click)="toggleDefaultBox()">
          I capture focus! Click me to toggle!
        </div>
      </div>
      <div class="box-wrapper">
        <div class="box" arc #override1
          [arc-up]="override3"
          [arc-down]="override2">
          up/down override
        </div>
      </div>
      <div class="box-wrapper">
        <div class="box" arc #override2
          [arc-up]="override1"
          [arc-down]="override3">
          up/down override
        </div>
      </div>
      <div class="box-wrapper">
        <div class="box" arc #override3
          [arc-up]="override2"
          [arc-down]="override1">
          up/down override
        </div>
      </div>
    </div>

    <h1>A Grid</h1>
    <div class="area">
      <div class="box-wrapper" *ngFor="let box of boxes">
        <div class="box" #el arc (click)="onClick(el)">{{ box }}</div>
      </div>
    </div>

    <h1>Non-Overlapping Elements</h1>
    <div class="area">
      <div class="box-wrapper" *ngFor="let box of boxes.slice(0, 3); let i = index"
        style="padding-right: 200px">
        <div class="box" arc style="height:50px">{{ box }}</div>
      </div>
      <br>
      <div class="box-wrapper" *ngFor="let box of boxes.slice(0, 3); let i = index"
        style="padding-left: 200px">
        <div class="box" arc style="height:50px">{{ box }}</div>
      </div>
    </div>

    <h1>A Form</h1>
    <div class="area">
      <form (submit)="alert('Submitting form')">
        <div><input placeholder="Username"></div>
        <div><input placeholder="Password" type="password"></div>
        <div><textarea></textarea></div>
        <div><button>Submit</button></div>
      </form>
    </div>

    <h1>Scrolling</h1>
    <div class="area scroll-restriction">
      <div class="box" arc>Lorem</div>
      <div class="box" arc>Ipsum</div>
      <div class="box" arc>Dolor</div>
      <div class="box" arc>Sit</div>
      <div class="box" arc>Amet</div>
      <div class="box" arc>Consectur</div>
    </div>

    <h1>Adding/Removing Elements</h1>
    <div class="area">
      <div class="box-wrapper" *ngFor="let box of boxes.slice(0, 15); let i = index">
        <div class="box" arc *ngIf="(i + (ticker | async)) % 2 === 0">{{ box }}</div>
      </div>
    </div>

    <div class="area">
      <h1>Focus Child Elements Only</h1>
      <button (click)="isDialogVisible=true">Open Dialog</button>
    </div>

    <dialog class="area"
      *ngIf="isDialogVisible"
      (onClose)="isDialogVisible=false">
      <div>
        <button>Button 1</button>
        <button>Button 2</button>
      </div>
      <div>
        <button>Button 3</button>
        <button>Button 4</button>
      </div>
      <div>
        <button (click)="isChildDialogVisible=true">Open Sub Dialog</button>
      </div>
      <dialog *ngIf="isChildDialogVisible" (onClose)="isChildDialogVisible=false">
        <div>
          <button>Button 5</button>
          <button>Button 6</button>
        </div>
      </dialog>
    </dialog>
  `,
})
export class Page1Component {
  public boxes: string[] = [];
  public ticker = Observable.interval(2500);
  public defaultBox = true;
  public isDialogVisible = false;

  constructor() {
    for (let i = 0; i < 50; i++) {
      this.boxes.push(String(`Box ${i}`));
    }
  }

  public toggleDefaultBox() {
    this.defaultBox = false;
    setTimeout(() => this.defaultBox = true, 1000);
  }

  public onClick(el: HTMLElement) {
    el.style.background = '#0f0';
  }
}

@Component({
  selector: 'dialog',
  template: `
  <ng-content></ng-content>
  <div>
    <button (click)="onClose.emit()">Close</button>
  </div>
  `,
  styles: [`
    :host{
      display: block;
      position: fixed;
      top: 45vh;
      left: 45vw;
      border: 2px solid blue;
      padding: 50px;
      background: white;
    }

    button { margin: 10px; }
  `],
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @Output() public onClose = new EventEmitter();

  constructor(
    private focusService: FocusService,
    private inputService: InputService,
    private hostElem: ElementRef,
  ) { }

  public ngAfterViewInit() {
    Observable.fromEvent<KeyboardEvent>(this.hostElem.nativeElement, 'keydown')
      .filter(ev => this.inputService.codeDirectionMap.get(ev.keyCode) === Direction.BACK)
      .take(1)
      .subscribe((ev: KeyboardEvent) => {
        ev.preventDefault();
        this.onClose.emit();
      });

    this.focusService.trapFocus(this.hostElem.nativeElement);
  }
  public ngOnDestroy() {
    this.focusService.releaseFocus(this.hostElem.nativeElement);
  }
}

@Component({
  selector: 'page-2',
  template: `
  <h1>Page 2</h1>
  <p>Try navigating with gamepad-B. Back buttons will not work here</p>
  <button (click)="goBack()">Go Back</button>
  `,
})
export class Page2Component {
  constructor(
    private location: Location,
  ) { }

  public goBack() {
    this.location.back();
  }
}

const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'page1' },
  { path: 'page1', component: Page1Component },
  { path: 'page2', component: Page2Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    ArcModule,
  ],
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    FocusService,
    InputService,
    RegistryService,
  ],
  declarations: [
    DemoAppComponent,
    Page1Component,
    Page2Component,
    DialogComponent,
  ],
  bootstrap: [
    DemoAppComponent,
  ],
})
export class AppModule {
}
