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

type HeaderProps = {
  setOpen: Function,
  loggedIn: boolean,
  setLoggedIn: Function,
  videoInfo: any,
  title: string,
  setTitle: Function,
};

const Header = ({ setOpen, loggedIn, setLoggedIn, videoInfo, title, setTitle }: HeaderProps) => {
  const [profileIcon, setProfileIcon] = useState('');
  const [userName, setUserName] = useState('');
  const [allowTitleEdit, setAllowTitleEdit] = useState(false);

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
          // localStorage.setItem('ng_token', res.token);
          console.log('res', res);
          setUserName(res?.data?.userData?.name);
          setProfileIcon(res?.data?.userData?.profilePicture ?? res?.data?.userData?.avatar);
          setLoggedIn(true);
          sessionStorage.setItem('userType', 'Authorised');
        }
      })
      .catch((err: any) => {
        if (!localStorage['ng_token']) {
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
      .then((res: { status: number; data: { token: string; }; }) => {
        if (res && res.status == 200) {
          localStorage.setItem('ng_token', res.data.token);
          // console.log('200 code');
          fetchUserDetails();
        }
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    let signup_token = localStorage['ng_token'];
    if (!signup_token) {
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
    navigator.clipboard.writeText(`https://stagingngg.net/videos/watch/${videoInfo?.videoId}`);
  }

  const download = () => {
    window.open(videoInfo?.downloadUrl, '_blank');
  }

  const deleteVideo = () => {
    // const confirmed = prompt('Are you sure you want to delete this video?') === 'yes';
    // if(!confirmed) return;
    // fetch(`${import.meta.env.VITE_VIDEO_PROCESS}/video/delete`, {
    // }
  }


  return (
    <header className="font-poppins bg-white">
      <div className="py-2 px-4 w-full flex justify-between header-container">
        <div className="flex items-center gap-x-3">
          <div className="cursor-pointer">
            <IconDirectionalArrow />
          </div>
          <div>
            <IconProductLogo />
          </div>

          <Divider />

          <input 
            disabled={!allowTitleEdit} 
            className='text-xl font-semibold text-base-900 bg-gray-100 px-1 rounded-md disabled:bg-transparent outline-none' 
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
              <a className="text-additional-link" href="https://vitejs.dev/">
                sign up
              </a>
              <p>or</p>
              <a className="text-additional-link" onClick={() => setOpen(true)}>
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
          <IconButton type="secondary" color="warning" onClick={deleteVideo}>
            <IconTrash />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
