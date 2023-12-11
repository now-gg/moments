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
};

const Header = ({ setShowLoginPopup, loggedIn, setLoggedIn, videoInfo, title, setTitle }: HeaderProps) => {
  const [profileIcon, setProfileIcon] = useState('');
  const [userName, setUserName] = useState('');
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
          setUserName(res?.data?.userData?.name);
          setProfileIcon(res?.data?.userData?.profilePicture || res?.data?.userData?.avatar);
          setLoggedIn(true);
          sessionStorage.setItem('userType', 'Authorised');
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

  const generateFEToken = async () => {
    axios
      .get(`${import.meta.env.VITE_ACCOUNTS_BASE}/accounts/auth/v1/access-token`, {
        withCredentials: true,
      })
      .then((res: { status: number; data: { token: string; token_expiry: string; }; }) => {
        if (res && res.status == 200) {
          localStorage.setItem('ng_token', res.data.token);
          localStorage.setItem('ng_token_expiry', res.data.token_expiry);
          // console.log('200 code');
          fetchUserDetails();
        }
      })
      .catch((err: any) => {
        if(err?.response?.status === 401)
          setShowLoginPopup(true);
        console.log('err', err?.response?.status);
      });
  };

  useEffect(() => {
    const ng_token = localStorage['ng_token'];
    const ng_token_expiry = localStorage['ng_token_expiry'];
    const isTokenExpired = new Date(ng_token_expiry) < new Date();
    if (!ng_token || isTokenExpired) {
      generateFEToken();
      // console.log('Token not Found');
    } else {
      fetchUserDetails();
    }
  }, [])

  const editTitle = () => {
    if(!allowTitleEdit) {
      setAllowTitleEdit(true);
      return;
    }
    setAllowTitleEdit(false);

  }

  const copyLink = () => {
    sendStats(Events.COPY_LINK_CLICK, { "arg1": videoInfo?.videoId})
    toast.success('Video link copied to clipboard');
    navigator.clipboard.writeText(`https://stagingngg.net/videos/watch/${videoInfo?.videoId}`);
  }

  const download = () => {
    sendStats(Events.VIDEO_DOWNLOAD, { "arg1": videoInfo?.videoId})
    window.open(videoInfo?.downloadUrl, '_blank');
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
      toast.error('Could not delete video');
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

          <input 
            disabled={!allowTitleEdit} 
            className='text-xl font-semibold text-base-900 bg-gray-100 h-9 px-1 rounded-md disabled:bg-transparent outline-none' 
            value={title} 
            onChange={(e) => {setTitle(e.target.value)}} 
            onBlur={() => setAllowTitleEdit(false)}
          />
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
                <img src={profileIcon} height="36" width="36" />
              </figure>
              <p className="profile-name">{userName}</p>
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
