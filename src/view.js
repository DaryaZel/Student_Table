import { EventEmitter } from './helpers';
class View extends EventEmitter {
  constructor() {
    super();
    this.showingTooltip
    this.scoreID
    this.allScoreElements = document.getElementsByClassName("allscore")
    this.idElements = document.getElementsByClassName("idName")
    this.rowElements = document.getElementsByClassName("row")
    this.container = document.getElementById("container")
    this.lectures = document.getElementById("lectures")
    this.linkElements = document.getElementsByClassName("link")
    this.scoreElements = document.getElementsByClassName("score")
    this.deadlineElements = document.getElementsByClassName("deadline")
    this.teamButton = document.getElementsByClassName("toggle-btn")
    this.saveName = document.getElementById('btnSave')
    this.saveScore = document.getElementById('btnSaveScore')
    this.inputName = document.getElementById('Name')
    this.inputSkypeId = document.getElementById('SkypeId')
    $('#tablehead').on('mouseover', this.message.bind(this));
    $('#tablehead').on('mouseout', this.messageOut.bind(this));
    $('#tablehead').on('click', this.toggleTeamButton.bind(this));
    $('#btnSave').on('click', this.handleAddName.bind(this));
    $('#lectures').on('click', this.handleAddScore.bind(this));
    $('#lectures').on('click', this.handleAddLecture.bind(this));
    $('#lectures').on('keyup', this.onlyNumber.bind(this));
    $('#for_students').on('keypress', this.keypressTable.bind(this));
    $('#for_students').on('click', this.showLectureScoreAndDelte.bind(this));
    $('#dialog').on('keypress', this.keypressNameEnter.bind(this));
    $('#dialog').on('keyup', this.noEmtySpace.bind(this));
    $('#lectures').on('keypress', this.keypressLectures.bind(this));
    $("#btnStudentName").on('click', this.openNameDialog.bind(this));
    $("#btnCancel").on('click', this.closeDialog.bind(this));
    $("#btnCancelScore").on('click', this.closeScoreDialog.bind(this));
    this.students_tpl = $('#students_tpl').html();
    this.lectures_tpl = $('#lectures_tpl').html();



  }
  show(items) {
    let allScoreElements = document.getElementsByClassName("allscore")
    if (localStorage.getItem('session') == null) {
      $.getJSON('./json/only_students.json', function (data) {
        localStorage.setItem('session', JSON.stringify(data));

      })
    }
    $('#for_students').html(Mustache.render(this.students_tpl, items));

    allScoreElements = Array.prototype.slice.call(allScoreElements);
    allScoreElements.forEach(elem => {
      let id = +elem.id.replace('_score', '')
      if (items[id]) {

        document.getElementById('' + id + '_score').value = items[id].allscore
        document.getElementById('' + id + '_score_td').dataset.sortValue = items[id].allscore;
      }
    })
    $("#dialog").dialog().dialog("close");
    $("#dialog").dialog({
      autoOpen: false,
      modal: true,
      resizable: false
    });
    $("#lectures").dialog({
      autoOpen: false,
      height: 600,
      modal: true,
      resizable: false
    });
    this.tableSorting()
    this.firstThreePlaces();

  }
  tableSorting() {
    $('#dtBasicExample').tablesort()
  }
  message(e) {
    let target = e.target;

    let tooltip = target.getAttribute('data-tooltip');
    let tooltipchild = target.parentElement.getAttribute('data-tooltip');
    if (tooltip || tooltipchild) {
      let tooltipElem = document.createElement('div');
      tooltipElem.className = 'tooltip';
      tooltipElem.innerHTML = tooltip || tooltipchild
      document.body.appendChild(tooltipElem);

      let coords = target.getBoundingClientRect();

      let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
      if (left < 0) left = 0;

      let top = coords.top - tooltipElem.offsetHeight - 5;
      if (top < 0) {
        top = coords.top + target.offsetHeight + 5;
      }

      tooltipElem.style.left = left + 'px';
      tooltipElem.style.top = top + 'px';

      this.showingTooltip = tooltipElem;
    }

  };
  messageOut(e) {
    if (this.showingTooltip) {
      document.body.removeChild(this.showingTooltip);
      this.showingTooltip = null;
    }
  }
  toggleTeamButton(e) {
    if (e.target.id == "greenbutton" && $(e.target).parent().next().children().attr('class') == "toggle-btn" && $(e.target).parent().next().next().children().attr('class') == "toggle-btn") {
      e.target.classList.toggle('active-green')
    }
    else if (e.target.parentElement.id == "greenbutton" && $(e.target).parent().parent().next().children().attr('class') == "toggle-btn" && $(e.target).parent().parent().next().next().children().attr('class') == "toggle-btn") {
      e.target.parentElement.classList.toggle('active-green')

    }
    else if (e.target.id == "redbutton" && $(e.target).parent().prev().children().attr('class') == "toggle-btn" && $(e.target).parent().next().children().attr('class') == "toggle-btn") {
      e.target.classList.toggle('active-red')
    }
    else if (e.target.parentElement.id == "redbutton" && $(e.target).parent().parent().prev().children().attr('class') == "toggle-btn" && $(e.target).parent().parent().next().children().attr('class') == "toggle-btn") {
      e.target.parentElement.classList.toggle('active-red')

    }
    else if (e.target.id == "bluebutton" && $(e.target).parent().prev().children().attr('class') == "toggle-btn" && $(e.target).parent().prev().prev().children().attr('class') == "toggle-btn") {
      e.target.classList.toggle('active-blue')
    }
    else if (e.target.parentElement.id == "bluebutton" && $(e.target).parent().parent().prev().children().attr('class') == "toggle-btn" && $(e.target).parent().parent().prev().prev().children().attr('class') == "toggle-btn") {
      e.target.parentElement.classList.toggle('active-blue')

    }
    else {
      if (e.target.id == "bluebutton" || e.target.id == "redbutton" || e.target.id == "greanbutton") {
        alert('Press only one team')
      }
    }
  }
  firstThreePlaces() {

    let allScore = this.allScoreElements
    allScore = Array.prototype.slice.call(allScore);
    allScore.forEach(element => {
      element.classList.remove('threeFirst')
    });
    allScore.sort(function (a, b) {
      return b.value - a.value;
    });
    allScore.length = 3
    allScore.forEach(element => {
      if (element.value > 0) {
        element.classList.add('threeFirst')
      }
    });

  }

