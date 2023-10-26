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

type HeaderProps = {
  title?: string;
  setOpen: Function
};

const Header = ({ title = "Moments202305051403", setOpen }: HeaderProps) => {

  const fetchUserDetails = async () => {
    await axios
      .get(`${location.origin}/accounts/users/v1/userinfo`, {
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
      .get(`${location.origin}/accounts/auth/v1/access-token`, {
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
    if (document.querySelector('.video-title')?.getAttribute('contenteditable')) {
      document.querySelector('.video-title')?.setAttribute('contenteditable', 'true');
    } else {
      document.querySelector('.video-title')?.setAttribute('contenteditable', 'false');
    }
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

          <p className="text-base-900 text-xl font-semibold video-title" contentEditable="false">{title}</p>
          <div>
            <IconButton type="primary" onClick={() => { editTitle() }}>
              <IconEdit className="group-hover:fill-white" />
            </IconButton>
          </div>
        </div>
        <div className="flex items-center py-2.5 pl-2.5 gap-x-6">
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

          <IconButton type="secondary" color="warning">
            <IconTrash />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
