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

type HeaderProps = {
  title?: string;
  setOpen: Function
};

const Header = ({ title = "Moments202305051403", setOpen }: HeaderProps) => {

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
