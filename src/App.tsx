/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SymptomInput from './pages/SymptomInput';
import AISummary from './pages/AISummary';
import Completion from './pages/Completion';
import DoctorSearch from './pages/DoctorSearch';
import DoctorDashboard from './pages/DoctorDashboard';
import OTPVerify from './pages/OTPVerify';
import { ROUTES } from "./constants/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.SYMPTOM_INPUT} element={<SymptomInput />} />
        <Route path={ROUTES.AI_SUMMARY} element={<AISummary />} />
        <Route path={ROUTES.COMPLETION} element={<Completion />} />
        <Route path={ROUTES.DOCTOR_SEARCH} element={<DoctorSearch />} />
        <Route path={ROUTES.DOCTOR_DASHBOARD} element={<DoctorDashboard />} />
        <Route path={ROUTES.OTP_VERIFY} element={<OTPVerify />} />
      </Routes>
    </BrowserRouter>
  );
}
