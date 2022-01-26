import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { duration } from "../lib/time";

const Song = ({ order, track }) => {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.uri],
    });
  };

  return (
    <div
      className="items-center flex justify-between px-12  py-2  space-x-14 hover:bg-zinc-800 cursor-default"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4 max-w-80">
        <p className="text-gray-400 w-5 cursor-pointer font-medium">
          {order + 1}
        </p>
        <img
          src={track.album.images[2].url}
          alt=""
          className="h-10 w-10 cursor-pointer"
        />
        <div className="w-32 md:w-36 lg:w-80 xl:w-96 sm:w-64  ">
          <p className=" font-semibold truncate cursor-pointer my-0">
            {track.name}
          </p>
          <div className="flex text-gray-400 cursor-default my-0 py-0">
            <p className="truncate">{track.artists[0]?.name}</p>
            {track.artists[1]?.name && (
              <p className="truncate">
                {", "}
                {track.artists[1]?.name}
              </p>
            )}
            {track.artists[2]?.name && (
              <p className="truncate">
                {", "}
                {track.artists[2]?.name}
              </p>
            )}
            {track.artists[3]?.name && (
              <p className="truncate">
                {", "}
                {track.artists[3]?.name}
              </p>
            )}
            {track.artists[4]?.name && (
              <p className="truncate">
                {", "}
                {track.artists[4]?.name}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex items-center text-gray-400 ml-auto md:ml-0"> */}

      <p className="hidden mr-1 md:inline w-44 truncate text-gray-400 cursor-pointer">
        {track.album.name}
      </p>

      <p className="w-36 text-gray-400">{track.album.release_date}</p>
      {/* </div> */}
      <p className="justify-end text-gray-400">{duration(track.duration_ms)}</p>
    </div>
  );
};

export default Song;
