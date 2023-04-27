import React, { KeyboardEvent, ChangeEvent, useState } from 'react';

const onlyLatinRegex = /^[A-Za-z][A-Za-z0-9]*$/;
const maxLengthReg = (max: number) => new RegExp(`\\b.{1,${max}}\\b`, 'g');

const validateText = (text: string) => {
  const textArr = text.split(' ');
  let validated = false;

  textArr.map((i, index) => {
    if (onlyLatinRegex.test(i)) {
      if (index === textArr.length - 1) {
        validated = true;
      }
    }
  });

  return validated;
};

function App() {
  const [inputVal, setInputVal] = useState('');
  const [maxLength, setMaxLength] = useState(140);
  const [messages, setMessages] = useState<string[]>([]);
  const [validated, setValidated] = useState(true);

  const handleChangeInputVal = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleChangeMaxLength = (e: ChangeEvent<HTMLInputElement>) => {
    if (!parseInt(e.target.value)) {
      setMaxLength(0);
    } else {
      setMaxLength(parseInt(e.target.value));
    }
  };

  const onEnterText = () => {
    const cutText = inputVal.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    let newMessages: string[] = [];

    if (validateText(cutText)) {
      const cutTextByNum = cutText.match(/\b.{1,140}\b/g);
      newMessages = cutTextByNum?.map((m: string) => m.trimEnd().replace('  ', ' ')) || [];

      newMessages = cutText.match(maxLengthReg(maxLength - 2 - `${newMessages?.length}`.length * 2)) || [];
      if (newMessages?.length > 1) {
        newMessages = newMessages?.map((m: string, index: number) => `${m} ${index + 1}/${newMessages.length}`);
      } else {
        newMessages = newMessages?.map((m: string) => m);
      }

      setMessages(newMessages);
      setValidated(true);
    } else {
      setValidated(false);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnterText();
    }
  };

  return (
    <div className='app'>
      <div className='messages'>
        {messages.map((m: any, index: any) => (
          <div
            key={index}
            className='message'
          >
            {m}
          </div>
        ))}
      </div>
      {!validated && 'Plese, input only latin letters!!!'}
      <div className='input__wrapper'>
        <input
          onChange={handleChangeMaxLength}
          type='number'
          value={maxLength}
          className='input'
        />
        <input
          onChange={handleChangeInputVal}
          onKeyDown={handleInputKeyDown}
          value={inputVal}
          placeholder='Input text....'
          className='input'
        />
        <button
          onClick={onEnterText}
          className='buttton'
        >
          Enter
        </button>
      </div>
    </div>
  );
}

export default App;
