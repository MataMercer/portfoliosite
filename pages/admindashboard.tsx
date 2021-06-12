import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardTitle,
  Row,
  Col,
} from 'reactstrap';
import classNames from 'classnames';
import Layout from '../components/Layout';
import ProtectRoute from '../auth/ProtectRoute';
import ProjectEntryList from '../components/dashboard/ProjectEntryList';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('1');

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

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
                className={classNames({
                  active: activeTab === '1',
                })}
                onClick={() => {
                  toggle('1');
                }}
              >
                Project Entries
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({
                  active: activeTab === '2',
                })}
                onClick={() => {
                  toggle('2');
                }}
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
                    <CardTitle>Manage Project Entries</CardTitle>
                    <Link href="/projectentryformpage">
                      <a>
                        <Button>Add New Project Entry</Button>
                      </a>
                    </Link>

                    <ProjectEntryList />
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <Card body>
                    <CardTitle>Change About Page</CardTitle>

                    <Link href="/aboutformpage">
                      <a>
                        <Button>Go to About Page Editor</Button>
                      </a>
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