  handleAddName(event) {
    ;
    event.preventDefault();
    const inputNameValue = this.inputName.value;
    const inputSkypeIdValue = this.inputSkypeId.value;
    let lastId = this.idElements[this.idElements.length - 1];
    let lastIdValue = +lastId.value + 1;
    if (!inputNameValue) {
      alert("Enter Name!");
    }
    else if (!inputSkypeIdValue) {
      alert("Enter Skype Id!");
    } else {
      this.emit('addName', lastIdValue, inputNameValue, inputSkypeIdValue);
    }
    this.closeDialog()
  }
  onlyNumber(e) {
    let inputScore = e.target.value;
    if (isNaN(parseFloat(inputScore)) && !isFinite(inputScore)) {
      e.target.value = inputScore.substring(0, inputScore.length - 1)
    }
  }
  noEmtySpace(e) {
    let inputScore = e.target.value;
    if (inputScore == " ") {
      e.target.value = inputScore.substring(0, inputScore.length - 1)

    }
  }
  handleAddScore(e) {
    let score = 0
    let studentScore = {}
    let deadlines = []
    let array = []
    for (let i = 0; i < this.scoreElements.length; i++) {
      let inputScore = +this.scoreElements[i].value
      score += inputScore
      studentScore.allscore = '' + score + ''
      studentScore[i] = this.scoreElements[i].value
      array.push(studentScore)

    }
    for (let i = 0; i < this.deadlineElements.length; i++) {
      let deadline = this.deadlineElements[i].value
      deadlines.push(deadline)

    }
    if (e.target == document.getElementById("btnSaveScore")) {
      this.emit('chageItem', studentScore, this.scoreID, deadlines);
    }
    else if (e.target == document.getElementById("btnCancelScore")) {
      return this.closeScoreDialog()
    }
  }
  handleAddLecture(e) {

    if (e.target == document.getElementById("btnAddLecture")) {
      let studentLecture = {}
      let array = []
      let number = +(this.scoreElements.length / 2) + 1
      let lecture = 'Lecture №' + number + ''
      let homework = 'Homework №' + number + ''
      studentLecture.lecture = lecture
      studentLecture.homework = homework
      array.push(studentLecture)
      this.emit('addLecture', studentLecture, this.scoreID);
    }
  }
  showAllScore(score) {

    $("#lectures").dialog("close");
    document.getElementById('' + this.scoreID + '_score').value = String(score['' + this.scoreID + ''].allscore)
    document.getElementById('' + this.scoreID + '_score_td').dataset.sortValue = String(score['' + this.scoreID + ''].allscore)
    this.firstThreePlaces();
  }
  keypressTable(event) {

    let index = event.target.dataset.indexNumber;
    if (event.keyCode == 13) {
      $(event.target).parent().parent().next().find('.my-input ').eq(+index).focus();
      event.preventDefault();
      if (event.target.defaultValue !== event.target.value) {
        this.emit('changeItemAfterEnter', event.target.value, event.target.defaultValue);

      }
    }
  }

