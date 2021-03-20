import React from 'react';
import {useEffect, useState } from 'react';
import './App.css';
//Material UI
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
    main: {
      marginLeft: "5px"
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);


const VehiclesCards: Function = (groups: any[]): JSX.Element => {
  const classes = useStyles();
  const [ apiData, setApiData ] = useState([]);
  let property = {} as any;
  const [ vehicleInfo, setVehicleInfo ] = useState( property );
  const [ onlyShowData, setOnlyShowData ] = useState( false );
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [open, setOpen] = useState(false);
  const handleSubmit = (event : any) => {
    debugger
    event.preventDefault();
    let formData = new FormData(event.target);
    for ( let [key, value] of formData.entries() ){
      vehicleInfo[ key ] = value;
    } 

    fetch( "http://localhost:5000/vehicles", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( vehicleInfo )
    }).then( resp => resp ).then( respp => {
      debugger
      if( respp.status === 200 ){
        setSnackOpen( true )
      }
      setOpen(false);
      fetch( "http://localhost:5000/vehicles",
      {
        method: 'GET', 
        mode: 'cors',
        credentials: 'same-origin'
      }).then( res => {
        return res.json()
      }).then( res => {
        setApiData( res )
      })
    })
  }

  useEffect(() => {
    fetch( "http://localhost:5000/vehicles",
    {
      method: 'GET', 
      mode: 'cors',
      credentials: 'same-origin'
    }).then( res => {
      return res.json()
    }).then( res => {
      setApiData( res )
    })
  }, [ ]);

  const handleOpen = (vehicle : any, onlyShowData : boolean) => {
    setOpen(true);
    setVehicleInfo( vehicle );
    setOnlyShowData( onlyShowData );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (vehicle : any, inputKey : string, e : any) => {
    let newVehicleString = JSON.stringify( vehicle );
    let newVehicle = JSON.parse( newVehicleString );
    newVehicle[ inputKey ] = e.target.value;
    setVehicleInfo( newVehicle );
  };

  const handleCloseSnack = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <div style={{ display: "flex" }}> 
      {apiData.map( (item: any) => {
        return (
          <Card key={item["_id"]} className={classes.main}  >
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={ item.image }
                title="Vehicle"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  { item.make } / { item.model }
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <p>Identificador:  { item.id } </p>
                  <h5>Fecha programada: { item.estimatedate } </h5>
                  <p>Descripción: { item.description } </p>
                </Typography>
              </CardContent>
            </CardActionArea>
            <div  style={{ backgroundColor: item.persona !== undefined &&  item.persona !== "" ? "#3ec7e6" : "" }} >
              <CardActions   >
                <Button size="small" color="primary" onClick={ () => handleOpen( item, false ) } >
                  Mantenimiento
                </Button>
                <Button size="small" color="primary" onClick={ () => handleOpen( item, true ) } >
                  Ver Datos
                </Button>
              </CardActions>
            </div>
        </Card>
        )
      })}
      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
         <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Mantenimiento</h2>
            {
              onlyShowData && <pre>
                { JSON.stringify(vehicleInfo, null, 2) }
              </pre>
            }
            {
              !onlyShowData && 
                <form onSubmit={ handleSubmit }  style={{ display: "grid" }} >
                  <label>
                    Persona:
                    <input type="text" name="persona"  value={ vehicleInfo && Object.entries(vehicleInfo).length > 0 ? vehicleInfo.persona : "" }  onChange={ (e) => handleChange( vehicleInfo, "persona", e ) } />
                  </label>
                  <label>
                    Fecha estimada de entrega:
                    <input type="date" name="fecha" value={ vehicleInfo && Object.entries(vehicleInfo).length > 0 ? vehicleInfo.fecha : "" }   onChange={ (e) => handleChange( vehicleInfo, "fecha", e ) }  />
                  </label>
                  <label>
                    Id del Vehiculo:
                    <input type="text" name="vehicleId" value={ vehicleInfo && Object.entries(vehicleInfo).length > 0 ? vehicleInfo.id : "" }  onChange={ (e) => handleChange( vehicleInfo, "id", e ) }   />
                  </label>
                  <input type="submit" value="Guardar" />
                </form>
            }
          </div>
        </Fade>
      </Modal>
      <div style={{ backgroundColor: "lightgreen" }}>
        <Snackbar open={snackOpen} autoHideDuration={2000}  onClose={handleCloseSnack } anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }} message={"Información actualizada con éxito"} />
      </div>
        
      
    </div>
  );
}



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <VehiclesCards />
      </header>
    </div>
  );
}

export default App;
