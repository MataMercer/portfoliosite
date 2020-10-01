import { Badge } from 'reactstrap';

type CompletionStatusBadgeProps = {
  completionStatus: string;
};

const CompletionStatusBadge = (props: CompletionStatusBadgeProps) => {
  const { completionStatus } = props;
  switch (completionStatus) {
    case 'inProgress':
      return <Badge color="warning">In Progress</Badge>;
    case 'completed':
      return <Badge color="success">Completed</Badge>;
    case 'onHold':
      return <Badge color="secondary">On Hold</Badge>;
    default:
      return <></>;
  }
};

export default CompletionStatusBadge;
