import { Component, OnInit, Input } from '@angular/core';
/*
https://embed.plnkr.co/19RYKPouFJ5BGfD6np7R/
<button type="button" (click)="modal1.show()">show modal</button>
  <app-modal #modal1>
    <div class="app-modal-header">
      header
    </div>
    <div class="app-modal-body">
      Whatever content you like, form fields, anything
      <input type="text">
    </div>
    <div class="app-modal-footer">
      <button type="button" class="btn btn-default" (click)="modal1.hide()">Close</button>
      <button type="button" class="btn btn-default" (click)="modal2.show()">Show modal 2</button>
      <button type="button" class="btn btn-primary">Save changes</button>
    </div>
  </app-modal>
*/

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  public visible = false;
  private visibleAnimate = false;
  @Input('largeModal') largeModal: Boolean = false;

  constructor() { }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  ngOnInit() {
  }

}
