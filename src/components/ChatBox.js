import React from 'react';

export const ChatBox = ({userName, text, onTextChange, onButtonClick}) => (
  <div>
    <input
      name='userName'
      placeholder="username"
      value={userName}
      onChange={onTextChange}
    />
   <textarea
      name='text'
      placeholder="comment"
      value={text}
     onChange={onTextChange}
    />
    <button onClick={onButtonClick}>Comment</button>
  </div>
)