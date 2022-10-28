import { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { Nav, Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap';
import Layout from '../components/Layout';
import ProtectRoute from '../auth/ProtectRoute';
import ProjectEntryList from '../components/dashboard/ProjectEntryList';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('1');
  return (
    <div>
      <Layout title="Admin Dashboard">
        <section>
          <h1 className="title">Dashboard</h1>
        </section>

        <div>
          <Tabs
            activeKey={activeTab}
            onSelect={(it) => setActiveTab(it || '1')}
          >
            <Tab eventKey="1" title="Project Entries">
              <Row>
                <Col sm="12">
                  <Card body>
                    <Card.Title>Manage Project Entries</Card.Title>
                    <Link href="/projectentryformpage">
                      <a>
                        <Button>Add New Project Entry</Button>
                      </a>
                    </Link>

                    <ProjectEntryList />
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="2" title="About Page">
              <Row>
                <Col sm="12">
                  <Card body>
                    <Card.Title>Change About Page</Card.Title>

                    <Link href="/aboutformpage">
                      <a>
                        <Button>Go to About Page Editor</Button>
                      </a>
                    </Link>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </div>
      </Layout>
    </div>
  );
}

export default ProtectRoute(AdminDashboard);
