import React, { useState } from 'react';
import { DevelopmentInfo, useDevelopments } from 'service/useDevelopments';
import Offline from './offline';
import Online from './online';

function Development({ projectID }: { projectID: string }) {
  const [developmentInfo, setDevelopmentInfo] = useState<DevelopmentInfo>({
    fqdn: '',
    updatedAt: '',
    expired: true,
    remoteAddress: '',
    remotePort: 0,
  });
  useDevelopments({ projectID }, setDevelopmentInfo);
  return (
    <div>
      {developmentInfo.expired ? (
        <Offline />
      ) : (
        <Online projectID={projectID} developmentInfo={developmentInfo} />
      )}
    </div>
  );
}

export default Development;
