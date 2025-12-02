import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.isDarkTheme 
    ? 'rgba(0, 0, 0, 0.9)' 
    : 'rgba(0, 0, 0, 0.7)'};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.isDarkTheme 
    ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 20px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  max-width: 900px;
  width: 100%;
  min-width: 500px;
  max-height: none;
  overflow-y: visible;
  box-shadow: ${props => props.theme.isDarkTheme 
    ? '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' 
    : '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)'};
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalTitle = styled.h2`
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  text-shadow: ${props => props.theme.isDarkTheme 
    ? '0 2px 4px rgba(0,0,0,0.5)' 
    : '0 2px 4px rgba(255,255,255,0.5)'};
  letter-spacing: 0.5px;
`;

const FormGroup = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: ${props => props.theme.isDarkTheme 
    ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' 
    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 8px;
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.isDarkTheme 
    ? 'inset 0 1px 0 rgba(255,255,255,0.1)' 
    : 'inset 0 1px 0 rgba(255,255,255,0.8)'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'};
    box-shadow: ${props => props.theme.isDarkTheme 
      ? '0 0 0 2px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' 
      : '0 0 0 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)'};
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: ${props => props.theme.isDarkTheme 
    ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' 
    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 8px;
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  font-size: 0.9rem;
  min-height: 70px;
  resize: none;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.isDarkTheme 
    ? 'inset 0 1px 0 rgba(255,255,255,0.1)' 
    : 'inset 0 1px 0 rgba(255,255,255,0.8)'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'};
    box-shadow: ${props => props.theme.isDarkTheme 
      ? '0 0 0 2px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' 
      : '0 0 0 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)'};
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: ${props => props.theme.isDarkTheme 
    ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' 
    : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 8px;
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.isDarkTheme 
    ? 'inset 0 1px 0 rgba(255,255,255,0.1)' 
    : 'inset 0 1px 0 rgba(255,255,255,0.8)'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'};
    box-shadow: ${props => props.theme.isDarkTheme 
      ? '0 0 0 2px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' 
      : '0 0 0 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)'};
    transform: translateY(-1px);
  }
  
  option {
    background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
    color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  }
`;


const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' 
    ? (props.theme.isDarkTheme 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)' 
      : 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 100%)')
    : (props.theme.isDarkTheme 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' 
      : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%)')};
  border: 1px solid ${props => props.variant === 'primary' 
    ? (props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)')
    : (props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)')};
  border-radius: 12px;
  color: ${props => props.variant === 'primary' 
    ? (props.theme.isDarkTheme ? '#FFFFFF' : '#000000')
    : (props.theme.isDarkTheme ? '#fff' : '#000')};
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.variant === 'primary' 
    ? (props.theme.isDarkTheme 
      ? '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' 
      : '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)')
    : (props.theme.isDarkTheme 
      ? 'inset 0 1px 0 rgba(255,255,255,0.1)' 
      : 'inset 0 1px 0 rgba(255,255,255,0.8)')};
  
  &:hover {
    background: ${props => props.variant === 'primary' 
      ? (props.theme.isDarkTheme 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)' 
        : 'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 100%)')
      : (props.theme.isDarkTheme 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)' 
        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)')};
    border-color: ${props => props.variant === 'primary' 
      ? (props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)')
      : (props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)')};
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' 
      ? (props.theme.isDarkTheme 
        ? '0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' 
        : '0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)')
      : (props.theme.isDarkTheme 
        ? '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)' 
        : '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  padding: 0.5rem;
  background: ${props => props.theme.isDarkTheme 
    ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' 
    : 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)'};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
`;

const Tab = styled.button`
  background: ${props => props.className === 'active' 
    ? (props.theme.isDarkTheme 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)' 
      : 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.08) 100%)')
    : 'transparent'};
  border: 1px solid ${props => props.className === 'active' 
    ? (props.theme.isDarkTheme ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)')
    : 'transparent'};
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.className === 'active' 
    ? (props.theme.isDarkTheme 
      ? '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
      : '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)')
    : 'none'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.isDarkTheme 
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' 
      : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)'};
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: ${props => props.theme.isDarkTheme 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' 
      : 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)'};
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.isDarkTheme 
      ? '0 6px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' 
      : '0 6px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'};
    
    &::before {
      left: 100%;
    }
  }
  
  &.active {
    color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    font-weight: 700;
  }
`;

const ViewModal = ({ isOpen, onClose, onAdd, onUpdateView, editingView }) => {
  const { isDarkTheme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    schema_version: 'v1.0.0',
    target: '',
    type: 'plot',
    service: '',
    step: ''
    // width, height, x, y убраны из формы
  });

  const [activeTab, setActiveTab] = useState('');
  const [targetOptions, setTargetOptions] = useState([]);
  const [filterFields, setFilterFields] = useState([]);

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editingView && editingView.title !== undefined) {
      setActiveTab('General');
      setFormData({
        title: editingView.title || '',
        description: editingView.description || '',
        schema_version: editingView.schema_version || 'v1.0.0',
        target: editingView.target || '',
        type: editingView.type || 'plot',
        service: editingView.service || '',
        step: editingView.step || ''
      });
      // Загружаем targetOptions, если editingView присутствует
      if (editingView.service) {
        fetch(`https://dashboard.test.qodeq.net/api/v1/dashboard/schemas/${editingView.service}`)
          .then(response => response.json())
          .then(data => {
            const schemaVersion = Object.keys(data)[0];
            const options = Object.keys(data[schemaVersion]).map(key => ({ key, value: key }));
            setTargetOptions(options);
            const selectedTarget = options.find(option => option.value === editingView.target);
            if (selectedTarget) {
              handleInputChange('target', selectedTarget.value);
            }
          })
          .catch(error => {
            console.error('Ошибка при получении схемы:', error);
          });
      }
    } else if (isOpen) { // Сбрасываем форму только при открытии модального окна
      setFormData({
        title: '',
        description: '',
        schema_version: 'v1.0.0',
        target: '',
        type: 'plot',
        service: '',
        step: ''
      });
    }
  }, [editingView, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (value) => {
    setFormData(prev => ({ ...prev, service: value }));
    if (value) {
      fetch(`https://dashboard.test.qodeq.net/api/v1/dashboard/schemas/${value}`)
        .then(response => response.json())
        .then(data => {
          const schemaVersion = Object.keys(data)[0];
          const options = Object.keys(data[schemaVersion]).map(key => ({ key, value: key }));
          setTargetOptions(options);
          // Сохраняем текущее состояние формы
          const currentTarget = formData.target;
          const selectedTarget = options.find(option => option.value === currentTarget);
          if (selectedTarget) {
            setFormData(prev => ({ ...prev, target: selectedTarget.value }));
          } else {
            // Не сбрасывать поля, если не найдено
            setFormData(prev => ({ ...prev, target: '' }));
          }
        })
        .catch(error => {
          console.error('Ошибка при получении схемы:', error);
        });
    }
  };

  useEffect(() => {
    if (formData.service) {
      fetch(`https://dashboard.test.qodeq.net/api/v1/dashboard/schemas/${formData.service}`)
        .then(response => response.json())
        .then(data => {
          const schemaVersion = Object.keys(data)[0];
          const schema = data[schemaVersion];
          if (formData.target && schema[formData.target]) {
            const fields = Object.keys(schema[formData.target]).filter(field => schema[formData.target][field].filter !== null);
            setFilterFields(fields);
          } else {
            setFilterFields([]);
          }
        })
        .catch(error => {
          console.error('Ошибка при получении схемы:', error);
        });
    }
  }, [formData.service, formData.target]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Введите название блока');
      return;
    }
    
    const newView = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      schema_version: parseInt(formData.schema_version),
      service: formData.service.trim(),
      step: formData.step.trim()
    };
    
    if (editingView && editingView.uuid) {
      onUpdateView(editingView.uuid, newView);
    } else {
      onAdd(newView);
      // Сброс формы после добавления
      setFormData({
        title: '',
        description: '',
        schema_version: 1,
        target: '',
        type: 'plot',
        service: '',
        step: ''
      });
    }
  };

  useEffect(() => {
    if (editingView) {
      setFormData({
        title: editingView.title || '',
        description: editingView.description || '',
        schema_version: editingView.schema_version || 1,
        target: editingView.target || '',
        type: editingView.type || 'plot',
        service: editingView.service || '',
        step: editingView.step || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        schema_version: 1,
        target: '',
        type: 'plot',
        service: '',
        step: ''
      });
    }
  }, [editingView]);

  const handleClose = () => {
    // Сброс формы при закрытии
    setFormData({
      title: '',
      description: '',
      schema_version: 1,
      target: '',
      type: 'plot',
      service: '',
      step: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay theme={{ isDarkTheme }} onClick={handleClose}>
      <ModalContent theme={{ isDarkTheme }} onClick={(e) => e.stopPropagation()}>
        <ModalTitle theme={{ isDarkTheme }}>{editingView ? 'Edit block' : 'Add new block'}</ModalTitle>
        {editingView && (
          <Tabs theme={{ isDarkTheme }}>
            {['General', 'Filter', 'Transformation', 'Aggregation'].map(tab => (
              <Tab
                key={tab}
                theme={{ isDarkTheme }}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tab>
            ))}
          </Tabs>
        )}
        {(!editingView || activeTab === 'General') && (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label theme={{ isDarkTheme }}>Block title *</Label>
              <Input
                theme={{ isDarkTheme }}
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter block title"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label theme={{ isDarkTheme }}>Description</Label>
              <TextArea
                theme={{ isDarkTheme }}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter block description"
              />
            </FormGroup>

            <FormGroup>
              <Label theme={{ isDarkTheme }}>Service</Label>
              <Select
                theme={{ isDarkTheme }}
                value={formData.service}
                onChange={(e) => handleServiceChange(e.target.value)}
              >
                <option value="">Select service</option>
                <option value="chat">Chat</option>
              </Select>
              <Label theme={{ isDarkTheme }} style={{marginTop: '1rem'}}>Target</Label>
              <Select
                theme={{ isDarkTheme }}
                value={formData.target}
                onChange={(e) => handleInputChange('target', e.target.value)}
              >
                <option value="">Select target</option>
                {targetOptions.map(option => (
                  <option key={option.key} value={option.value}>{option.key}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label theme={{ isDarkTheme }}>Schema version</Label>
              <Input
                theme={{ isDarkTheme }}
                type="text"
                value={formData.schema_version}
                onChange={(e) => handleInputChange('schema_version', e.target.value)}
                placeholder="v1.0.0"
              />
            </FormGroup>

            <FormGroup>
              <Label theme={{ isDarkTheme }}>Aggregation step</Label>
              <Input
                theme={{ isDarkTheme }}
                type="text"
                value={formData.step}
                onChange={(e) => handleInputChange('step', e.target.value)}
                placeholder="1 hour"
              />
            </FormGroup>

            <ModalActions>
              <Button theme={{ isDarkTheme }} type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button theme={{ isDarkTheme }} type="submit" variant="primary">
                {editingView ? 'Save changes' : 'Add block'}
              </Button>
            </ModalActions>
          </form>
        )}
        {activeTab === 'Filter' && (
          <div style={{ color: isDarkTheme ? '#fff' : '#000', padding: '2rem', textAlign: 'left', backgroundColor: isDarkTheme ? '#000000' : '#FFFFFF', borderRadius: '8px' }}>
            {filterFields.length > 0 ? (
              filterFields.map(field => (
                <div key={field} style={{ marginBottom: '1rem' }}>
                  <Label theme={{ isDarkTheme }} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{field}</Label>
                  <Input
                    theme={{ isDarkTheme }}
                    type="text"
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: `1px solid ${isDarkTheme ? '#ccc' : '#666'}` }}
                  />
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: isDarkTheme ? '#bbb' : '#666' }}>Нет доступных полей для фильтрации</p>
            )}
          </div>
        )}
        {activeTab === 'Transformation' && (
          <div style={{ color: isDarkTheme ? '#fff' : '#000', padding: '2rem 0', textAlign: 'center' }}>Transformation settings (stub)</div>
        )}
        {activeTab === 'Aggregation' && (
          <div style={{ color: isDarkTheme ? '#fff' : '#000', padding: '2rem 0', textAlign: 'center' }}>Aggregation settings (stub)</div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ViewModal;