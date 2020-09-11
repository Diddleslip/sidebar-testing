import React, { useRef, useState, useEffect } from 'react'
import {
  Checkbox,
  Grid,
  Header,
  Image,
  Menu,
  Ref,
  Segment,
  Sidebar,
} from 'semantic-ui-react'
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import * as parkData from "./Skateboard_Parks.json";
import 'semantic-ui-css/semantic.min.css'

// This token allows for the Map API to connect with our front end map UI
const REACT_APP_MAPBOX_TOKEN="pk.eyJ1IjoibGFtYmRhbGFiczI1ZWNvc29hcCIsImEiOiJja2VhZWRhOG4wNmU5MnNxZXQ0bmhxZnU3In0.zWyuwunBSy51dulZG9gowQ"


const SidebarExampleTarget = () => {
  //This is for Sidebar functionality
  const segmentRef = useRef()
  // This is the state for the Sidebar Component
  const [visible, setVisible] = useState(false)
  // This is the state for the Map API
  const [newData, setNewData] = useState(parkData.default.features);
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "50vw",
    height: "50vh",
    zoom: 10
  });
  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, []);

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Checkbox
          checked={visible}
          label={{ children: <code>visible</code> }}
          onChange={(e, data) => setVisible(data.checked)}
        />
      </Grid.Column>
      <button
        onClick={(e, data) => setVisible(true)}
      >
        CLICK HERE TO OPEN SIDEBAR!
      </button>
      <Grid.Column>
        <Sidebar.Pushable as={Segment.Group} raised>
          <Sidebar
            as={Menu}
            animation='overlay'
            direction="right"
            icon='labeled'
            inverted
            onHide={() => setVisible(false)}
            vertical
            target={segmentRef}
            visible={visible}
            width='thin'
          >
            <Menu.Item as='a'>Home</Menu.Item>
            <Menu.Item as='a'>Games</Menu.Item>
            <Menu.Item as='a'>Channels</Menu.Item>
          </Sidebar>

          <Ref innerRef={segmentRef}>
            <button>Close sidebar</button>
          </Ref>

          <h1>Should be able to highlight these words while Sidebar is open!</h1>
          {/* This div below encapsules all of the map component rendered */}
        <div className="mapCSS">
          <ReactMapGL
            {...viewport} 
            mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/lambdalabs25ecosoap/ckeaib2n30b4f19mq6mj2dsq3"
            onViewportChange={(viewport) => {
              setViewport(viewport);
            }}
          >        
          {/* {console.log(parkData.default.features)} */}
          {newData.map((park) => (        
              <Marker
                key={park.properties.PARK_ID}
                latitude={park.geometry.coordinates[1]}
                longitude={park.geometry.coordinates[0]}
                draggable={true}
                // onDrag={(event) => {
                //   // console.log(event.lngLat)
                // }}
                // onDragStart={(event) => {
                //   // console.log("start!!!", event);
                // }}
                onDragEnd={(event) => {
                  setNewData(prev => {
                    return prev.map(m => 
                      m.properties.PARK_ID === park.properties.PARK_ID ? {
                        ...m,
                        geometry: {
                          ...m.geometry, 
                          coordinates: [event.lngLat[0], event.lngLat[1]]
                        }
                      } : m
                    )
                  })
                }}
              >
                <button className="marker-btn" onClick={(e) => {
                  e.preventDefault();
                  setSelectedPark(park);
                }}>
                  {/* <img src="/skateboarding.svg" alt="Skatepark Icon"/> */}
                </button>
              </Marker>
            ))}

            {selectedPark ? (
              <Popup 
                latitude={selectedPark.geometry.coordinates[1]} 
                longitude={selectedPark.geometry.coordinates[0]}
                onClose={() => {
                  setSelectedPark(null);
                }}
              >
                <div>
                  <h2>{selectedPark.properties.NAME}</h2>
                  <p>{selectedPark.properties.DESCRIPTION}</p>
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
        </div>
        </Sidebar.Pushable>
      </Grid.Column>
    </Grid>
  )
}

export default SidebarExampleTarget
