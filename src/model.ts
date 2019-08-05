import { EventEmitter } from './helpers';
class Model extends EventEmitter {
  items: any;
  emit: any;
  students: Array<any>
  constructor(items = []) {
    super();
    this.items = items;
  }

  getScore(scoreid: number) {

    let score = this.items[scoreid]
    return score
  }
  getName(scoreid) {

    let name
    this.items.students.forEach(item => {
      if (item.id == scoreid) {
        name = item.name
      }
    })
    return name
  }
  chageLocalStorage(firstvalue: string, defaultvalue: string) {
    this.items.students.forEach(item => {
      if (item.name == defaultvalue) {
        item.name = firstvalue
      }
      else if (item.skype == defaultvalue) {
        item.skype = firstvalue
      }
    })

    this.emit('change', this.items);
    return this.items;

  }

  chageLectureLocalStorage(firstvalue: string, homeworkvalue: string) {

    this.items.lectures.forEach(item => {

      if ("" + item.homework + "  " == homeworkvalue) {
        item.deadline = firstvalue
      }
    })
    this.emit('change', this.items);
    return this.items;
  }
  chageTeamLocalStorage(value: string, color: string) {

    this.items.students.forEach(item => {
      if (item.name == value && item.team == color) {
        item.team = " "
      }
      else if (item.name == value) {
        item.team = color
      }
    })
    this.emit('change', this.items);
    return this.items;
  }
  addNameItem(item) {
    ;
    this.items.students.push(item);
    this.emit('change', this.items);
    return this.items;
  }
  addScoreItem(studentScore: number, scoreID: number, deadlines: string) {
    for (let i = 0; i < deadlines.length; i++) {
      this.items.lectures[i].deadline = deadlines[i]
    }
    this.items.lectures
    this.items[scoreID] = studentScore;
    this.emit('change', this.items);
    return this.items;
  }
  addLectureItem(studentLecture: string) {
    ;
    this.items.lectures.push(studentLecture);
    this.emit('change', this.items);
    return this.items;
  }
  deleteItem(scoreid) {
    ;
    this.items.students.forEach(function (item: any, index: any, object: any[]) {
      if (item.id == scoreid) {
        object.splice(index, 1);
      }
    })
    this.emit('change', this.items);
    return this.items;
  }
}

export default Model;
