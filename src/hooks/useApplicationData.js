import { React, useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {

  const updateSpots = function(state, appointments, id) {
    // find the day
    const dayObj = state.days.find(d => d.name === state.day);

    // look at the appointment id's (array)
    let spots = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    const day = { ...dayObj, spots };
    const days = state.days.map(d => {

      if(d.name === state.day) {
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
    // console.log(id, interview);
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
        const newState = {
          ...state,
          appointments
        }
        setState( newState );
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
        // This is the old way
        // const newState = state
        // newState.appointments = newAppointments
        // This is the new way to create a new object
        const newState = {
          ...state,
          appointments: newAppointments
        }
        setState( newState );
      })
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')      
    ]).then((all) => {
      setState(prev =>  ({...prev, days:all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview, updateSpots };
}