import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

import './App.css';
import Auth from './components/Auth';
import ToDoList from './components/ToDoList';
import Nav from './components/Nav';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(data.session);
      }
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {session && <Nav />}
      <div>
        <Routes>
          <Route
            path="/"
            element={
              session ? <ToDoList /> : <Navigate to="/auth" replace={true} />
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
