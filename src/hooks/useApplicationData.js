import { useState, useEffect } from "react";
import axios from "axios";

export function useApplicationData(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = spotsRemaining("create");
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      setState({
        ...state,
        appointments,
        days
      });
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };


    const days = spotsRemaining()
    return axios.delete(`/api/appointments/${id}`).then(() => {
      setState({
        ...state,
        appointments,
        days
      });
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  function spotsRemaining(requestType) {
    const dayIndex = state.days.findIndex(day => {
      return day.name === state.day;
    })
    const days = state.days;
    if (requestType === "create") {
      days[dayIndex].spots -= 1
    } else {
      days[dayIndex].spots += 1
    }
    return days;
  }

  return { bookInterview, cancelInterview, state, setDay, spotsRemaining };
}
