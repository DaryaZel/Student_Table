class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on('addName', this.addName.bind(this));
    view.on('addScore', this.addScore.bind(this));
    view.on('getSavedScore', this.getSavedScore.bind(this));
    view.on('getItemAfterDelete', this.getItemAfterDelete.bind(this));
    view.on('chageItem', this.chageItem.bind(this));
    view.on('addLecture', this.addLecture.bind(this));
    view.on('changeItemAfterEnter', this.changeItemAfterEnter.bind(this));
    view.on('changeTeamColor', this.changeTeamColor.bind(this));
    view.on('changeDeadlineAfterEnter', this.changeDeadlineAfterEnter.bind(this));
    view.show(model.items);
  }



  addScore(title) {
    ;
    const item = this.model.addScoreItem(studentScore);

    this.view.addScoreItem(item);
  }
  addName(lastIdValue, inputNameValue, inputSkypeIdValue) {
    ;
    const item = this.model.addNameItem({
      id: '' + lastIdValue + '',
      name: inputNameValue,
      skype: inputSkypeIdValue
    });
    this.view.show(item);
  }
  getItemAfterDelete(scoreid) {

    const item = this.model.deleteItem(scoreid
    );
    this.view.show(item);
  }
  changeItemAfterEnter(firstvalue, defaultvalue) {
    this.model.chageLocalStorage(firstvalue, defaultvalue);
  }
  changeDeadlineAfterEnter(firstvalue, homeworkvalue) {

    this.model.chageLectureLocalStorage(firstvalue, homeworkvalue);
  }
  changeTeamColor(value, color) {
    this.model.chageTeamLocalStorage(value, color);
  }
  getSavedScore(scoreid) {

    let score = this.model.getScore(scoreid);
    let name = this.model.getName(scoreid);
    let items = this.model.items;
    this.view.showScore(items, score, name);
  }
  chageItem(studentScore, scoreid, deadlines) {

    const item = this.model.addScoreItem(studentScore, scoreid, deadlines);
    this.view.showAllScore(item);

  }
  addLecture(studentLecture, scoreid) {

    let score = this.model.getScore(scoreid);
    let name = this.model.getName(scoreid);
    const items = this.model.addLectureItem(studentLecture);
    this.view.showScore(items, score, name);

  }


}


export default Controller;