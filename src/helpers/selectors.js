export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const appointments = [];

  state.days.filter(byDay => {
    
    if (byDay.name === day) {
      for (const appointment of byDay.appointments) {
        appointments.push(state.appointments[appointment]);
      }
    }
  })
  return appointments;
};

export function getInterview(state, interview) {
  if (interview !== null) {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
    };
  }
  return null;
};

export function getInterviewersForDay(state, day) {
  
  const interviewers = [];

  state.days.filter(byDay => {
    
    if (byDay.name === day) {
      for (const interview of byDay.interviewers) {
        interviewers.push(state.interviewers[interview]);
      }
    }
  })
  return interviewers;
};