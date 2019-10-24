import React, { useState, useEffect } from "react";
import "react-table/react-table.css";
import MaterialTable from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

const TrainingsList = () => {
  var moment = require('moment');
  
  const [trainings, setTrainings] = useState([]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch("https://customerrest.herokuapp.com/api/trainings")
        .then(response => response.json())
        .then(data => setTrainings(data.content))
        .catch(err => console.error(err))
  };

  const deleteTraining = (newTraining) => {
    fetch(newTraining.links[0].href,
    {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newTraining) 
    })
    .then(res => fetchTrainings())
    .then(res => setMessage('This training has been deleted succesfully'))
    .then(res => setOpen(true))
    .catch(err => console.error(err))
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const columns = [
    { title: "Date", field: "date", render: rowData => moment(rowData.date).format("MMMM Do YYYY, hh:mm a") },
    { title: "Duration", field: "duration" },
    { title: "Activity", field: "activity" },
  ];

  return (
    <div>
        <MaterialTable 
        columns={columns}
        data={trainings}
        title="Trainings"
        editable={{
          onRowDelete: (newData) =>
            new Promise((resolve) => {
              {
                deleteTraining(newData)
              }
              resolve()
            }),
        }}
        options={{
          search: true,
          sorting: true
        }}>
        </MaterialTable>
        <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        >
        </Snackbar>
    </div>
  );
};

export default TrainingsList;