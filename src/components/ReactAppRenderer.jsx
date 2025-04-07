import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { FlexCol } from '../utils.jsx';
import * as Babel from '@babel/standalone';

// This component will extract, transpile and render React code from the LLM response
const ReactAppRenderer = ({ code }) => {
  const [renderedApp, setRenderedApp] = useState(null);
  const [error, setError] = useState(null);
  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    try {
      // Extract code from markdown code blocks
      const codeMatch = code.match(/```(?:jsx|js|javascript)?\s*([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        setCodeString(codeMatch[1].trim());
      } else {
        // If no code block is found, assume the entire content is code
        setCodeString(code.trim());
      }
    } catch (err) {
      setError(`Error parsing code: ${err.message}`);
    }
  }, [code]);

  useEffect(() => {
    if (!codeString) return;
    
    try {
      // Remove any import statements as we'll handle them
      const codeWithoutImports = codeString.replace(/import.*?;?\n/g, '');
      
      // First transpile just the component code
      const transpiledComponent = Babel.transform(codeWithoutImports, {
        presets: ['react'],
        filename: 'component.jsx'
      }).code;
      
      // Instead of trying to expose hooks globally, we'll inject them directly into the function scope
      const functionWithHooks = `
        // Direct injection of React hooks into function scope
        const { 
          useState, useEffect, useRef, useCallback, useMemo, 
          useContext, useReducer, useLayoutEffect 
        } = React;
        
        ${transpiledComponent}
        
        // Return the component function
        if (typeof TodoList !== 'undefined') return TodoList;
        if (typeof MiniApp !== 'undefined') return MiniApp;
        if (typeof App !== 'undefined') return App;
        
        // Look for any name that might be a component
        for (const key in this) {
          if (typeof this[key] === 'function' && /^[A-Z]/.test(key) || key === 'TodoList') {
            return this[key];
          }
        }
        
        return null;
      `;
        
      // Execute the code in a controlled context with React passed as an argument
      // eslint-disable-next-line no-new-func
      const evalFunction = new Function('React', functionWithHooks);
      const ComponentToRender = evalFunction(React);
      
      if (ComponentToRender && typeof ComponentToRender === 'function') {
        try {
          // Create the element with proper React context
          setRenderedApp(React.createElement(ComponentToRender));
          setError(null);
        } catch (renderError) {
          console.error('Error rendering component:', renderError);
          setError(`Error rendering component: ${renderError.message}`);
        }
      } else {
        setError('Could not find a valid React component in the generated code.');
      }
    } catch (err) {
      console.error('Error processing React component:', err);
      setError(`Error processing component: ${err.message}`);
    }
  }, [codeString]);

  if (error) {
    return (
      <FlexCol style={{ padding: '10px', border: '1px solid #ff6b6b', borderRadius: '8px', backgroundColor: '#fff0f0' }}>
        <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>Error:</div>
        <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', margin: '5px 0' }}>{error}</pre>
        <details>
          <summary style={{ cursor: 'pointer', color: '#666' }}>View Code</summary>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            overflowX: 'auto', 
            margin: '10px 0', 
            padding: '10px', 
            backgroundColor: '#f8f8f8', 
            borderRadius: '4px',
            fontSize: '14px' 
          }}>
            {codeString}
          </pre>
        </details>
      </FlexCol>
    );
  }

  return (
    <FlexCol style={{ width: '100%' }}>
      <div className="mini-app-container">
        {renderedApp}
      </div>
      <details style={{ marginTop: '10px' }}>
        <summary style={{ cursor: 'pointer', color: '#666', fontSize: '14px' }}>View Code</summary>
        <pre style={{ 
          whiteSpace: 'pre-wrap', 
          overflowX: 'auto', 
          margin: '10px 0', 
          padding: '10px', 
          backgroundColor: '#f8f8f8', 
          borderRadius: '4px',
          fontSize: '14px',
          maxHeight: '300px'
        }}>
          {codeString}
        </pre>
      </details>
    </FlexCol>
  );
};

export default ReactAppRenderer; 