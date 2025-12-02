import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../contexts/SidebarContext';
import { useMenu } from '../contexts/MenuContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = styled(motion.nav)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.isCollapsed ? '80px' : '280px'};
  background: transparent;
  border-right: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  padding: 1.5rem 0;
  z-index: 1000;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
`;

const Logo = styled(motion.div)`
  font-size: 1.75rem;
  font-weight: 800;
  white-space: nowrap;
  letter-spacing: -0.02em;
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  transition: color 0.4s ease;
  text-shadow: none;
  cursor: pointer;
`;

const CollapseButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.theme.isDarkTheme ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)' : 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
    transform: scale(1.05);
  }
`;

const HamburgerIcon = styled.div`
  width: 18px;
  height: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HamburgerLine = styled(motion.div)`
  width: 100%;
  height: 2px;
  background: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  border-radius: 1px;
  transform-origin: center;
`;

const MenuContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: ${props => props.isCollapsed ? '0 0.75rem' : '0 1rem'};
  flex: 1;
  align-items: ${props => props.isCollapsed ? 'center' : 'stretch'};
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: ${props => props.isCollapsed ? '1rem' : '0.75rem 1rem'};
  border-radius: ${props => props.isCollapsed ? '8px' : '12px'};
  color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  width: ${props => props.isCollapsed ? '48px' : 'auto'};
  height: ${props => props.isCollapsed ? '48px' : 'auto'};
  min-width: ${props => props.isCollapsed ? '48px' : 'auto'};
  min-height: ${props => props.isCollapsed ? '48px' : 'auto'};
  background: ${props => {
    if (props.isActive) {
      return props.isCollapsed 
        ? (props.theme.isDarkTheme 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)' 
          : 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%)')
        : (props.theme.isDarkTheme ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)');
    }
    return props.isCollapsed 
      ? (props.theme.isDarkTheme 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)' 
        : 'linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 100%)')
      : 'transparent';
  }};
  border: ${props => props.isCollapsed ? '1px solid' : '1px solid'} ${props => {
    if (props.isActive) {
      return props.theme.isDarkTheme ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    }
    return props.isCollapsed 
      ? (props.theme.isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
      : 'transparent';
  }};
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  cursor: pointer;
  box-shadow: ${props => props.isCollapsed 
    ? (props.theme.isDarkTheme 
      ? '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
      : '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)')
    : 'none'};
  
  &:hover {
    background: ${props => {
      if (props.isCollapsed) {
        return props.theme.isDarkTheme 
          ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
          : 'linear-gradient(135deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 100%)';
      }
      return props.theme.isDarkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    }};
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
    color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
    transform: ${props => props.isCollapsed ? 'scale(1.05)' : 'translateX(4px)'};
    box-shadow: ${props => props.isCollapsed 
      ? (props.theme.isDarkTheme 
        ? '0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
        : '0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7)')
      : 'none'};
  }
`;


const MenuText = styled(motion.span)`
  white-space: nowrap;
  font-weight: ${props => props.isActive ? '600' : '500'};
  color: ${props => props.isActive 
    ? (props.theme.isDarkTheme ? '#fff' : '#000')
    : (props.theme.isDarkTheme ? '#fff' : '#000')};
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  left: 70px;
  background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1001;
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  box-shadow: ${props => props.theme.isDarkTheme ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.2)'};
`;

const UserBlock = styled(motion.div)`
  padding: ${props => props.isCollapsed ? '0.75rem 0.75rem' : '0.75rem 1.5rem'};
  margin-top: auto;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: ${props => props.isCollapsed ? 'column' : 'row'};
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  align-items: center;
  gap: ${props => props.isCollapsed ? '0.5rem' : '0'};
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.isCollapsed ? '0' : '0.5rem'};
  padding: ${props => props.isCollapsed ? '0.375rem' : '0.5rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};

  &:hover {
    opacity: 0.8;
  }
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.isDarkTheme ? '#000' : '#fff'};
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
  position: relative;
`;

const UserInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserStatus = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserTooltip = styled(motion.div)`
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1001;
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  box-shadow: ${props => props.theme.isDarkTheme ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.2)'};
`;

const ThemeToggleButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border: 1px solid ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  color: ${props => props.theme.isDarkTheme ? '#fff' : '#000'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-color: ${props => props.theme.isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const UserControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const textVariants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -20 }
};

const tooltipVariants = {
  initial: { opacity: 0, x: -10, scale: 0.8 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -10, scale: 0.8 }
};

const hamburgerVariants = {
  open: {
    top: { rotate: 45, y: 6 },
    middle: { opacity: 0 },
    bottom: { rotate: -45, y: -6 }
  },
  closed: {
    top: { rotate: 0, y: 0 },
    middle: { opacity: 1 },
    bottom: { rotate: 0, y: 0 }
  }
};


