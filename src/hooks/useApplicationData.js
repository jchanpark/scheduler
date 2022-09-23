import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {

  const updateSpots = function (state, appointments) {
    // find the day
    const dayObj = state.days.find(d => d.name === state.day); // to find the selcted day in old state

    // look at the appointment id's (array)
    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) { // if specific appointment has null to its interview spots counts one
        spots++;
      }
    }
    const day = { ...dayObj, spots }; // day with updated spots
    const days = state.days.map(d => {

      if (d.name === state.day) { // to find day with updated spots in old state
        return day;
      }
      return d;
    });

    // return an updated days array
    return days;
  }

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    interviewers: {},
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => {
        const days = updateSpots(state, appointments) // declare days with new available spot value to set state
        const newState = {
          ...state,
          appointments, days
        }
        setState(newState); // after database updated set new state
      })
  }

  function cancelInterview(id) {
    const newAppointment = {
      ...state.appointments[id],
      interview: null
    };

    const newAppointments = {
      ...state.appointments,
      [id]: newAppointment
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        const days = updateSpots(state, newAppointments) // declare days with new available spot value to set state
        const newState = {
          ...state, days,
          appointments: newAppointments
        }
        setState(newState); // after database updated set new state
      })
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview, updateSpots };
}