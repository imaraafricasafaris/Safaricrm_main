import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ApiDashboardLayout from '../components/layout/ApiDashboardLayout';
import Overview from './api/Overview';
import ApiKeys from './api/ApiKeys';
import Endpoints from './api/Endpoints';
import Webhooks from './api/Webhooks';
import Documentation from './api/Documentation';
import Settings from './api/Settings';

export default function ApiDashboard() {
  return (
    <ApiDashboardLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="keys" element={<ApiKeys />} />
        <Route path="endpoints" element={<Endpoints />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="docs" element={<Documentation />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/api-dashboard" replace />} />
      </Routes>
    </ApiDashboardLayout>
  );
}