import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState, playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { signOut } from "next-auth/react";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    setTimeout(() => {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => setPlaylist(data.body))
        .catch((err) => console.log("something went wrong  ", err));
    }, 500);
  }, [spotifyApi, playlistId, status]);

  return (
    <div className=" flex-grow h-screen overflow-y-scroll scrollbar-hide bg-neutral-900 ">
      <header className="absolute top-5 right-8 ">
        <div
          className=" flex items-center opacity-80 text-white bg-black space-x-3 hover:opacity-100 cursor-pointer rounded-full p-1 pr-2"
          onClick={signOut}
        >
          <img
            className="rounded-full w-190 h-6"
            src={session?.user.image}
            alt=""
          />
          <h2 className="font-bold text-white">{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-zinc-900  h-96 text-white padding-8`}
      >
        <img
          className="h-56 w-56 shadow-2xl ml-8 mb-8 no-decoration"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div className="mb-7">
          <p className="font-semibold text-sm">PLAYLIST</p>
          <h1 className="text-xl md:text-3xl xl:text-6xl font-bold">
            {playlist?.name}
          </h1>
          <p className="mt-4 text-gray-400 text-sm">{playlist?.description}</p>
          <div className="flex mt-1 text-gray-400">
            <p className="mr-1 font-semibold text-gray-300">
              {playlist?.owner.display_name} •
            </p>
            <p className="mr-1">{playlist?.followers.total} likes •</p>
            <p className="mr-1">{playlist?.tracks.total} songs</p>
          </div>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
