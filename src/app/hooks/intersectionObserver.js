import { useEffect } from 'react';

function useHook(loader, setPage) {
     useEffect(() => {
        const options = {
          root: null,
          rootMargin: "20px",
          threshold: 1.0,
        };
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => prevPage + 1);
          }
        }, options);
    
        if (loader.current) {
          observer.observe(loader.current);
        }
    
        return () => {
          if (loader.current) {
            observer.unobserve(loader.current);
          }
        };
      }, []);
 
}

export default useHook