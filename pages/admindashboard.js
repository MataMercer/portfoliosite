import React, { createContext, useState, useContext, useEffect } from "react";
import { ProtectRoute } from "../auth/ProtectRoute";
import Link from "next/link";
import Layout from "../components/Layout";
import { Button, Form, FormGroup, Label, Input, FormText, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col } from "reactstrap";
import classnames from 'classnames';

function AdminDashboard() {

  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <div>
      <Layout title="Admin Dashboard">

        <section>
          <h1 className="title">Dashboard</h1>
          
        </section>



        <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Project Entries
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            About Page
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
            <Card body>
            <Button>
            <Link href="/projectentryformpage">
              <a>Add New Project Entry</a>
            </Link>
          </Button>
          </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
          <Col sm="12">
          <Card body>
          <CardTitle>Special Title Treatment</CardTitle>
          <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
          
            <Link href="/aboutformpage">
              <a><Button>Go to About Page Editor</Button></a>
            </Link>
         
        </Card>
          </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
      </Layout>
    </div>
  );
}

export default ProtectRoute(AdminDashboard);