  keypressNameEnter(event) {

    if (event.keyCode == 13) {
      $(event.target).parent().next().find('#SkypeId').focus();
      event.preventDefault();
    }
  }
  keypressLectures(event) {

    if (event.keyCode == 13 && event.target.classList != "deadline") {
      $(event.target).parent().next().find('.score').focus();
      event.preventDefault();
    }
    else if (event.keyCode == 13) {
      $(event.target).parent().next().next().find('.deadline').focus();
      if (event.target.defaultValue !== event.target.value) {
        this.emit('changeDeadlineAfterEnter', event.target.value, event.target.parentElement.outerText);
      }

    }
  }

  openNameDialog() {
    $("#dialog").dialog("open");
  }
  closeDialog() {
    $("#dialog").dialog("close");
  }
  closeScoreDialog() {
    $("#lectures").dialog("close");
  }
  showLectureScoreAndDelte(e) {

    if (e.target.className == 'changeScore') {

      this.scoreID = e.target.id
      this.emit('getSavedScore', this.scoreID);
    }
    else if (e.target.className == 'deleteItem') {

      this.scoreID = e.target.previousElementSibling.id
      this.emit('getItemAfterDelete', this.scoreID);

    }
    else if (e.target.className == 'studentname form-control my-input') {

      for (let i = 0; i < this.teamButton.length; i++) {
        if (this.teamButton[i].className == "toggle-btn active-green") {

          e.target.parentElement.classList.toggle('green')
          this.emit('changeTeamColor', event.target.value, 'green');
        }
        else if (this.teamButton[i].className == "toggle-btn active-red") {

          e.target.parentElement.classList.toggle('red')
          this.emit('changeTeamColor', event.target.value, 'red');
        }
        else if (this.teamButton[i].className == "toggle-btn active-blue") {

          e.target.parentElement.classList.toggle('blue')
          this.emit('changeTeamColor', event.target.value, 'blue');
        }
      }
    }


  }
  showScore(items, score, name) {
    $("#lectures").dialog("open").dialog({
      title: '' + name + ' Score'
    })
    $('#lecturesMustache').html(Mustache.render(this.lectures_tpl, items));

    let alllinks = this.linkElements
    alllinks = Array.prototype.slice.call(alllinks);
    alllinks.forEach(element => {
      if (element.href !== 'http://127.0.0.1:5500/index.html') {
        element.children[0].classList.add('link')
      }
    });
    for (let i = 0; i < this.scoreElements.length; i++) {
      if (score && score[i]) {

        this.scoreElements[i].value = score[i]
      }
      else {

        this.scoreElements[i].value = "0"
      }

    }
  }

}

export default View;
