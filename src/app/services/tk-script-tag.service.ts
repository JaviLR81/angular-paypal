import { Injectable, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class TkScriptTagService {

  constructor(
    @Inject(DOCUMENT) private _document: Document
  ) {}

  // tslint:disable-next-line
  addScript(renderer: Renderer2, type: string, src?: string, id?: string, charset?: string, section?: string, text?: string, onload?: Function, className?: string): HTMLScriptElement | any {

    const script = renderer.createElement('script');

    script.type = type;
    script.charset = charset;

    if (id) {
      // Replace script content instead of append
      if (this._document.getElementById(id) && text) {
        return renderer.setProperty(this._document.getElementById(id), 'text', text);
      }
      script.id = id;
    }

    if (src) {
      script.src = src;
    }

    if (text) {
      script.text = text;
    }

    if (onload) {
      script.onload = onload;
    }

    if (className) {
      renderer.setAttribute(script, 'class', className);
    }

    renderer.appendChild(this.getSectionByName(section), script);

    return script;
  }

  getSectionByName(section: string | undefined) {
    console.log("~section", section)

    return (section && this._document[section as keyof Document]) ?
      this._document[section as keyof Document] : this._document.head;
  }

  removeScript(renderer: Renderer2, id: string, section: string): void {
    if (this._document.getElementById(id)) {
      renderer.removeChild(this.getSectionByName(section), this._document.getElementById(id));
    }
  }

  removeMultipleScripts(renderer: Renderer2, className: string): void {
    const scripts = this._document.getElementsByClassName(className);

    Array.from(scripts).forEach((node) => {
      renderer.removeChild(this._document, this._document.getElementById(node.id));
    });
  }
}
