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
import { useState, useEffect } from "react";

type HeaderProps = {
  setOpen: Function,
  loggedIn: boolean,
  setLoggedIn: Function,
  title: string
  setTitle: Function,
};

const Header = ({ setOpen, loggedIn, setLoggedIn, title, setTitle }: HeaderProps) => {
  const [profileIcon, setProfileIcon] = useState('');
  const [userName, setUserName] = useState('');
  const [canEditTitle, setCanEditTitle] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(false);
  const fetchUserDetails = async () => {
    await axios
      .get(`https://stagingngg.net/accounts/users/v1/userinfo`, {
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
          setProfileIcon(res?.data?.userData?.profilePicture);
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
      .get(`https://stagingngg.net/accounts/auth/v1/access-token`, {
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

  const editTitle = (e: any) => {
    setTitle(e.target.value);
  }

  const toggleEditing = () => {
    if(!canEditTitle) {
      setCanEditTitle(true);
      return;
    }
    setCanEditTitle(false);
  }
  

  const deleteVideo = () => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const videoId = urlParams.get('videoId');
    fetch("https://api-moments.testngg.net/video/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("ng_token") || "",
      },
      body: JSON.stringify({
        videoId: videoId,
      }),
    })
    .then((res) => {
      if (res.status == 200) {
        console.log("Video Deleted");
        window.location.href = "https://moments.stagingngg.net";
      }
    })
    .catch((err) => {
      console.error("Error while deleting video", err);
    });
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

          <input disabled={!canEditTitle} className={`text-base-900 text-xl font-semibold video-title bg-transparent px-1 border-2 ${canEditTitle ? "border-pink-200" : "border-transparent"}`} value={title} onChange={editTitle}></input>
          <div>
            <IconButton type="primary" onClick={toggleEditing}>
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

          <Button type="secondary">
            <div className="flex items-center gap-x-2.5">
              <IconCopy className="group-hover:stroke-white" />
              Copy Link
            </div>
          </Button>
          <IconButton type="secondary" color="link">
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