export const Navigation = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { isDarkTheme, toggleTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем меню из контекста
  const { menu: services, loading, error } = useMenu();

  const handleLogoClick = () => {
    if (services.length > 0) {
      navigate(`/${services[0].uuid}`);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/${serviceId}`);
  };

  if (loading) {
    return <div>Загрузка меню...</div>;
  }
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <Sidebar isCollapsed={isCollapsed} theme={{ isDarkTheme }}>
      <Header>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
            >
              <Logo theme={{ isDarkTheme }} onClick={handleLogoClick}>
                Qodeq
              </Logo>
            </motion.div>
          )}
        </AnimatePresence>
        <CollapseButton 
          theme={{ isDarkTheme }}
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <HamburgerIcon theme={{ isDarkTheme }}>
            <HamburgerLine
              theme={{ isDarkTheme }}
              variants={hamburgerVariants.open.top}
              animate={isCollapsed ? "closed" : "open"}
              transition={{ duration: 0.3 }}
            />
            <HamburgerLine
              theme={{ isDarkTheme }}
              variants={hamburgerVariants.open.middle}
              animate={isCollapsed ? "closed" : "open"}
              transition={{ duration: 0.3 }}
            />
            <HamburgerLine
              theme={{ isDarkTheme }}
              variants={hamburgerVariants.open.bottom}
              animate={isCollapsed ? "closed" : "open"}
              transition={{ duration: 0.3 }}
            />
          </HamburgerIcon>
        </CollapseButton>
      </Header>

      <MenuContainer>
        <MenuList isCollapsed={isCollapsed}>
          {services.map((service) => {
            const isActive = location.pathname === `/${service.uuid}`;
            return (
              <MenuItem
                key={service.uuid}
                theme={{ isDarkTheme }}
                isActive={isActive}
                isCollapsed={isCollapsed}
                onClick={() => handleServiceClick(service.uuid)}
                onMouseEnter={() => setHoveredItem(service.uuid)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <AnimatePresence>
                  {!isCollapsed && (
                    <MenuText
                      theme={{ isDarkTheme }}
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.2 }}
                      isActive={isActive}
                    >
                      {service.title}
                      <div style={{ fontSize: '0.75rem', color: isDarkTheme ? '#aaa' : '#666' }}>{service.description}</div>
                    </MenuText>
                  )}
                </AnimatePresence>
                {/* Показываем первую букву когда меню свернуто */}
                {isCollapsed && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.6rem',
                    fontWeight: '700',
                    color: isActive 
                      ? (isDarkTheme ? '#FFFFFF' : '#000000') 
                      : (isDarkTheme ? '#FFFFFF' : '#000000'),
                    textAlign: 'center',
                    width: '100%',
                    textShadow: isDarkTheme 
                      ? '0 2px 4px rgba(0,0,0,0.5)' 
                      : '0 2px 4px rgba(255,255,255,0.5)',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s ease'
                  }}>
                    {service.title.charAt(0).toUpperCase()}
                  </div>
                )}
                <AnimatePresence>
                  {isCollapsed && hoveredItem === service.uuid && (
                    <Tooltip
                      theme={{ isDarkTheme }}
                      variants={tooltipVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      {service.title}
                    </Tooltip>
                  )}
                </AnimatePresence>
              </MenuItem>
            );
          })}
        </MenuList>
      </MenuContainer>

      <UserBlock theme={{ isDarkTheme }} isCollapsed={isCollapsed}>
        <UserContainer 
          theme={{ isDarkTheme }}
          isCollapsed={isCollapsed}
          onMouseEnter={() => setHoveredUser(true)}
          onMouseLeave={() => setHoveredUser(false)}
        >
          <UserAvatar theme={{ isDarkTheme }}>
            V
          </UserAvatar>
          {!isCollapsed && (
            <UserInfo theme={{ isDarkTheme }}>
              <UserName theme={{ isDarkTheme }}>Vlad Melnik</UserName>
              <UserStatus theme={{ isDarkTheme }}>My Workspace</UserStatus>
            </UserInfo>
          )}
          <AnimatePresence>
            {isCollapsed && hoveredUser && (
              <UserTooltip
                theme={{ isDarkTheme }}
                variants={tooltipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div style={{ fontWeight: 600 }}>Vlad Melnik</div>
                <div style={{ fontSize: '0.75rem', color: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', marginTop: '0.25rem' }}>My Workspace</div>
              </UserTooltip>
            )}
          </AnimatePresence>
        </UserContainer>
        
        <UserControls>
          <ThemeToggleButton
            theme={{ isDarkTheme }}
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            title={isDarkTheme ? "Переключить на светлую тему" : "Переключить на темную тему"}
          >
            {isDarkTheme ? (
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', stroke: '#FFFFFF', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2"/>
                <path d="M12 21v2"/>
                <path d="M4.22 4.22l1.42 1.42"/>
                <path d="M18.36 18.36l1.42 1.42"/>
                <path d="M1 12h2"/>
                <path d="M21 12h2"/>
                <path d="M4.22 19.78l1.42-1.42"/>
                <path d="M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', stroke: '#000000', fill: 'none', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </ThemeToggleButton>
        </UserControls>
      </UserBlock>
    </Sidebar>
  );
}; 