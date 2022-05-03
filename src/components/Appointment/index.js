import React from 'react';
import "./styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import useVisualMode from 'hooks/useVisualMode';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  };

  function destroy() {
    transition(DELETING);
    props.cancelInterview(props.id, props.interview)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={() => transition(EDIT)}
        onDelete={() => transition(CONFIRM)}
      />}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save} />}

      {mode === EDIT && <Form
        student={props.interview.student}
        interviewer={props.interview.interviewer["id"]}
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save} />}

      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRM && <Confirm onConfirm={destroy} onCancel={back} />}
      {mode === ERROR_SAVE && <Error message="Error...could not save appointment" onClose={back} />}
      {mode === ERROR_DELETE && <Error message="Error...could not delete appointment" onClose={back} />}

    </article>
  )
};