export class TeachingSchedule {
  constructor(data) {
    this.id = data.id;
    this.class_id = data.class_id;
    this.subject_id = data.subject_id;
    this.teacher_nid = data.teacher_nid;
    this.day = data.day;
    this.start_time = this.parseTimeIgnoreTimezone(data.start_time);
    this.end_time = this.parseTimeIgnoreTimezone(data.end_time);
    this.class = data.class;
    this.subject = data.subject;
    this.teacher = data.teacher;
  }

  parseTimeIgnoreTimezone(timeString) {
    const date = new Date(timeString);
    return new Date(1970, 0, 1, date.getUTCHours(), date.getUTCMinutes());
  }

  isEkskulSubject() {
    return this.subject && this.subject.category_id === 2;
  }
}
