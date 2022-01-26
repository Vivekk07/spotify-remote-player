import { getSession } from "next-auth/react";
import Center from "../components/Center";
import Sidebar from "../components/Sidebar";
import Head from "next/head";
import Player from "../components/Player";
import { useRecoilState } from "recoil";
import { isPlayingState } from "../atoms/songAtom";

export default function Home() {
  const [isPlaying] = useRecoilState(isPlayingState);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Web Remote</title>
        {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
      </Head>
      <main className="flex">
        <Sidebar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
