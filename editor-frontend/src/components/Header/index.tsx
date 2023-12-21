import axios from 'axios';
import {
  IconDirectionalArrow,
  IconProductLogo,
  IconEdit,
  IconCopy,
  IconDownload,
  IconTrash,
} from "../../assets/icons";
import Button from "../Button";
import IconButton from "../IconButton";
import Divider from "../Divider";
import "./header.css";
import { useEffect } from "react";
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DeletePopup from './DeletePopup';
import { Events, sendStats } from '../../stats';

type HeaderProps = {
  setShowLoginPopup: Function,
  loggedIn: boolean,
  setLoggedIn: Function,
  videoInfo: any,
  title: string,
  setTitle: Function,
  userData: any,
  setUserData: Function,
};

const Header = ({ setShowLoginPopup, loggedIn, setLoggedIn, videoInfo, title, setTitle, userData, setUserData }: HeaderProps) => {
  const [allowTitleEdit, setAllowTitleEdit] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const fetchUserDetails = async () => {
    await axios
      .get(`${import.meta.env.VITE_ACCOUNTS_BASE}/accounts/users/v1/userinfo`, {
        headers: {
          authorization: ` Bearer ${localStorage['ng_token']}`,
        },
      })
      .then(function (res: any) {
        if (res && res.status == 401 && res.success == false) {
          // signup not possible
        }

        if (res && res.status === 200) {
          setUserData(res?.data?.userData);
          setLoggedIn(true);
          sessionStorage.setItem('userType', 'Authorised');
          const searchParams = new URLSearchParams(location.search);
          const videoId = searchParams.get('videoId') ?? '';
          sendStats(Events.EDIT_PAGE_IMPRESSION, videoId, res?.data?.userData);
        }
      })
      .catch((err: any) => {
        const ng_token = localStorage['ng_token'];
        const ng_token_expiry = localStorage['ng_token_expiry'];
        const isTokenExpired = new Date(ng_token_expiry) < new Date();
        if (!ng_token || isTokenExpired) {
          generateFEToken();
        }
        console.log('err', err);
        // console.log('signup not possible -- error 401');
      });
  };

  const generateFEToken = async (guest_refresh_token?: string) => {
    axios
      .get(`${import.meta.env.VITE_ACCOUNTS_BASE}/accounts/auth/v1/access-token`, {
        withCredentials: true,
      })
      .then((res: { status: number; data: { token: string; token_expiry: string; }; }) => {
        if (res && res.status == 200) {
          localStorage.setItem('ng_token', res.data.token);
          localStorage.setItem('ng_token_expiry', res.data.token_expiry);
          if(guest_refresh_token)
            localStorage.setItem('guest_refresh_token', guest_refresh_token);
          fetchUserDetails();
        }
      })
      .catch((err: any) => {
        const searchParams = new URLSearchParams(location.search);
        const videoId = searchParams.get('videoId') ?? '';
        sendStats(Events.EDIT_PAGE_IMPRESSION, videoId, userData);
        if(err?.response?.status === 401)
          setShowLoginPopup(true);
        console.log('err', err?.response?.status);
      });
  };

  const logout = async () => {
    console.log('logout old user');
    const res = await axios.get(`${import.meta.env.VITE_ACCOUNTS_BASE}/accounts/auth/v1/logout`, {
      withCredentials: true,
    });
    console.log('logout res', res);
  }

  const loginGuestUser = async (guest_refresh_token: string) => {
    if(localStorage.getItem('ng_token') && localStorage.getItem('guest_refresh_token') !== guest_refresh_token)
      await logout();
    const today = new Date();
    const expiryDate = new Date(today.setFullYear(today.getFullYear() + 1));
    console.log(`set refresh token in cookie ${guest_refresh_token}`)
    document.cookie = `_NSID=${guest_refresh_token}; expires=${expiryDate.toUTCString()}; path=/; samesite=None; secure`;
    document.cookie = `_NSID=${guest_refresh_token}; expires=${expiryDate.toUTCString()}; path=/accounts/; samesite=None; secure`;
    console.log("cookie",  document.cookie)
    console.log("login guest user")
    generateFEToken(guest_refresh_token);
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.get('refresh_token')) {
      const refresh_token = searchParams.get('refresh_token') || '';
      loginGuestUser(refresh_token);
      searchParams.delete('refresh_token');
      window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
      return;
    }
    const ng_token = localStorage['ng_token'];
    const ng_token_expiry = localStorage['ng_token_expiry'];
    const isTokenExpired = new Date(ng_token_expiry) < new Date();
    if (!ng_token || isTokenExpired) {
      generateFEToken();
      return;
    }
    fetchUserDetails();
  }, [])

  const editTitle = () => {
    if(!allowTitleEdit) {
      setAllowTitleEdit(true);
      return;
    }
    setAllowTitleEdit(false);

  }

  const copyLink = () => {
    sendStats(Events.COPY_LINK_CLICK, videoInfo?.videoId, userData)
    toast.success('Video link copied to clipboard');
    navigator.clipboard.writeText(`https://stagingngg.net/videos/watch/${videoInfo?.videoId}`);
  }

  const getDownloadUrl = (filename: string) => {
    if(videoInfo?.downloadUrl)
      return `${videoInfo?.downloadUrl}?filename=${filename}`;
    if(videoInfo?.cflVideoId)
      return `https://customer-0ae3bmzhlvu9twn2.cloudflarestream.com/${videoInfo.cflVideoId}/downloads/default.mp4?filename=${filename}`;
    return '';
  }

  const download = () => {
    sendStats(Events.VIDEO_DOWNLOAD, videoInfo?.videoId, userData)
    const filename = videoInfo?.title?.replace(/\s/g, '_');
    const downloadUrl = getDownloadUrl(filename);
    if(!downloadUrl)
      return;
    window.open(downloadUrl, '_blank');
  }

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
  }

  const deleteVideo = () => {
    fetch(`${import.meta.env.VITE_BACKEND_HOST}/video/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage['ng_token']
      },
      body: JSON.stringify({
        userId: userData?.userId,
        videoId: videoInfo?.videoId
      })
    })
    .then(res => res.json())
    .then(res => {
      if(res?.status === "success") {
        setShowDeletePopup(false);
        toast.success(res?.message);
        setTimeout(() => {
          window.location.href = `${import.meta.env.VITE_VIDEO_BASE}/videos/${videoInfo?.channelHandle}`;
        }, 2000);
      }
      else {
        toast.error(res?.message);
      }
    })
    .catch(err => {
      console.error(err);
      toast.error('Unable to delete video');
    })
  }

  const handleBackClick = () => {
    window.location.href = `${import.meta.env.VITE_VIDEO_BASE}/videos/watch/${videoInfo?.videoId}`;
  }


  return (
    <header className="font-poppins bg-white">
      <div className="py-2 px-4 w-full flex justify-between header-container">
        <div className="flex items-center gap-x-3">
          <div className="cursor-pointer" onClick={handleBackClick}>
            <IconDirectionalArrow />
          </div>
          <div>
            <IconProductLogo />
          </div>

          <Divider />
          {allowTitleEdit ? <input 
            className='text-xl font-semibold text-base-900 h-9 px-1 bg-gray-100 rounded-md outline-none w-[25ch]' 
            value={title} 
            onChange={(e) => {setTitle(e.target.value)}} 
            autoFocus={true}
          /> : <h3 className="text-xl font-semibold text-base-900 px-1 w-[25ch] truncate overflow-hidden text-clip">{title}</h3> 
          
          }
          <div>
            <IconButton type="primary" onClick={() => { editTitle() }}>
              <IconEdit className="group-hover:fill-white" />
            </IconButton>
          </div>
        </div>
        <div className="flex items-center py-2.5 pl-2.5 gap-x-6">
          {!loggedIn &&
            <div className="text-black font-normal text-sm flex" >
              <p>Connect with your account</p>
              <a className="text-additional-link" onClick={() => setShowLoginPopup(true)}>
                sign up
              </a>
              <p>or</p>
              <a className="text-additional-link" onClick={() => setShowLoginPopup(true)}>
                log in
              </a>
            </div>
          }
          {
            loggedIn &&
            <div className="profile-details flex">
              <figure className="profile-img">
                <img src={userData?.profilePicture || userData?.avatar} height="36" width="36" />
              </figure>
              <p className="profile-name">{userData?.name}</p>
            </div>
          }

          <Button type="secondary" className="flex items-center gap-x-2.5" onClick={copyLink}>
            <IconCopy className="group-hover:stroke-white" />
            Copy Link
          </Button>
          <IconButton type="secondary" color="link" onClick={download}>
            <IconDownload />
          </IconButton>
          <Divider />
          <IconButton type="secondary" color="warning" onClick={() => setShowDeletePopup(true)}>
            <IconTrash />
          </IconButton>
        </div>
      </div>
      {showDeletePopup && <DeletePopup closePopup={closeDeletePopup} deleteVideo={deleteVideo} />}
    </header>
  );
};

export default Header;
