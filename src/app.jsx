import React from 'react'
import '../public/globals.css'
import { FlexCol } from './utils.jsx'
import ChatInterface from './components/ChatInterface'

export var App = () => {
  return (
    <FlexCol
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
      }}
    >
      <FlexCol
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '100%',
          margin: '0 auto',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}
      >
        <header style={{ 
          padding: '20px', 
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <img
            src='https://github.com/concrete-utopia/utopia/blob/master/editor/resources/editor/pyramid_fullsize@2x.png?raw=true'
            alt='Utopia logo'
            style={{
              width: 40,
              height: 51,
            }}
          />
          <h1 style={{ margin: 0, fontSize: '24px' }}>Utopia React App Generator</h1>
        </header>
        <ChatInterface />
      </FlexCol>
    </FlexCol>
  )
}
