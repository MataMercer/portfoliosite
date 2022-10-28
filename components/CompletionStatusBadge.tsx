import { Badge } from 'react-bootstrap';

type CompletionStatusBadgeProps = {
  completionStatus: string;
};

function CompletionStatusBadge(props: CompletionStatusBadgeProps) {
  const { completionStatus } = props;
  switch (completionStatus) {
    case 'inProgress':
      return <Badge bg="warning">In Progress</Badge>;
    case 'completed':
      return <Badge bg="success">Completed</Badge>;
    case 'onHold':
      return <Badge bg="secondary">On Hold</Badge>;
    default:
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
  }
}

export default CompletionStatusBadge;
