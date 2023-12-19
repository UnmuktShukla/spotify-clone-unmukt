"use client"

//@ts-ignore
import { Songs } from "@/types";
import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import {BsPauseFill , BsPlayFill} from "react-icons/bs"
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2"
import Slider from "./Slider";
import usePLayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
//@ts-ignore
import useSound from "use-sound";
interface PlayerContentProps {
    song: Songs
    songUrl: string
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    song,
    songUrl
}) =>{
    const player = usePLayer(); 
    const [volume , setVolume] = useState(1);
    const [isPlaying , setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill :BsPlayFill
    const VolumeIcon = !volume ? HiSpeakerXMark : HiSpeakerWave

    const onPlayNext = () => {
        if(player.ids.length === 0){
            return;
        }

        const currentIndex = player.ids.findIndex((id)=> id === player.activeIds )
        const nextSong = player.ids[currentIndex+1]

        if(!nextSong){
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }

    const onPlayPrevious = () => {
        if(player.ids.length === 0){
            return;
        }

        const currentIndex = player.ids.findIndex((id)=> id === player.activeIds )
        const prevSong = player.ids[currentIndex-1]

        if(!prevSong){
            return player.setId(player.ids[player.ids.length-1]);
        }

        player.setId(prevSong);
    }

    const [play , {pause , sound}] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false)
                onPlayNext();
            },
            onpause: () => setIsPlaying(false), 
            format: ['mp3']
        }
    )

    useEffect(() => {
        sound?.play();
        return () => {
            sound?.unload();
        }
    }, [sound])

    const handlePlay = () => {
        if (!isPlaying){
            play();
        } else {
            pause();
        }
    }

    const toggleMute = () =>{
        if(volume === 0 ){
            setVolume(1);
        }

        else{
            setVolume(0); 
        }
    }

    return (
        <div className=" grid grid-cols-2 md:grid-cols-3 h-full">
            <div className=" flex w-full justify-start">
                <div className="flex gap-x-4 items-center">
                    <MediaItem data={song}/>
                    <LikeButton songId={song.id} />

                </div>
            </div>
            <div
            className="
                flex
                md:hidden
                col-auto
                w-full
                justify-end
                items-center
            ">
                <div
                    onClick={handlePlay}
                    className="
                        h-10
                        w-10
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        p-1
                        cursor-pointer 
                    "
                >
                    <Icon size = {30} className="text-black" />
                </div>
            </div>

            <div 
                className="
                    hidden
                    h-full
                    md:flex
                    justify-center
                    items-center
                    w-full
                    max-w-[722px]
                    gap-x-6
                "
            >
                <AiFillStepBackward 
                    onClick={onPlayPrevious}
                    size={30}
                    className="
                        text-neutral-400
                        cursor-pointer
                        hover:text-white
                        transition
                    "
                />
                <div
                    onClick={handlePlay}
                    className="
                        flex
                        items-center
                        justify-center
                        h-10
                        w-10
                        rounded-full
                        bg-white
                        p-1
                        cursor-pointer
                    "
                >
                    <Icon size={30} className=" text-black" />
                </div>

                <AiFillStepForward
                    onClick={onPlayNext}
                    size={30}
                    className="
                        text-neutral-400
                        cursor-pointer
                        hover:text-white
                        transition
                    "
                />
            </div>

            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon
                        onClick = {toggleMute}
                        className = "cursor-pointer"
                        size={34}
                    />

                    <Slider
                        value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </div>

            </div>
        </div>
    )
}

export default PlayerContent;
