import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  ArrowsExpandIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(100);
  const [tempVol, setTempVol] = useState(volume);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentIdTrack(data.body?.item.id);

        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(100);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume >= 0 && volume <= 100 && status === "authenticated") {
      debouncify(volume);
    }
  }, [volume]);

  const debouncify = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume);
    }, 100),
    []
  );

  return (
    <div className="h-[5.6rem] bg-zinc-900  border-t border-zinc-800 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-4">
      {/* LEFT */}
      <div className="flex items-center space-x-4">
        <img
          src={songInfo?.album.images?.[0]?.url}
          alt=""
          className="hidden md:inline h-14 w-14"
        />
        <div className="">
          <p className="text-sm font-normal ">{songInfo?.name}</p>
          <p className="text-xs text-gray-400 ">
            {songInfo?.artists?.[0]?.name} {songInfo?.artists?.[1]?.name}{" "}
            {songInfo?.artists?.[2]?.name} {songInfo?.artists?.[3]?.name}{" "}
          </p>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon
            className="button w-10 h-10"
            onClick={() => handlePlayPause()}
          />
        ) : (
          <PlayIcon
            className="button w-10 h-10"
            onClick={() => handlePlayPause()}
          />
        )}

        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      {/* RIGHT */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end">
        {volume == 0 ? (
          <VolumeOffIcon
            className="button"
            onClick={() => {
              setVolume(tempVol);
            }}
          />
        ) : (
          <VolumeUpIcon
            className="button"
            onClick={() => {
              setTempVol(volume);
              setVolume(0);
            }}
          />
        )}
        <input
          onChange={(e) => {
            setVolume(Number(e.target.value));
          }}
          type="range"
          min={0}
          max={100}
          value={volume}
          className="h-1 w-28"
        />
        <ArrowsExpandIcon className="button " />
      </div>
    </div>
  );
}

export default Player;
