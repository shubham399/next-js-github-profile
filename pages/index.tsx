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
  const [repos, setRepos] = useState([]);
  const fetchRepos = (username: string) => {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(res => res.json())
      .then(data => {
        data = data.filter((repo: any) => repo.fork === false && repo.archived === false)
          //@ts-ignore
          .sort((a: any, b: any) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .map((repo: any) => repo.name).slice(0, 5);

        console.log(data)
        setRepos(data);
      })
      .catch(err => {
        setError("No Repo found")
        console.log(err);
      });
  }
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
      });
    fetchRepos(username);
  }
  useEffect(() => {
    setUser('shubham399');
  }, [])
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const userName = e.target.elements.username.value;
    if (userName) {
      setUser(userName);
      e.target.elements.username.value = null;
      e.target.elements.username.placeholder = userName;
    }
  }
  return (
    <>
      <div className='flex flex-wrap justify-center align-middle h-full w-full bg-slate-50 dark:bg-slate-800 text-black dark:text-white'>

        <form className="m-auto" onSubmit={handleSubmit}>
          <input className="bg-slate-200 dark:bg-slate-600 text-black dark:text-white p-2 m-2 rounded-md" type="text" name="username" placeholder="GitHub Username" autoComplete='false' />
          <input className="bg-slate-200 dark:bg-slate-600 text-black dark:text-white rounded-md m-2 p-2" type="submit" value="Submit" />
        </form>
        <div className='w-1/2 h-screen flex justify-center align-middle'>
          <div className='m-auto p-2 flex-auto justify-between align-middle max-w-auto rounded overflow-hidden shadow-lg bg-white mx-auto dark:bg-slate-700 text-black dark:text-white h-1/2 text-center'>
            {error && <div className='text-red-500'>{error}</div>}
            <h1 className='capitalize text-4xl font-Lato font-bold'>{name}</h1>
            <div className="group items-center rounded">
              {githubAvatar && <Image src={githubAvatar} width="100vh" alt="github" height="100vh" />}
            </div>
            {followers && <p className='text-grey-700 dark:text-slate-200 text-sm'>Followers: {followers}</p>}
            {following && <p className='text-grey-700 dark:text-slate-200 text-sm'>Followings: {following}</p>}
            <div className="justify-center my-10 mx-auto overflow-hidden select-none flex flex-wrap">
              {repos.map((repo: string, index: number) => {
                return (<button key={index} className="shadow-md no-underline rounded-full font-semibold text-sm mr-2">{repo}</button>)
              })}
            </div>
          </div>
        </div>

        {/* <Image src={(githubAvatar || "/doesnot")} alt="Vercel Logo" width={72} height={16} /> */}
      </div>
    </>
  )
}

export default Home
