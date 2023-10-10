import React, { useState } from "react";
import ReactPlayer from "react-player/file";
import Control from "./Control";


type PlayerProps = {
    url: string;
};

const Player = ({ url }: PlayerProps) => {
    const [playerData, setPlayerData] = useState({ playing: false });

    return (
        // outer most wrapper
        <div className="relative">
            <ReactPlayer playing={playerData.playing} url={url} wrapper={Wrapper} />
            <Control />
        </div>
    );
};

export default Player;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-[560px] rounded-lg overflow-hidden">{children}</div>
);
