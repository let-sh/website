import { CertificatStatus } from 'components/console/projects/tabs/domains/utils';

export interface ProjectDomain {
  domain: string;
  id: string;
  cn: boolean;
  certificateStatus: CertificatStatus;
  channel: string;
}
