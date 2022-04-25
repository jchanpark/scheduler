export function getAppointmentsForDay(state, day) {

  const filteredDay = state.days.find(d => d.name === day);
  if (filteredDay) {
    return filteredDay.appointments.map((appointmentId) => state.appointments[appointmentId]);
  } else {
    return [];
  }
}

export function getInterview(state, interview) {

  if(interview) {
    const inteviewerId = interview.interviewer;
    const interviewData = {
      ...interview,
      interviewer: state.interviewers[inteviewerId]
    }
    return interviewData;
  } else {
    return null;
  }
};