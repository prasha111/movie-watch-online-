import React from 'react'
import Image from 'next/image'
import { useNavigate } from 'react-router-dom';
function Box({id, src,href,  title, index}) {
  console.log(src, "nvghfg", src=="N/A", src=="undefined")
    const memo =(id)=> {
        let result = {};
        return (...args)=>{
            let value = JSON.stringify(args)
            if(result.objectOwnProperty(value)){
                return result[value];
            }
            else{
                let res = imageUrl(value);
                result[res] = res
            }
        }
    }
    const imageUrl = async (id)=>{
        try {
          const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=2cbbdc85`);
          console.log(response)
          return 
          //const data = await response.json();
         // setMovies((prevMovies) => [...prevMovies, ...data.result]);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      }
      
      const uref = (link) =>{
        console.log(href, "")
        window.location.href = link;
      }
  return (
     <div onClick={()=>{uref(href)}} key={index} >
            <div   className="border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-1 h-[fit] w-[fit]">
                  <Image priority height={150} width={200} src={(src != "N/A" && src != 'undefined')? src: "https://m.media-amazon.com/images/M/MV5BNmQ1MjAwMzQtNjhjOS00MzNmLTk5NmMtNTYxNmMyN2I5NzhiXkEyXkFqcGc@._V1_SX300.jpg"} alt='some' className='object-cover w-full h-auto'
                  /> 
              </div>
              <span className='block text-center'>
                    {title}
                  </span>
              </div>
  )
}

export default Box