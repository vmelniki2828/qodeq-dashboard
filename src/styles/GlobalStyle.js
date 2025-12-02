import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
    transition: background-color 0.3s ease;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
    color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    min-height: 100vh;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  #root {
    min-height: 100vh;
    background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
    transition: background-color 0.3s ease;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    transition: color 0.2s;
  }
  a:hover {
    color: ${props => props.theme.isDarkTheme ? '#CCCCCC' : '#666666'};
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  ::selection {
    background: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    color: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  }

  ::-webkit-scrollbar {
    width: 8px;
    background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.isDarkTheme ? '#FFFFFF' : '#000000'};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.isDarkTheme ? '#000000' : '#FFFFFF'};
  }
`; 