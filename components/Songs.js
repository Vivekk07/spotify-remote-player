import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

const Songs = () => {
  const playlist = useRecoilValue(playlistState);
  return (
    <div className="text-white">
      {playlist?.tracks.items.map((item, i) => (
        <Song key={item.track.id} track={item.track} order={i} />
      ))}
      <div className="h-24 "></div>
    </div>
  );
};

export default Songs;
