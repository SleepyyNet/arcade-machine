import { ArcModule, InputService, FocusService, RegistryService } from '../../../../src';
import { AfterContentInit, Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/interval';

@Component({
  selector: 'demo-app',
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
      margin: 15px;
    }

    input, button {
      border: 1px solid #000;
      border-radius: 0;
      box-shadow: 0;
    }

    input.arc--selected, button.arc--selected {
      border-color: #f00;
    }
  `],
  template:   `
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
        <input placeholder="Username">
        <input placeholder="Password" type="password">
        <button>Submit</button>
      </form>
    </div>

    <h1>Adding/Removing Elements</h1>
    <div class="area">
      <div class="box-wrapper" *ngFor="let box of boxes.slice(0, 15); let i = index">
        <div class="box" arc *ngIf="(i + (ticker | async)) % 2 === 0">{{ box }}</div>
      </div>
    </div>
  `,
})
export class DemoComponent implements AfterContentInit {
  public boxes: string[] = [];
  public ticker = Observable.interval(2500);
  public defaultBox = true;

  constructor(private input: InputService) {
    for (let i = 0; i < 50; i++) {
      this.boxes.push(String(`Box ${i}`));
    }
  }

  public ngAfterContentInit() {
    setTimeout(() => this.input.bootstrap(), 200);
  }

  public toggleDefaultBox() {
    this.defaultBox = false;
    setTimeout(() => this.defaultBox = true, 1000);
  }

  public onClick(el: HTMLElement) {
    el.style.background = '#0f0';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    ArcModule,
  ],
  providers: [
    FocusService,
    InputService,
    RegistryService,
  ],
  declarations: [
    DemoComponent,
  ],
  bootstrap: [
    DemoComponent,
  ],
})
export class AppModule {
}
