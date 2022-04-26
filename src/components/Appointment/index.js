import React from 'react';
import "./styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import useVisualMode from 'hooks/useVisualMode';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW :  EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW));
  }

  function deleteInterview() {
    transition(DELETE);
    props.cancelInterview(props.id, props.interview)
      .then(() => transition(EMPTY));
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={() => console.log("onEdit")} 
        onDelete={() => transition(CONFIRM)} 
        />}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={back} onSave={save}/>} 
      {mode === SAVING && <Status message="Saving..."/>}
      {mode === DELETE && <Status message="Deleting..."/>}
      {mode === CONFIRM && <Confirm onConfirm={deleteInterview} onCancel={back}/>}

    </article>    
  )
}