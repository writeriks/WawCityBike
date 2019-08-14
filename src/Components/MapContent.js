import React, {Component} from 'react';
import isEmpty from 'lodash.isempty';
import GoogleMapReact from 'google-map-react';
import {Layout, Divider} from 'antd';

const API_LINK = 'https://api.citybik.es/v2/networks/veturilo-warszawa';
const markers = [];
const infowindows = [];
const {Content} = Layout;

export default class MapComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      places: [],
    };
  }
  //////////////////////
  static defaultProps = {
    center: {
      lat: 52.229676,
      lng: 21.012229,
    },
    zoom: 11,
  };

  componentWillMount() {
    fetch(API_LINK)
      .then((result) => result.json()
      ).then((data) => {
        this.setState({
          places: data.network.stations,
        });
      });
  }

  getInfoWindowString = (place) => `
  <div>
    <div style="font-size: 16px; color:#f44b42; font-weight:bold;">
      ${place.name}
    </div>
    <div style="font-size: 14px;">
      <span style="color: grey;">
      Total Slots : ${place.extra.slots}
      </span>
    </div>
    <div style="font-size: 14px;">
      <span style="color: grey;">
      Empty Slots : ${place.empty_slots}
      </span>
    </div>
    <div style="font-size: 14px;">
      <span style="color: grey;">
      Free Bikes : ${place.free_bikes}
      </span>
    </div>
  </div>`;

  handleApiLoaded = (map, maps, places) => {
    places.forEach((place) => {
      markers.push(new maps.Marker({
        position: {
          lat: place.latitude,
          lng: place.longitude,
        },
        map,
      }));
      infowindows.push(new maps.InfoWindow({
        content: this.getInfoWindowString(place),
      }));
    });

    markers.forEach((marker, i) => {
      marker.addListener('mouseover', () => {
        infowindows[i].open(map, marker);
      });
      marker.addListener('mouseout', () => {
        infowindows[i].close(map, marker);
      });
    });
  };

  highlightPlaceFromTheList = (map, maps, places, place) => {
    markers.forEach((marker, i) => {
      if (places[i].id === place.id) {
        infowindows[i].open(map, marker);
      }
    });
  };

  closeInfowindow = (map, maps, places, place) => {
    markers.forEach((marker, i) => {
      if (places[i].id === place.id) {
        infowindows[i].close(map, marker);
      }
    });
  };

  render() {
    const {places} = this.state;

    return (
      <Layout>
        <Divider />
        <Layout className="LayoutProps">
          <Content className="MapContent">
            {!isEmpty(places) && (
              <GoogleMapReact
                defaultZoom={this.props.zoom}
                defaultCenter={this.props.center}
                bootstrapURLKeys={{key: 'AIzaSyBezTSjZSagkNk4MhbEy2CKJIRtPmAS2BE'}}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => this.handleApiLoaded(map, maps, places)}
              />
            )}
          </Content>
          <Content className="PlacesOuterContent" id="ScrollBarStyle">
            {
              places.map((place, i) => <Content key={i} className="PlacesContent">
                <Content id={place.id} className="PlacesInnerCell"
                  onMouseOver={({map, maps}) => this.highlightPlaceFromTheList(map, maps, places, place)}
                  onMouseOut={({map, maps}) => this.closeInfowindow(map, maps, places, place)}>
                  <Content className="CntPlaceName">{place.name}</Content>
                  <Content className="CntFrame">
                    <Content className="CntInfos">Total slots : {place.extra.slots}</Content>
                    <Content className="CntInfos" >Empty slots : <span style={{color: place.empty_slots > 5 ? 'green' : 'red'}}>{place.empty_slots}</span></Content>
                    <Content className="CntInfos" style={{padding: place.empty_slots < 10 ? '0 0 0 10px' : '0 0 0 5px'}}>Free Bikes  : <span style={{color: place.free_bikes > 5 ? 'green' : 'red'}}>{place.free_bikes}</span></Content>
                  </Content>
                </Content>
              </Content>)
            }
          </Content>
        </Layout>
      </Layout>
    );
  }
}
