// Components==============
import React from 'react';
import UnauthenticatedApp from './UnauthenticatedApp';
import Authentication from './Authentication';
// =========================

export default function AuthenticatedApp({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnauthenticatedApp>
      <Authentication>{children}</Authentication>
    </UnauthenticatedApp>
  );
}
