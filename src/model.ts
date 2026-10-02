import { EventEmitter } from './helpers';

interface Student {
  id: string;
  name: string;
  skype: string;
  team?: string;
}

interface Lecture {
  lecture: string;
  homework: string;
  lectureurl?: string;
  homeworkurl?: string;
  deadline?: string;
}

interface Score {
  allscore: string;
  [index: number]: string;
}

// Scores are stored next to students/lectures, keyed by student id.
interface State {
  students: Student[];
  lectures: Lecture[];
  [studentId: string]: any;
}

class Model extends EventEmitter {
  items: State;
  emit: any;

  constructor(items: State) {
    super();
    this.items = items;
  }

  getScore(id: string): Score {
    return this.items[id];
  }

  getStudent(id: string): Student {
    return this.items.students.find(student => student.id == id);
  }

  addStudent(name: string, skype: string) {
    const lastId = Math.max(0, ...this.items.students.map(student => +student.id));
    const student = { id: String(lastId + 1), name, skype };
    this.items.students.push(student);
    this.emit('change', this.items);
    return student;
  }

  updateStudent(id: string, field: string, value: string) {
    const student = this.getStudent(id);
    if (student && (field == 'name' || field == 'skype')) {
      student[field] = value;
      this.emit('change', this.items);
    }
  }

  toggleTeam(id: string, color: string) {
    const student = this.getStudent(id);
    student.team = student.team == color ? '' : color;
    this.emit('change', this.items);
    return student.team;
  }

  deleteStudent(id: string) {
    this.items.students = this.items.students.filter(student => student.id != id);
    delete this.items[id];
    this.emit('change', this.items);
    return this.items;
  }

  saveScore(id: string, values: string[], deadlines: string[]) {
    const score: Score = { ...values, allscore: String(values.reduce((sum, value) => sum + +value, 0)) };
    deadlines.forEach((deadline, i) => {
      this.items.lectures[i].deadline = deadline;
    });
    this.items[id] = score;
    this.emit('change', this.items);
    return score;
  }

  // Ids of up to three students with the highest non-zero total score.
  topThree(): string[] {
    return this.items.students
      .map(student => ({ id: student.id, total: +(this.getScore(student.id) || { allscore: 0 }).allscore }))
      .filter(student => student.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map(student => student.id);
  }

  updateDeadline(index: number, deadline: string) {
    this.items.lectures[index].deadline = deadline;
    this.emit('change', this.items);
  }

  addLecture() {
    const number = this.items.lectures.length + 1;
    this.items.lectures.push({
      lecture: 'Lecture №' + number,
      homework: 'Homework №' + number
    });
    this.emit('change', this.items);
    return this.items.lectures;
  }
}

export default Model;
