import React from 'react';
import { LegalCenterPage } from './LegalCenterPage';

interface Props {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<Props> = ({ onBack }) => {
  return <LegalCenterPage initialTab="privacy" onBack={onBack} />;
};

export default PrivacyPolicyPage;
