import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {

  @ViewChild('content') content: ElementRef;

  constructor(private _renderer: Renderer2) { }

  ngOnInit() {
  }

  // Auto grow the title and content div
  autoGrow(el) {
    // Increase Height according to input
    if (el.scrollHeight > el.clientHeight) {
      el.style.height = (el.scrollHeight + 50) + 'px';
    } else {
      // Prevent height from growing when deleting lines.
      el.style.height = '1px';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  // Format text according to the command
  formatText(cmd: string) {
    document.execCommand(cmd, false, null);
  }

  // Insert new Image Element using renderer2
  insertImage() {
    const link = window.prompt('Insert link of the image');

    const div = this._renderer.createElement('div');
    this._renderer.addClass(div, 'imageContainer');
    const img = this.createImageElement(link);
    const del = this.createDeleteElement();
    this._renderer.appendChild(div, del);
    this._renderer.appendChild(div, img);

    this._renderer.appendChild(this.content.nativeElement, div);

    this.deleteEmptyContent();
    this.addNextEditableBox();
  }

  // Insert new Video Element using renderer2
  insertVideo() {
    const link = window.prompt('Insert link of the video');
    const el = this._renderer.createElement('video');
    this._renderer.addClass(el, 'video');
    this._renderer.setAttribute(el, 'src', link);
    this._renderer.appendChild(this.content.nativeElement, el);
  }

  // Insert next editable box to add more content
  addNextEditableBox() {
    const el1 = this._renderer.createElement('div');
    this._renderer.addClass(el1, 'content');
    this._renderer.setAttribute(el1, 'contentEditable', 'true');
    //   this._renderer.setAttribute(el1, 'placeholder', 'Add Extra Content...');
    this._renderer.appendChild(this.content.nativeElement, el1);
  }

  // To delete not used placeholders
  deleteEmptyContent() {
    const children = this.content.nativeElement.children;
    for (let i = 2; i < children.length; i++) {
      if (children[i].innerHTML === '' && children[i].tagName !== 'IMG') {
        this.content.nativeElement.removeChild(children[i]);
      }
    }
  }

  // Create Image element
  createImageElement(link: string) {
    const el = this._renderer.createElement('img');
    this._renderer.addClass(el, 'image');
    this._renderer.setAttribute(el, 'src', link);
    return el;
  }

  // Create Delete Image
  createDeleteElement() {
    const el = this._renderer.createElement('i');
    this._renderer.addClass(el, 'fa');
    this._renderer.addClass(el, 'fa-window-close');
    this._renderer.setAttribute(el, 'aria-hidden', 'true');

    // Remove the parent on click of this element
    this._renderer.listen(el, 'click', (e) => {
      const parent = this._renderer.parentNode(e.srcElement);
      this._renderer.removeChild(this.content.nativeElement, parent);
    });
    return el;
  }
}
