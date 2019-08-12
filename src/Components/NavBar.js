import React from 'react';
import { Layout } from 'antd';
const { Header } = Layout;

export function NavBar() {
  return (
    <Layout className="layout">
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="header">Warsaw City Bike</div>
      </Header>
    </Layout>
  );
}
