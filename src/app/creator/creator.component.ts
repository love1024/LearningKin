import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {
  prev = '1px';
  constructor() { }

  ngOnInit() {
  }

  autoGrow(el) {
    // Increase Height according to input
    if (el.scrollHeight > el.clientHeight) {
      el.style.height = el.scrollHeight + 'px';
    } else {
      // Prevent height from growing when deleting lines.
      el.style.height = '1px';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  makeBold() {
    document.execCommand('bold', false, null);
  }

  makeItalic() {
    document.execCommand('italic', false, null);
  }

  makeUnderline() {
    document.execCommand('underline', false, null);
  }

}
