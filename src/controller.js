class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on('addStudent', this.addStudent.bind(this));
    view.on('updateStudent', this.updateStudent.bind(this));
    view.on('toggleTeam', this.toggleTeam.bind(this));
    view.on('deleteStudent', this.deleteStudent.bind(this));
    view.on('openScore', this.openScore.bind(this));
    view.on('saveScore', this.saveScore.bind(this));
    view.on('updateDeadline', this.updateDeadline.bind(this));
    view.on('addLecture', this.addLecture.bind(this));
    view.show(model.items);
  }

  addStudent(name, skype) {
    this.model.addStudent(name, skype);
    this.view.show(this.model.items);
  }

  updateStudent(id, field, value) {
    this.model.updateStudent(id, field, value);
  }

  toggleTeam(id, color) {
    const team = this.model.toggleTeam(id, color);
    this.view.setTeam(id, team);
  }

  deleteStudent(id) {
    const items = this.model.deleteStudent(id);
    this.view.show(items);
  }

  openScore(id) {
    const score = this.model.getScore(id);
    const student = this.model.getStudent(id);
    this.view.showScore(this.model.items.lectures, score, student.name);
  }

  saveScore(id, score, deadlines) {
    this.model.saveScore(id, score, deadlines);
    this.view.closeScoreDialog();
    this.view.setTotalScore(id, score.allscore);
  }

  updateDeadline(index, deadline) {
    this.model.updateDeadline(index, deadline);
  }

  addLecture(id) {
    const lectures = this.model.addLecture();
    const student = this.model.getStudent(id);
    this.view.showScore(lectures, this.view.currentScore(), student.name);
  }
}

export default Controller;
