import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPortal from './components/AuthPortal';
import LandingRoleSelection from './components/LandingRoleSelection';
import PatientPortal from './components/PatientPortal';
import DoctorWorkspace from './components/DoctorWorkspace';
import AdminPanel from './components/AdminPanel';
import { initialPatients } from './mockData';
import { checkAccessPermission } from './supabaseClient';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing', 'auth', 'workspace'
  const [authRole, setAuthRole] = useState('Doctor'); // 'Doctor', 'Patient', 'Admin'
  const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState('Doctor'); // 'Doctor', 'Patient', 'Admin'
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. Ananya Sharma, MD',
    email: 'doctor.sharma@medigen.ai',
    role: 'Doctor',
    phone: '+91 98765 43210',
    regNo: 'DMC-49102-DL'
  });

  const [activeTab, setActiveTab] = useState('clinical-decision-support');
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(initialPatients[0]);
  const [rbacError, setRbacError] = useState(null);

  // Synchronize role switch
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    setRbacError(null);

    if (newRole === 'Doctor') {
      setCurrentUser({
        name: 'Dr. Ananya Sharma, MD',
        email: 'doctor.sharma@medigen.ai',
        role: 'Doctor',
        phone: '+91 98765 43210',
        regNo: 'DMC-49102-DL'
      });
      setActiveTab('clinical-decision-support');
    } else if (newRole === 'Patient') {
      setCurrentUser({
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@medigen.ai',
        role: 'Patient',
        phone: '+91 98112 34567',
        abhaId: '91-4829-1092-4819@abdm'
      });
      setActiveTab('patient-portal');
    } else if (newRole === 'Admin') {
      setCurrentUser({
        name: 'Dr. Vikramaditya Roy',
        email: 'compliance.admin@nha.gov.in',
        role: 'Admin',
        phone: '+91 99887 76655',
        adminToken: 'NHA-DEL-SEC-09'
      });
      setActiveTab('governance-compliance');
    }
  };

  // Triggered from Landing page role cards
  const handleSelectRoleFromLanding = (role, intent = 'login', customUserData = null) => {
    if (intent === 'authenticated' && customUserData) {
      handleLoginSuccess(customUserData);
    } else if (intent === 'login') {
      setAuthRole(role);
      setAuthMode('signin');
      setViewMode('auth');
    } else {
      setAuthRole(role);
      setAuthMode('signup');
      setViewMode('auth');
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentRole(userData.role);
    setIsAuthenticated(true);
    setViewMode('workspace');
    setRbacError(null);
    if (userData.role === 'Patient') setActiveTab('patient-portal');
    else if (userData.role === 'Doctor') setActiveTab('clinical-decision-support');
    else setActiveTab('governance-compliance');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setViewMode('landing');
  };

  // Add new uploaded record to patients state
  const handleNewRecordAdded = (record) => {
    setPatients((prev) => {
      return prev.map(p => {
        if (p.id === 'pat-1') {
          return {
            ...p,
            timeline: [record, ...p.timeline]
          };
        }
        return p;
      });
    });
  };

  // If in landing view
  if (viewMode === 'landing') {
    return <LandingRoleSelection onSelectRole={handleSelectRoleFromLanding} />;
  }

  // If in auth view
  if (viewMode === 'auth' || !isAuthenticated) {
    return (
      <AuthPortal 
        initialRole={authRole} 
        initialMode={authMode} 
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  // Render view depending on active role and tab
  const renderCurrentView = () => {
    if (currentRole === 'Patient') {
      return (
        <PatientPortal 
          patient={patients[0]} 
          onNewRecordAdded={handleNewRecordAdded} 
        />
      );
    }

    if (currentRole === 'Doctor') {
      return (
        <DoctorWorkspace 
          patients={patients}
          selectedPatient={selectedPatient}
          onSelectPatient={setSelectedPatient}
        />
      );
    }

    if (currentRole === 'Admin') {
      return <AdminPanel />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col selection:bg-[#3A6364] selection:text-white">
      <Navbar 
        currentRole={currentRole}
        setRole={handleRoleChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGoToLanding={() => setViewMode('landing')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>
    </div>
  );
}

