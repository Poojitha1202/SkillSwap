import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize'
import Button from './chatUI/Button';
import { toast } from 'react-hot-toast'
import axios from 'axios';

export default function ChatInput({ chatId, user, chatPartner }) {
    const textareaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    //const [chatPartnerObj, setChatPartnerObj] = useState(chatPartner);
  
    const sendMessage = async () => {
      if(!input) return
      setIsLoading(true)
  
      try {
        await axios.post('/api/message/send', { text: input, chatId, user: user, chatPartner: chatPartner, token: localStorage.getItem("token") })
        setInput('')
        textareaRef.current?.focus()
      } catch(error) {
        console.log("Error occured: ", error);
        toast.error('Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false)
      }
    }

    return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-teal-400'>
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Type your message"}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className='py-2'
          aria-hidden='true'>
          <div className='py-px'>
            <div className='h-2' />
          </div>
        </div>

        <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrink-0'>
            <Button isLoading={isLoading} onClick={sendMessage} type='submit'>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
    );
}