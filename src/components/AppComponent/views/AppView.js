/**
 * Abstract class that represents application view that is displayed to the user.
 *
 * @property {HTMLElement[]} views list of all DOM elements that represent different application views
 */
class AppView {
  views = [...document.getElementsByClassName("app-view")];

  /**
   * Hides all application views.
   */
  cleanView = () => {
    this.views.forEach((view) => {
      view.hidden = true;
    });
  };

  /**
   * Initializes application view - shows current view and hides others.
   */
  init() {
    this.cleanView();
    this.component.hidden = false;
  }
}

export { AppView };
