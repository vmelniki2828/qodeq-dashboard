import React, { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const WorkspaceContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 600px;
  height: ${props => props.dynamicHeight ? `${props.dynamicHeight}px` : '600px'};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  transition: height 0.3s ease;
  box-sizing: border-box;
  padding-right: 2px;
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: ${props => props.showGrid ? 0.3 : 0.1};
  transition: opacity 0.2s ease;
  background-image: 
    linear-gradient(to right, ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} 1px, transparent 1px),
    linear-gradient(to bottom, ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} 1px, transparent 1px);
  background-size: 40px 40px;
`;

const DraggableBlock = styled.div`
  position: absolute;
  background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  border: 2px solid ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  border-radius: 12px;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  transition: ${props => props.isDragging ? 'none' : 'all 0.2s ease'};
  user-select: none;
  overflow: hidden;
  
  &:hover {
    border-color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    box-shadow: 0 4px 20px ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  }
  
  &.dragging {
    z-index: 1000;
    transform: rotate(2deg) scale(1.02);
    border-color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    box-shadow: 0 8px 32px ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  }
  
  &.resizing {
    border-color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    box-shadow: 0 8px 32px ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  }
`;

const BlockHeader = styled.div`
  border-bottom: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const BlockTitle = styled.h3`
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BlockControls = styled.div`
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${DraggableBlock}:hover & {
    opacity: 1;
  }
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  &:hover {
    background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
    color: ${props => props.theme.isDarkTheme ? '#CCCCCC' : '#666666'};
  }
