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
    this.render();
  }

  render() {
    this.view.show(this.model.items);
    this.view.highlightTopThree(this.model.topThree());
  }

  addStudent(name, skype) {
    this.model.addStudent(name, skype);
    this.render();
  }

  updateStudent(id, field, value) {
    this.model.updateStudent(id, field, value);
  }

  toggleTeam(id, color) {
    const team = this.model.toggleTeam(id, color);
    this.view.setTeam(id, team);
  }

  deleteStudent(id) {
    this.model.deleteStudent(id);
    this.render();
  }

  openScore(id) {
    const score = this.model.getScore(id);
    const student = this.model.getStudent(id);
    this.view.showScore(this.model.items.lectures, score, student.name);
  }

  saveScore(id, values, deadlines) {
    const score = this.model.saveScore(id, values, deadlines);
    this.view.closeScoreDialog();
    this.view.setTotalScore(id, score.allscore);
    this.view.highlightTopThree(this.model.topThree());
  }

  updateDeadline(index, deadline) {
    this.model.updateDeadline(index, deadline);
  }

  addLecture(id) {
    const lectures = this.model.addLecture();
    const student = this.model.getStudent(id);
    this.view.showScore(lectures, this.view.scoreValues(), student.name);
  }
}

export default Controller;
