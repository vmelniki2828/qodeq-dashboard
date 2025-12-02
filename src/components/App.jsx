import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { SidebarProvider } from '../contexts/SidebarContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { GlobalStyle } from '../styles/GlobalStyle';
import { Navigation } from './Navigation';
import { useSidebar } from '../contexts/SidebarContext';
import { MenuProvider, useMenu } from '../contexts/MenuContext';
import DynamicDashboard from './DynamicDashboard';
import Starfall from './Starfall';

const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  transition: background-color 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: ${props => props.isCollapsed ? '80px' : '280px'};
  transition: margin-left 0.3s ease;
  background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  min-height: 100vh;
`;

const AppWithTheme = () => {
  const { isDarkTheme } = useTheme();

  return (
    <>
      <GlobalStyle theme={{ isDarkTheme }} />
      <AppContent />
    </>
  );
};

const AppContent = () => {
  const { isCollapsed } = useSidebar();
  const { menu, loading, error } = useMenu();
  const { isDarkTheme } = useTheme();

  if (loading) return <div>Загрузка меню...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!menu || menu.length === 0) return <div>Меню пустое</div>;

  const firstMenu = menu[0];

  return (
    <AppLayout theme={{ isDarkTheme }}>
      <Starfall count={120} isDark={isDarkTheme} />
      <Navigation />
      <MainContent isCollapsed={isCollapsed} theme={{ isDarkTheme }}>
        <Routes>
          <Route path="/" element={<Navigate to={`/${firstMenu.uuid}`} replace />} />
          <Route path=":uuid" element={<DynamicDashboard />} />
          <Route path="*" element={<Navigate to={`/${firstMenu.uuid}`} replace />} />
        </Routes>
      </MainContent>
    </AppLayout>
  );
};

export const App = () => {
  return (
    <Router>
      <ThemeProvider>
      <SidebarProvider>
        <MenuProvider>
            <AppWithTheme />
        </MenuProvider>
      </SidebarProvider>
      </ThemeProvider>
    </Router>
  );
};
