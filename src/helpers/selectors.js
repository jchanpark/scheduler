export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find(d => d.name === day);
  if (filteredDay) {
    return filteredDay.appointments.map((appointmentId) => state.appointments[appointmentId]);
  } else {
    return [];
  }
}