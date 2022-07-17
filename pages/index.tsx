import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'


const Home: NextPage = () => {
  const [githubAvatar, setGitHubAvatar] = useState<null | string>(null);
  const responseDiv = useRef();
  const [name, setName] = useState<null | string>(null);
  const [followers, setFollowers] = useState<null | number>(null);
  const [following, setFollowing] = useState<null | number>(null);
  const [error, setError] = useState<null | string>(null);
  const setUser = (username: string) => {
    const URI = `https://api.github.com/users/${username}`;
    fetch(URI)
      .then(res => res.json())
      .then(data => {
        setName(data.name || data.login);
        setGitHubAvatar(data.avatar_url);
        setFollowing(data.following);
        setFollowers(data.followers);
      })
      .catch(err => {
        setError("User not found")
        console.log(err)
      }
      );
  }
  useEffect(() => {
    setUser("shubham399");
  }, [])
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    if (username) {
      setUser(username);
      e.target.elements.username.value = null;
      e.target.elements.username.placeholder = username;
    }
  }
  return (
    <>
      <div className='flex flex-wrap justify-center align-middle h-screen bg-slate-50 dark:bg-slate-800 text-black dark:text-white'>

        <form className="m-auto" onSubmit={handleSubmit}>
          <input className="bg-slate-200 dark:bg-slate-600 text-black dark:text-white p-2 m-2 rounded-md" type="text" name="username" placeholder="GitHub Username" autoComplete='false' />
          <input className="bg-slate-200 dark:bg-slate-600 text-black dark:text-white rounded-md m-2 p-2" type="submit" value="Submit" />
        </form>
        <div className='w-1/2 h-screen flex justify-center align-middle'>
          <div className='m-auto pt-10 flex-auto justify-between align-middle max-w-md rounded overflow-hidden shadow-lg bg-white mx-auto dark:bg-slate-700 text-black dark:text-white h-1/2 text-center'>
            {error && <div className='text-red-500'>{error}</div>}
            <h1 className='capitalize text-xl font-Roboto font-bold'>{name}</h1>
            <div className="group items-center rounded">
              {githubAvatar && <Image src={githubAvatar} width="100vh" alt="github" height="100vh" />}
            </div>
            {followers && <p>Followers: {followers}</p>}
            {following && <p>Followings: {following}</p>}
          </div>
        </div>
        {/* <Image src={(githubAvatar || "/doesnot")} alt="Vercel Logo" width={72} height={16} /> */}
      </div>
    </>
  )
}

export default Home
