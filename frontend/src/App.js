import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import QuotePage from './pages/QuotePage';
import ContractPage from './pages/ContractPage';
import LabelPage from './pages/LabelPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/contract" element={<ContractPage />} />
            <Route path="/label" element={<LabelPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App; 