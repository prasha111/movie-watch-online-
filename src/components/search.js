import useDebounce from '@/app/hooks/debounce'
import React, { useState } from 'react'

function Search({handle, inputSearch}) {
    const [input, setInput] = useState("")
    const some = ()=>{
        console.log("Some")
    }
    const debounce = useDebounce(some, 2000)
    
  return (
    <>
     <input
            onChange={handle}
            type="text"
            value={inputSearch}
            id="universal-search-input"
            placeholder="Find Movies &amp; TV"
            class="search-input text-white"
            className='search-input'
           
          />
          <section className=''>

          </section>
    </>
   

  )
}

export default Search;
