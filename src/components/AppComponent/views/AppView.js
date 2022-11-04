class AppView {
  components = [...document.getElementsByClassName("app-view")];

  cleanView = () => {
    this.components.forEach((component) => {
      component.hidden = true;
    });
  };

  init() {
    this.cleanView();
    this.component.hidden = false;
  }
}
export { AppView };
