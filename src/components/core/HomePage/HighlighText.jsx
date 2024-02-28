import React from 'react'

const HighlighText = ({text}) => {
  return (//apply gradient here in txt
    <span className='font-bold bg-gradient-to-r from-[#1FA2FF] from-100% via-[#12D8FA] via-100% to-[#A6FFCB] to-100% bg-clip-text text-transparent'>
        {' '}
        {text}
        {' '}
    </span>
  )
}

export default HighlighText