import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ViewModal from './ViewModal';
import WorkspaceGrid from './WorkspaceGrid';
import { useTheme } from '../contexts/ThemeContext';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: transparent;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  margin: 0;
`;

const DashboardControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AddButton = styled.button`
  background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'};
  border-radius: 8px;
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
  }
`;

const ViewsSection = styled.div`
  margin-top: 2rem;
`;

const DynamicDashboard = () => {
  const { uuid } = useParams();
  const { isDarkTheme } = useTheme();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingView, setEditingView] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dashboard.test.qodeq.net/api/v1/dashboard/${uuid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard');
        }
        const data = await response.json();
        setDashboard(data);
        // Views приходят вместе с дашбордом
        if (data.views) {
          setViews(data.views);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchDashboard();
    }
  }, [uuid]);

  // Функция для очистки данных от полей, которые не должны отправляться на сервер
  const cleanViewData = (viewData) => {
    const { schema_version, uuid, ...cleanData } = viewData;
    return cleanData;
  };

  const handleAddView = async (viewData) => {
    try {
      const cleanData = cleanViewData(viewData);
      const response = await fetch(`https://dashboard.test.qodeq.net/api/v1/view/${uuid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        throw new Error('Failed to create view');
      }

      const newView = await response.json();
      setViews([...views, newView]);
      setShowModal(false);
    } catch (err) {
      console.error('Error creating view:', err);
      alert('Ошибка при создании блока');
    }
  };

  const handleUpdateView = async (viewUuid, updatedData) => {
    try {
      const cleanData = cleanViewData(updatedData);
      const response = await fetch(`https://dashboard.test.qodeq.net/api/v1/view/${uuid}/${viewUuid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        throw new Error(`Failed to update view: ${response.status}`);
      }

      const updatedView = await response.json();
      setViews(views.map(view => view.uuid === viewUuid ? updatedView : view));
      setShowModal(false);
      setEditingView(null);
    } catch (err) {
      console.error('Error updating view:', err);
      alert('Ошибка при обновлении блока');
    }
  };

  const handleDeleteView = async (viewUuid) => {
    try {
      const response = await fetch(`https://dashboard.test.qodeq.net/api/v1/view/${uuid}/${viewUuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete view');
      }

      setViews(views.filter(view => view.uuid !== viewUuid));
    } catch (err) {
      console.error('Error deleting view:', err);
      alert('Ошибка при удалении блока');
    }
  };

  const handleEditView = (view) => {
    setEditingView(view);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingView(null);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: isDarkTheme ? '#fff' : '#000' }}>
          Загрузка дашборда...
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: isDarkTheme ? '#fff' : '#000' }}>
          Ошибка: {error}
        </div>
      </DashboardContainer>
    );
  }

  if (!dashboard) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: isDarkTheme ? '#fff' : '#000' }}>
          Дашборд не найден
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer theme={{ isDarkTheme }}>
      <DashboardHeader theme={{ isDarkTheme }}>
        <DashboardTitle theme={{ isDarkTheme }}>{dashboard.title}</DashboardTitle>
        <DashboardControls>
          <AddButton theme={{ isDarkTheme }} onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: isDarkTheme ? '#FFFFFF' : '#000000', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', marginRight: '4px' }}>
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Add block
          </AddButton>
        </DashboardControls>
      </DashboardHeader>

      <ViewsSection theme={{ isDarkTheme }}>
        <WorkspaceGrid
          views={views}
          onUpdateView={handleUpdateView}
          onUpdateViews={setViews}
          onDeleteView={handleDeleteView}
          onEdit={handleEditView}
        />
      </ViewsSection>

      {showModal && (
        <ViewModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={editingView ? (data) => handleUpdateView(editingView.uuid, data) : handleAddView}
          editingView={editingView}
        />
      )}
    </DashboardContainer>
  );
};

export default DynamicDashboard;