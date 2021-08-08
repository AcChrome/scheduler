export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const result = [];

  state.days.filter(byDay => {
    
    if (byDay.name === day) {
      for (const appointment of byDay.appointments) {
        result.push(state.appointments[appointment]);
      }
    }
  })
  return result;
};

export function getInterviewersForDay(state, day) {
  
  const result = [];

  state.days.filter(byDay => {
    // console.log("byDay", byDay);
    if (byDay.name === day) {
      for (const interview of byDay.interviewers) {
        result.push(state.interviewers[interview]);
      }
    }
  })
  return result;
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