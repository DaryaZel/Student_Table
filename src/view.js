import Mustache from 'mustache';
import { EventEmitter } from './helpers';

const ENTER = 13;

class View extends EventEmitter {
  constructor() {
    super();
    this.showingTooltip = null;
    this.scoreID = null;
    this.allScoreElements = document.getElementsByClassName("allscore")
    this.scoreElements = document.getElementsByClassName("score")
    this.deadlineElements = document.getElementsByClassName("deadline")
    this.teamButtons = document.getElementsByClassName("toggle-btn")
    this.inputName = document.getElementById('Name')
    this.inputSkypeId = document.getElementById('SkypeId')
    this.students_tpl = $('#students_tpl').html();
    this.lectures_tpl = $('#lectures_tpl').html();

    $('#tablehead').on('mouseover', this.message.bind(this));
    $('#tablehead').on('mouseout', this.messageOut.bind(this));
    $('#tablehead').on('click', this.toggleTeamButton.bind(this));
    $('#btnSave').on('click', this.handleAddName.bind(this));
    $('#for_students').on('keypress', this.keypressTable.bind(this));
    $('#for_students').on('click', this.handleTableClick.bind(this));
    $('#dialog').on('keypress', this.keypressNameEnter.bind(this));
    $('#dialog').on('keyup', this.noLeadingSpace.bind(this));
    $('#lectures').on('click', this.handleLecturesClick.bind(this));
    $('#lectures').on('keyup', this.onlyNumber.bind(this));
    $('#lectures').on('keypress', this.keypressLectures.bind(this));
    $("#btnStudentName").on('click', this.openNameDialog.bind(this));
    $("#btnCancel").on('click', this.closeDialog.bind(this));

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
    $('#dtBasicExample').tablesort();
  }

  show(items) {
    $('#for_students').html(Mustache.render(this.students_tpl, items));

    Array.from(this.allScoreElements).forEach(elem => {
      const id = elem.dataset.id;
      if (items[id]) {
        this.setTotalScore(id, items[id].allscore);
      }
    })
  }

  setTotalScore(id, total) {
    document.getElementById(id + '_score').value = total
    document.getElementById(id + '_score_td').dataset.sortValue = total
  }

  setTeam(id, team) {
    const cell = document.getElementById(id + '_name_td')
    cell.classList.remove('green', 'red', 'blue')
    if (team) {
      cell.classList.add(team)
    }
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
  }

  messageOut() {
    if (this.showingTooltip) {
      document.body.removeChild(this.showingTooltip);
      this.showingTooltip = null;
    }
  }

  activeTeam() {
    const active = Array.from(this.teamButtons)
      .find(button => button.classList.contains('active-' + button.dataset.team));
    return active ? active.dataset.team : null;
  }

  toggleTeamButton(e) {
    const button = e.target.closest('.toggle-btn');
    if (!button) return;

    const team = button.dataset.team;
    const activeTeam = this.activeTeam();
    if (activeTeam && activeTeam != team) {
      alert('Press only one team')
      return;
    }
    button.classList.toggle('active-' + team)
  }

  highlightTopThree(ids) {
    Array.from(this.allScoreElements).forEach(element => {
      element.classList.toggle('threeFirst', ids.includes(element.dataset.id))
    });
  }

  handleAddName(event) {
    event.preventDefault();
    const name = this.inputName.value.trim();
    const skype = this.inputSkypeId.value.trim();
    if (!name) {
      alert("Enter Name!");
      return;
    }
    if (!skype) {
      alert("Enter Skype Id!");
      return;
    }
    this.emit('addStudent', name, skype);
    this.inputName.value = '';
    this.inputSkypeId.value = '';
    this.closeDialog()
  }

  onlyNumber(e) {
    if (e.target.classList.contains('score')) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '')
    }
  }

  noLeadingSpace(e) {
    if (e.target.value.startsWith(' ')) {
      e.target.value = e.target.value.trimStart()
    }
  }

  scoreValues() {
    return Array.from(this.scoreElements).map(element => element.value)
  }

  handleLecturesClick(e) {
    switch (e.target.id) {
      case 'btnSaveScore': {
        const deadlines = Array.from(this.deadlineElements).map(element => element.value)
        this.emit('saveScore', this.scoreID, this.scoreValues(), deadlines);
        break;
      }
      case 'btnCancelScore':
        this.closeScoreDialog();
        break;
      case 'btnAddLecture':
        this.emit('addLecture', this.scoreID);
        break;
    }
  }

  keypressTable(event) {
    if (event.keyCode != ENTER) return;

    const input = event.target;
    const index = input.dataset.indexNumber;
    $(input).parent().parent().next().find('.my-input').eq(+index).focus();
    event.preventDefault();
    if (input.dataset.field && input.defaultValue !== input.value) {
      this.emit('updateStudent', input.dataset.id, input.dataset.field, input.value);
      input.defaultValue = input.value;
    }
  }

  keypressNameEnter(event) {
    if (event.keyCode == ENTER) {
      $(event.target).parent().next().find('#SkypeId').focus();
      event.preventDefault();
    }
  }

  keypressLectures(event) {
    if (event.keyCode != ENTER) return;

    const input = event.target;
    event.preventDefault();
    if (!input.classList.contains('deadline')) {
      $(input).parent().next().find('.score').focus();
      return;
    }
    $(input).parent().next().next().find('.deadline').focus();
    if (input.defaultValue !== input.value) {
      const index = Array.from(this.deadlineElements).indexOf(input);
      this.emit('updateDeadline', index, input.value);
      input.defaultValue = input.value;
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

  handleTableClick(e) {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains('changeScore')) {
      this.scoreID = id
      this.emit('openScore', id);
    }
    else if (target.classList.contains('deleteItem')) {
      this.emit('deleteStudent', id);
    }
    else if (target.classList.contains('studentname')) {
      const team = this.activeTeam();
      if (team) {
        this.emit('toggleTeam', id, team);
      }
    }
  }

  showScore(lectures, score, name) {
    $("#lectures").dialog("option", "title", name + ' Score').dialog("open")
    $('#lecturesMustache').html(Mustache.render(this.lectures_tpl, { lectures }));

    $('#lecturesMustache a.link').each((i, link) => {
      if (link.getAttribute('href')) {
        link.children[0].classList.add('link')
      }
    });
    Array.from(this.scoreElements).forEach((element, i) => {
      element.value = score && score[i] ? score[i] : "0"
    })
  }
}

export default View;
