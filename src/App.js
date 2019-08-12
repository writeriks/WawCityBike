import React from 'react';
import { NavBar } from './Components/NavBar';
import FormComponent from './Components/FormComponent';
// import MapContent from './Components/MapContent';
import MapComponent from './Components/MapComponent';
import { Layout } from 'antd';

const { Content } = Layout;
export default function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Layout className="layout">
        <Content className="Container">
          <FormComponent dName="Śródmieście" />
          {/* <MapContent /> */}
          <MapComponent />
        </Content>
      </Layout>
    </React.Fragment>
  );
}


