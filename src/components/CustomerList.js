import React, { useState, useEffect } from "react";
import "react-table/react-table.css";
import MaterialTable from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DateFnsUtils from '@date-io/date-fns';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [openNewTraining, setOpenNewTraining] = useState(false);
  const [training, setTraining] = useState(
    {date: new Date().now, duration: 0, activity: '', customer: ''}
  )

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setTraining({date: new Date().now, duration: 0, activity: '', customer: ''});
    setOpenNewTraining(false);
  };

  const handleInputChange = (event) => {
    setTraining({...training, [event.target.name]: event.target.value});
  }

  const handleDateChange = dateInput => {
    setTraining({...training, date: dateInput});
    console.log(training);
  };

  const fetchCustomers = () => {
    fetch("https://customerrest.herokuapp.com/api/customers")
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
  };

  const saveCustomer = (newCustomer) => {
    fetch("https://customerrest.herokuapp.com/api/customers",
    {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newCustomer) 
    })
    .then(res => fetchCustomers())
    .then(res => setMessage('This customer has been saved succesfully'))
    .then(res => setOpen(true))
    .catch(err => console.error(err))
  }

  const addTraining = (newTraining) => {
    
    fetch("https://customerrest.herokuapp.com/api/trainings",
    {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newTraining) 
    })
    .then(res => fetchCustomers())
    .then(res => setMessage('This training has been saved succesfully'))
    .then(res => setOpen(true))
    .catch(err => console.error(err))
  
}

  const updateCustomer = (newCustomer) => {
    fetch(newCustomer.links[0].href,
    {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newCustomer) 
    })
    .then(res => fetchCustomers())
    .then(res => setMessage('This customer has been updated succesfully'))
    .then(res => setOpenNewTraining(false))
    .then(res => setTraining({date: new Date().now, duration: 0, activity: '', customer: ''}))
    .catch(err => console.error(err))
  }

  const deleteCustomer = (newCustomer) => {
    fetch(newCustomer.links[0].href,
    {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newCustomer) 
    })
    .then(res => fetchCustomers())
    .then(res => setMessage('This customer has been deleted succesfully'))
    .then(res => setOpen(true))
    .catch(err => console.error(err))
  }

  const columns = [
    { title: "Firstname", field: "firstname" },
    { title: "Lastname", field: "lastname" },
    { title: "Address", field: "streetaddress" },
    { title: "Postcode", field: "postcode" },
    { title: "City", field: "city" },
    { title: "Email", field: "email" },
    { title: "Phone", field: "phone" },
  ];

  return (
    <div>
        <MaterialTable 
        columns={columns}
        data={customers}
        title="Customers"
        editable={{
          onRowAdd: newData =>
            new Promise((resolve) => {
              {
                saveCustomer(newData)
              }
              resolve()
          }),
          onRowUpdate: (newData) =>
            new Promise((resolve) => {
              {
                updateCustomer(newData)
              }
              resolve()
            }),
          onRowDelete: (newData) =>
            new Promise((resolve) => {
              {
                deleteCustomer(newData)
              }
              resolve()
            }),
        }}
        actions={[
          {
            icon: 'add',
            tooltip: 'Add training',
            onClick: (event, rowData) => {
              setOpenNewTraining(true)
              setTraining({...training, customer: rowData.links[0].href});
            }
          }
        ]}
        options={{
          search: true,
          sorting: true
        }}>
        </MaterialTable>
        <Dialog open={openNewTraining} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">New training</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Fill training information here
            </DialogContentText>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="date-picker-inline"
                    label="Date"
                    value={training.date}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  <KeyboardTimePicker
                    id="time-picker"
                    label="Time"
                    value={training.date}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <TextField
              margin="dense"
              name="duration"
              value= {training.duration}
              onChange={e => handleInputChange(e)}
              label="Duration"
              fullWidth
              />
              <TextField
              margin="dense"
              name="activity"
              value= {training.activity}
              onChange={e => handleInputChange(e)}
              label="Activity"
              fullWidth
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => addTraining(training)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
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

export default CustomerList;