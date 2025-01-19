import { TeachingSchedule } from "../models/TeachingSchedule";

export class ScheduleValidator {
  constructor(schedules) {
    this.schedules = schedules.map(
      (schedule) => new TeachingSchedule(schedule)
    );
  }

  isTimeOverlapping(schedule1, schedule2) {
    const start1 = this.getTimeInMinutes(schedule1.start_time);
    const end1 = this.getTimeInMinutes(schedule1.end_time);
    const start2 = this.getTimeInMinutes(schedule2.start_time);
    const end2 = this.getTimeInMinutes(schedule2.end_time);

    return start1 < end2 && end1 > start2;
  }

  getTimeInMinutes(date) {
    return date.getHours() * 60 + date.getMinutes();
  }

  hasTeacherConflict(newSchedule, excludeId = null) {
    if (newSchedule.isEkskulSubject()) {
      return false;
    }

    const relevantSchedules = this.schedules.filter(
      (schedule) => schedule.id !== excludeId
    );

    return relevantSchedules.some((schedule) => {
      return (
        schedule.teacher_nid === newSchedule.teacher_nid &&
        schedule.day === newSchedule.day &&
        this.isTimeOverlapping(schedule, newSchedule)
      );
    });
  }

  hasClassConflict(newSchedule, excludeId = null) {
    const relevantSchedules = this.schedules.filter(
      (schedule) => schedule.id !== excludeId
    );

    return relevantSchedules.some((schedule) => {
      const sameClass = schedule.class_id === newSchedule.class_id;
      return (
        sameClass &&
        schedule.day === newSchedule.day &&
        this.isTimeOverlapping(schedule, newSchedule)
      );
    });
  }

  validateSchedule(newScheduleData, excludeId = null) {
    const newSchedule = new TeachingSchedule(newScheduleData);
    const validationResults = {
      valid: true,
      conflicts: [],
    };

    if (this.hasTeacherConflict(newSchedule, excludeId)) {
      validationResults.valid = false;
      validationResults.conflicts.push({
        type: "TEACHER_CONFLICT",
        message: `Guru ${
          newSchedule.teacher?.name || newSchedule.teacher_nid
        } sudah memiliki jadwal mengajar pada hari ${newSchedule.day} 
                 pukul ${this.formatTime(
                   newSchedule.start_time
                 )} - ${this.formatTime(newSchedule.end_time)}`,
      });
    }

    if (this.hasClassConflict(newSchedule, excludeId)) {
      validationResults.valid = false;
      validationResults.conflicts.push({
        type: "CLASS_CONFLICT",
        message: `${
          newSchedule.class?.name || newSchedule.class_id
        } sudah memiliki jadwal pada hari ${newSchedule.day} 
                 pukul ${this.formatTime(
                   newSchedule.start_time
                 )} - ${this.formatTime(newSchedule.end_time)}`,
      });
    }

    return validationResults;
  }

  formatTime(date) {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