`;

const BlockContent = styled.div`
  padding: 1rem;
  height: calc(100% - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  font-size: 0.9rem;
`;

const ResizeHandle = styled.div`
  position: absolute;
  background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  border-radius: 50%;
  width: 12px;
  height: 12px;
  cursor: ${props => props.cursor};
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
  
  ${DraggableBlock}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
    border-color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    transform: scale(1.2);
  }
  
  &.top-left { top: -6px; left: -6px; cursor: nw-resize; }
  &.top-right { top: -6px; right: -6px; cursor: ne-resize; }
  &.bottom-left { bottom: -6px; left: -6px; cursor: sw-resize; }
  &.bottom-right { bottom: -6px; right: -6px; cursor: se-resize; }
  &.top { top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
  &.bottom { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
  &.left { left: -6px; top: 50%; transform: translateY(-50%); cursor: w-resize; }
  &.right { right: -6px; top: 50%; transform: translateY(-50%); cursor: e-resize; }
`;

const DropZone = styled.div`
  position: absolute;
  border: 2px dashed ${props => props.hasCollision 
    ? (props.theme.isDarkTheme ? '#CCCCCC' : '#666666') 
    : (props.theme.isDarkTheme ? '#FFFFFF' : '#000000')};
  background: ${props => props.hasCollision 
    ? (props.theme.isDarkTheme ? 'rgba(204, 204, 204, 0.1)' : 'rgba(102, 102, 102, 0.1)') 
    : (props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')};
  border-radius: 8px;
  pointer-events: none;
  z-index: 999;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.1s ease;
`;

const getTypeIcon = (type, isDarkTheme) => {
  const iconStyle = {
    width: '16px',
    height: '16px',
    stroke: isDarkTheme ? '#FFFFFF' : '#000000',
    fill: 'none',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  switch (type) {
    case 'plot': 
      return (
        <svg viewBox="0 0 24 24" style={iconStyle}>
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      );
    case 'table': 
      return (
        <svg viewBox="0 0 24 24" style={iconStyle}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M3 15h18"/>
          <path d="M9 3v18"/>
          <path d="M15 3v18"/>
        </svg>
      );
    case 'metric': 
      return (
        <svg viewBox="0 0 24 24" style={iconStyle}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 9h6v6H9z"/>
        </svg>
      );
    case 'chart': 
      return (
        <svg viewBox="0 0 24 24" style={iconStyle}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    default: 
      return (
        <svg viewBox="0 0 24 24" style={iconStyle}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 9h6v6H9z"/>
        </svg>
      );
  }
};

const GRID_SIZE = 40;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 160;

const WorkspaceGrid = ({ views, onUpdateView, onUpdateViews, onDeleteView, onEdit }) => {
  const { isDarkTheme } = useTheme();
  const { uuid: dashboardUuid } = useParams();
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedId: null,
    startPos: { x: 0, y: 0 },
    startViewPos: { x: 0, y: 0 }
  });

  const [resizeState, setResizeState] = useState({
    isResizing: false,
    resizedId: null,
    handle: null,
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startViewPos: { x: 0, y: 0 }
  });

  const [dropZone, setDropZone] = useState({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    hasCollision: false
  });

  // Сохраняем последнее изменённое view для отправки PATCH после mouseup
  const [pendingPatchView, setPendingPatchView] = useState(null);

  const workspaceRef = useRef(null);

  // Вычисление динамической высоты рабочего пространства
  const calculateWorkspaceHeight = React.useCallback(() => {
    if (!views.length) return 600;
    
    const maxY = Math.max(...views.map(view => view.y + view.height));
    const minHeight = 600;
    const padding = 100; // Дополнительное пространство снизу
    
    return Math.max(minHeight, maxY + padding);
  }, [views]);

  const workspaceHeight = calculateWorkspaceHeight();

  const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const getWorkspaceRect = useCallback(() => {
    if (!workspaceRef.current) return { left: 0, top: 0, width: 0, height: 0 };
    return workspaceRef.current.getBoundingClientRect();
  }, []);

  // Проверка коллизии между блоками
  const checkCollision = useCallback((newView, excludeId = null) => {
    return views.some(view => {
      if (view.uuid === excludeId) return false;
      
      const view1 = { x: newView.x, y: newView.y, width: newView.width, height: newView.height };
      const view2 = { x: view.x, y: view.y, width: view.width, height: view.height };
      
      return !(
        view1.x >= view2.x + view2.width ||
        view1.x + view1.width <= view2.x ||
        view1.y >= view2.y + view2.height ||
        view1.y + view1.height <= view2.y
      );
    });
  }, [views]);

  // Найти свободную позицию для блока

  // Функция для поиска ближайшей допустимой позиции по Y (прилипание)
  const snapToVerticalLine = (view, allViews) => {
    // Найти все нижние границы других блоков, которые не пересекаются по X
    const candidates = allViews
      .filter(v => v.uuid !== view.uuid &&
        !(view.x + view.width <= v.x || view.x >= v.x + v.width))
      .map(v => v.y + v.height);
    // Найти максимальную нижнюю границу, которая не выше текущей позиции
    const maxBelow = Math.max(0, ...candidates.filter(y => y <= view.y));
    return maxBelow;
  };

  const handleMouseDown = useCallback((e, viewUuid, isResize = false, handle = null) => {
    e.preventDefault();
    e.stopPropagation();

    const view = views.find(v => v.uuid === viewUuid);
    if (!view) return;

    const workspaceRect = getWorkspaceRect();
    const mouseX = e.clientX - workspaceRect.left;
    const mouseY = e.clientY - workspaceRect.top;

    if (isResize) {
      setResizeState({
        isResizing: true,
        resizedId: viewUuid,
        handle,
        startPos: { x: mouseX, y: mouseY },
        startSize: { width: view.width, height: view.height },
        startViewPos: { x: view.x, y: view.y }
      });
    } else {
      setDragState({
        isDragging: true,
        draggedId: viewUuid,
        startPos: { x: mouseX, y: mouseY },
        startViewPos: { x: view.x, y: view.y }
      });
    }
  }, [views, getWorkspaceRect]);

  const handleMouseMove = useCallback((e) => {
    const workspaceRect = getWorkspaceRect();
    const mouseX = e.clientX - workspaceRect.left;
    const mouseY = e.clientY - workspaceRect.top;

    if (dragState.isDragging && dragState.draggedId) {
      const view = views.find(v => v.uuid === dragState.draggedId);
      if (!view) return;

      const deltaX = mouseX - dragState.startPos.x;
      const deltaY = mouseY - dragState.startPos.y;

      // Ограничиваем так, чтобы правая/нижняя граница блока не выходила за пределы
      const maxX = Math.max(0, workspaceRect.width - view.width);
      const maxY = Math.max(0, workspaceRect.height - view.height);

      const newX = Math.max(0, Math.min(snapToGrid(dragState.startViewPos.x + deltaX), maxX));
      const newY = Math.max(0, Math.min(snapToGrid(dragState.startViewPos.y + deltaY), maxY));

      const newView = {
        ...view,
        x: newX,
        y: newY
      };

      const hasCollision = checkCollision(newView, dragState.draggedId);

      setDropZone({
        visible: true,
        x: newX,
        y: newY,
        width: view.width,
        height: view.height,
        hasCollision
      });

      if (!hasCollision) {
        handleUpdateViewLocal(dragState.draggedId, newView);
        setPendingPatchView(newView);
      }
    }

    if (resizeState.isResizing && resizeState.resizedId) {
      const view = views.find(v => v.uuid === resizeState.resizedId);
      if (!view) return;

      const deltaX = mouseX - resizeState.startPos.x;
      const deltaY = mouseY - resizeState.startPos.y;

      let newWidth = resizeState.startSize.width;
      let newHeight = resizeState.startSize.height;
      let newX = resizeState.startViewPos.x;
      let newY = resizeState.startViewPos.y;

      switch (resizeState.handle) {
        case 'bottom-right':
          newWidth = Math.max(MIN_WIDTH, snapToGrid(resizeState.startSize.width + deltaX));
          newHeight = Math.max(MIN_HEIGHT, snapToGrid(resizeState.startSize.height + deltaY));
          break;
        case 'bottom-left':
          newWidth = Math.max(MIN_WIDTH, snapToGrid(resizeState.startSize.width - deltaX));
          newHeight = Math.max(MIN_HEIGHT, snapToGrid(resizeState.startSize.height + deltaY));
          newX = resizeState.startViewPos.x + (resizeState.startSize.width - newWidth);
          break;
        case 'top-right':
          newWidth = Math.max(MIN_WIDTH, snapToGrid(resizeState.startSize.width + deltaX));
          newHeight = Math.max(MIN_HEIGHT, snapToGrid(resizeState.startSize.height - deltaY));
          newY = resizeState.startViewPos.y + (resizeState.startSize.height - newHeight);
          break;
        case 'top-left':
          newWidth = Math.max(MIN_WIDTH, snapToGrid(resizeState.startSize.width - deltaX));
          newHeight = Math.max(MIN_HEIGHT, snapToGrid(resizeState.startSize.height - deltaY));
          newX = resizeState.startViewPos.x + (resizeState.startSize.width - newWidth);
          newY = resizeState.startViewPos.y + (resizeState.startSize.height - newHeight);
          break;
        case 'right':
          newWidth = Math.max(MIN_WIDTH, snapToGrid(resizeState.startSize.width + deltaX));
          break;
        case 'left':
          newWidth = Math.max(MIN_WIDTH, snapToGrid(resizeState.startSize.width - deltaX));
          newX = resizeState.startViewPos.x + (resizeState.startSize.width - newWidth);
          break;
        case 'bottom':
          newHeight = Math.max(MIN_HEIGHT, snapToGrid(resizeState.startSize.height + deltaY));
          break;
        case 'top':
          newHeight = Math.max(MIN_HEIGHT, snapToGrid(resizeState.startSize.height - deltaY));
          newY = resizeState.startViewPos.y + (resizeState.startSize.height - newHeight);
          break;
      }

      // Ограничиваем размеры и позицию так, чтобы правая/нижняя граница не выходила за пределы
      const maxWidth = workspaceRect.width - newX;
      const maxHeight = workspaceRect.height - newY;
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);

      const newView = {
        ...view,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };

      const hasCollision = checkCollision(newView, resizeState.resizedId);

      if (!hasCollision) {
        handleUpdateViewLocal(resizeState.resizedId, newView);
        setPendingPatchView(newView);
      }
    }
  }, [dragState, resizeState, views, getWorkspaceRect]);

  // PATCH только после mouseup
  const handleMouseUp = useCallback(() => {
    if (pendingPatchView) {
      // Вертикальное прилипание
      const snappedY = snapToVerticalLine(pendingPatchView, views);
      if (snappedY !== pendingPatchView.y) {
        const snappedView = { ...pendingPatchView, y: snappedY };
        handleUpdateViewLocal(pendingPatchView.uuid, snappedView);
        patchView(snappedView);
      } else {
        patchView(pendingPatchView);
      }
      setPendingPatchView(null);
    }
    setDragState({
      isDragging: false,
      draggedId: null,
      startPos: { x: 0, y: 0 },
      startViewPos: { x: 0, y: 0 }
    });
    setResizeState({
      isResizing: false,
      resizedId: null,
      handle: null,
      startPos: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
      startViewPos: { x: 0, y: 0 }
    });
    setDropZone({ visible: false, x: 0, y: 0, width: 0, height: 0, hasCollision: false });
  }, [pendingPatchView, views]);

  // Глобальные обработчики событий
  React.useEffect(() => {
    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = dragState.isDragging ? 'grabbing' : 
                                   resizeState.isResizing ? `${resizeState.handle}-resize` : 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [dragState.isDragging, resizeState.isResizing, handleMouseMove, handleMouseUp]);


  const handleUpdateViewLocal = (viewUuid, updatedView) => {
    if (onUpdateViews) {
      onUpdateViews(views.map(v => v.uuid === viewUuid ? updatedView : v));
    } else if (onUpdateView) {
      onUpdateView(viewUuid, updatedView);
    }
  };

  // PATCH-запрос при изменении блока
  const patchView = async (view) => {
    if (!dashboardUuid || !view?.uuid) return;
    const patchBody = {
      title: view.title,
      description: view.description,
      target: view.target,
      type: view.type,
      width: view.width,
      height: view.height,
      x: view.x,
      y: view.y
    };
    try {
      const response = await fetch(`https://dashboard.test.qodeq.net/api/v1/view/${dashboardUuid}/${view.uuid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Patch error response:', errorText);
        throw new Error(`Failed to update view: ${response.status}`);
      }
    } catch (err) {
      console.error('Error patching view:', err);
      // Можно добавить уведомление пользователю
    }
  };

  const handleDeleteView = (viewUuid) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот блок?');
    if (confirmed) {
      fetch(`https://dashboard.test.qodeq.net/api/v1/view/${dashboardUuid}/${viewUuid}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) throw new Error('Ошибка при удалении блока');
        onUpdateViews(views.filter(v => v.uuid !== viewUuid));
      })
      .catch(err => {
        alert(err.message);
      });
    }
  };

  return (
    <WorkspaceContainer ref={workspaceRef} dynamicHeight={workspaceHeight} theme={{ isDarkTheme }}>
      <GridOverlay showGrid={dragState.isDragging || resizeState.isResizing} theme={{ isDarkTheme }} />
      
      {/* Drop zone подсказка */}
      <DropZone
        visible={dropZone.visible}
        hasCollision={dropZone.hasCollision}
        theme={{ isDarkTheme }}
        style={{
          left: dropZone.x,
          top: dropZone.y,
          width: dropZone.width,
          height: dropZone.height
        }}
      />

      {views.map((view, index) => (
        <DraggableBlock
          key={view.uuid}
          theme={{ isDarkTheme }}
          className={`
            ${dragState.draggedId === view.uuid ? 'dragging' : ''}
            ${resizeState.resizedId === view.uuid ? 'resizing' : ''}
          `}
          style={{
            left: view.x,
            top: view.y,
            width: view.width,
            height: view.height,
            zIndex: dragState.draggedId === view.uuid || resizeState.resizedId === view.uuid ? 1000 : 1
          }}
          onMouseDown={(e) => {
            // Не инициировать drag, если клик по кнопке управления
            if (
              e.target.closest('button') ||
              e.target.classList.contains('ControlButton')
            ) return;
            handleMouseDown(e, view.uuid);
          }}
        >
          <BlockHeader theme={{ isDarkTheme }}>
            <BlockTitle theme={{ isDarkTheme }}>
              {getTypeIcon(view.type, isDarkTheme)} {view.title}
            </BlockTitle>
            <BlockControls>
              <ControlButton theme={{ isDarkTheme }} onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(view, index);
              }}>
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: isDarkTheme ? '#FFFFFF' : '#000000', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </ControlButton>
              <ControlButton theme={{ isDarkTheme }} onClick={(e) => {
                e.stopPropagation();
                handleDeleteView(view.uuid);
              }}>
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: isDarkTheme ? '#FFFFFF' : '#000000', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </ControlButton>
            </BlockControls>
          </BlockHeader>

          <BlockContent theme={{ isDarkTheme }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {getTypeIcon(view.type, isDarkTheme)}
              </div>
              <div style={{ color: (view.description === 'string' ? (isDarkTheme ? '#FFFFFF' : '#000000') : undefined) }}>
                {view.description || 'Block content'}
              </div>
              <div style={{ fontSize: '0.8rem', color: isDarkTheme ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', marginTop: '0.5rem' }}>
                {view.width}×{view.height} | {view.type}
              </div>
              <div style={{ fontSize: '0.7rem', color: isDarkTheme ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', marginTop: '0.25rem' }}>
                Position: ({view.x}, {view.y})
              </div>
            </div>
          </BlockContent>

          {/* Ручки для изменения размера */}
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="top-left"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'top-left')}
          />
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="top-right"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'top-right')}
          />
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="bottom-left"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'bottom-left')}
          />
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="bottom-right"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'bottom-right')}
          />
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="top"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'top')}
          />
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="bottom"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'bottom')}
          />
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="left"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'left')}
          />
          <ResizeHandle 
            theme={{ isDarkTheme }}
            className="right"
            onMouseDown={(e) => handleMouseDown(e, view.uuid, true, 'right')}
          />
        </DraggableBlock>
      ))}
    </WorkspaceContainer>
  );
};

export default WorkspaceGrid;