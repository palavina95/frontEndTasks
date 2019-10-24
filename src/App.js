import React ,{ useState }from 'react';
import './App.css';
import CustomerList from './components/CustomerList';
import TrainingsList from './components/TrainingsList';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SportsKabaddiIcon from '@material-ui/icons/SportsKabaddi';
import EventIcon from '@material-ui/icons/Event';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CalendarDisplay from './components/CalendarDisplay';



function App() {
  const [drawer, setDrawer] = useState(false);
  const [toDisplay, setToDisplay] = useState("customers");

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(open);
  };

  const display = () => {
    if(toDisplay == "customers")
      return <CustomerList/>;
    if(toDisplay == "trainings")
      return <TrainingsList/>;
    if(toDisplay == "calendar")
      return <CalendarDisplay/>;
  }

  const sideList = side => (
    <div
      className="drawer"
      role="presentation"
      onClick={() => setDrawer(false)}
    >
      <List>
          <ListItem button key={"customers"} onClick={() =>setToDisplay("customers")}>
            <ListItemIcon>{<AccountCircleIcon/>}</ListItemIcon>
            <ListItemText primary={"Customers"} />
          </ListItem>
          <ListItem button key={"trainings"}  onClick={() =>setToDisplay("trainings")}>
            <ListItemIcon>{<SportsKabaddiIcon/>}</ListItemIcon>
            <ListItemText primary={"Trainings"} />
          </ListItem>
          <ListItem button key={"calendar"}  onClick={() =>setToDisplay("calendar")}>
            <ListItemIcon>{<EventIcon/>}</ListItemIcon>
            <ListItemText primary={"Calendar"} />
          </ListItem>
      </List>
    </div>
  );

  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <AppBar position="static">
        <Toolbar>
        <Button onClick={() => setDrawer(true)}>
          <Icon>
            <MenuIcon/>
          </Icon>
        </Button>
        
        <Typography variant="h6">
          Personal Trainer
        </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={drawer} onClose={() => setDrawer(false)}>
        {sideList()}
      </Drawer>
      {display()}
    </div>
  );
}

export default App;
