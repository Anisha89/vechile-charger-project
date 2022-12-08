import { Component, OnInit, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output() private file = new EventEmitter();
  @Input() private accept:string ="image/*";
  constructor(private elemRef: ElementRef) { }

  ngOnInit() {
  }

  fileChanged(event: any) {
    let fileReader = new FileReader();
    let file = event.currentTarget.files[0];
    fileReader.onload = (e:any) => {
      this.file.emit({ file: file, data: e.target.result });
    }
    fileReader.readAsDataURL(event.currentTarget.files[0]);
  }

  open() {
    this.elemRef.nativeElement.querySelector('input').click();
  }

}
