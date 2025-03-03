import { useRef } from "react";
const useDebounce  = (fn, time) =>{
    const timeoutRef = useRef(null)
    //let timer = null;
    return (...args)=>{
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(()=>{
            console.log(...args, "")
            fn(...args)
        },time)
    }
}
export default useDebounce