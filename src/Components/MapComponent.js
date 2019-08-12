import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';
import GoogleMapReact from 'google-map-react';
import { Layout, Divider, Row, Col } from 'antd';

const API_LINK = 'https://api.citybik.es/v2/networks/veturilo-warszawa';

const getInfoWindowString = (place) => `
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

const markers = [];
const infowindows = [];

const handleApiLoaded = (map, maps, places) => {
  places.forEach((place) => {
    markers.push(new maps.Marker({
      position: {
        lat: place.latitude,
        lng: place.longitude,
      },
      map,
    }));

    infowindows.push(new maps.InfoWindow({
      content: getInfoWindowString(place),
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


const highlightPlaceFromTheList = (map, maps, places, place) => {
  markers.forEach((marker, i) => {
    if (places[i].id === place.id) {
      infowindows[i].open(map, marker);
    }
  });
};

const closeInfowindow = (map, maps, places, place) => {
  markers.forEach((marker, i) => {
    if (places[i].id === place.id) {
      infowindows[i].close(map, marker);
    }
  });
};

const { Content } = Layout;

export default class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
    };
  }

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

  changeDateFormat = (p) => {
    let date = new Date(p.timestamp);
    let updatedDate = date.toUTCString()
    let finalDate = updatedDate.split(' ').slice(0, 5).join(' ')
    return finalDate
  }

  render() {
    const { places } = this.state;

    return (
      <Layout>
        <Divider />
        <Layout className="LayoutProps">
          <Content className="MapContent">
            {!isEmpty(places) && (
              <GoogleMapReact
                defaultZoom={this.props.zoom}
                defaultCenter={this.props.center}
                bootstrapURLKeys={{ key: 'AIzaSyBezTSjZSagkNk4MhbEy2CKJIRtPmAS2BE' }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps, places)}
              />
            )}
          </Content>
          <Content className="PlacesOuterContent">
            {
              places.map((place, i) => <Content key={i} className="PlacesContent" >
                <Content id={place.id} className="PlacesInnerCell" onMouseOver={({ map, maps }) => highlightPlaceFromTheList(map, maps, places, place)} onMouseOut={({ map, maps }) => closeInfowindow(map, maps, places, place)}>

                  <Row>
                    <Col className="CntPlaceName">{place.name}</Col>
                    <Col className="CntPlaceDate"> Date: {this.changeDateFormat(place)}</Col>
                  </Row>

                  <Row type="flex" justify="space-between" style={{ padding: '0 0 0 5px' }}>
                    <Col className="CntInfos" span={8}>Total slots : {place.extra.slots}</Col>
                    <Col className="CntInfos" span={8}>Empty slots : <span style={{ color: place.empty_slots > 5 ? 'green' : 'red' }}>{place.empty_slots}</span></Col>
                    <Col className="CntInfos" span={8}>Free Bikes : <span style={{ color: place.free_bikes > 5 ? 'green' : 'red' }}>{place.free_bikes}</span></Col>
                  </Row>
                </Content>
              </Content>)
            }
          </Content>
        </Layout>
      </Layout>
    );
  }
}
