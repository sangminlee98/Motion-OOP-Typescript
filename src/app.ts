import { Component } from './components/component.js';
import { Composable, PageComponent, PageItemComponent } from './components/page.js'
import { InputDialog, MediaData, TextData } from './components/page/dialog/dialog.js';
import { MediaSectionInput } from './components/page/dialog/input/media-input.js';
import { TextSectionInput } from './components/page/dialog/input/text-input.js';
import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new (): T;
}

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    this.bindDialogToElement('#new-image', MediaSectionInput, input => new ImageComponent(input.title, input.url));
    this.bindDialogToElement('#new-video', MediaSectionInput, input => new VideoComponent(input.title, input.url));
    this.bindDialogToElement('#new-note', TextSectionInput, input => new NoteComponent(input.title, input.body));
    this.bindDialogToElement('#new-todo', TextSectionInput, input => new TodoComponent(input.title, input.body));
  };
  bindDialogToElement<T extends (MediaData | TextData) & Component>(selector: string, inputComponenet: InputComponentConstructor<T>, makeSection: (input: T) => Component) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const input = new inputComponenet();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);
      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const imgComponent = makeSection(input);
        this.page.addChild(imgComponent);
        dialog.removeFrom(this.dialogRoot);
      });    
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement,document.body);


//https://www.youtube.com/watch?v=iZ9csAfU5Os