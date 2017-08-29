import React from 'react'

const messageStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  'justify-content': 'center',
  'align-self': 'flex-end',
  width: '100%',
  height: '5em',
  position: 'fixed',
  bottom: 0,
  left: 0,
}

const MessagePanel = props => {

  return(

    <div style={messageStyle}>
      <h1>{props.message}</h1>
    </div>
  )
}



export default MessagePanel
