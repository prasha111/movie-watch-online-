"use client";
import Image from 'next/image'
import { useRef } from 'react'
import { useState } from 'react'
import React from 'react'
import { useEffect } from 'react'
import Box from '@/components/box'
import useIntersectionObserver from '@/components/infinitescroll'
import Skeleton from 'react-loading-skeleton';


function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const fetchMovies = async (page) => {
    try {
      const response = await fetch(`https://vidsrc.xyz/movies/latest/page-${page}.json`);
      const data = await response.json();
      setMovies((prevMovies) => [...prevMovies, ...data.result]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
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

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  return (
    <div className=''>
      <div className='grid gap-[10px] justify-evenly grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]'>
        {movies ? movies.map((movie, index) => (
          <Box href={movie.embed_url} id={movie.imdb_id} key={index} title={movie.title} src={movie.Poster} />
        )):
        <Skeleton width={200} height={150} />
        }
        
      </div>
      <div ref={loader} />
    </div>
  );
};

export default Home