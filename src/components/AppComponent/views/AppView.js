class AppView {

  views = [...document.getElementsByClassName('app-view')];

  cleanView = () => {
    this.views.forEach(view => {
      view.hidden = true;
    });
  }

  init() {
    this.cleanView();
    this.component.hidden = false;
  }
}

export { AppView };