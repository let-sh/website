export enum CertificatStatus {
  DnsError = 'dns_error',
  Signing = 'signing',
  Signed = 'signed',
}

export enum StepStatus {
  NotReach = 'not-reach',
  Success = 'success',
  Failed = 'failed',
  Pending = 'pending',
}

export function getStatusFromCert(cs: CertificatStatus, step: number) {
  switch (step) {
    case 1: {
      if (cs === CertificatStatus.DnsError) {
        return StepStatus.Failed;
      }
      return StepStatus.Success;
    }
    case 2: {
      if (cs === CertificatStatus.Signed) {
        return StepStatus.Success;
      }
      if (cs === CertificatStatus.Signing) {
        return StepStatus.Pending;
      }
      return StepStatus.NotReach;
    }
    default:
      return StepStatus.NotReach;
  }
}

export function getStepFromCert(cs: CertificatStatus) {
  switch (cs) {
    case CertificatStatus.DnsError: {
      return 1;
    }
    case CertificatStatus.Signed:
    case CertificatStatus.Signing: {
      return 2;
    }
    default:
      return 1;
  }
}
