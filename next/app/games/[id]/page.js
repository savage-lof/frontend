"use client";
import Styles from "./Game.module.css";
import { useEffect, useState } from "react";
import { endpoints } from "@/app/api/config";
import { checkIfUserVoted, getNormalizedGameDataById, isResponseOk, vote } from "@/app/api/api-utils";
import { Preloader } from "@/app/components/Preloader/Preloader";
import { GameNotFound } from "@/app/components/GameNotFound/GameNotFound";
import { useStore } from "@/app/store/app-store";

export default function GamePage(props) {
  const [game, setGame] = useState(null);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [isVoted, setIsVoted] = useState(false);
  const store = useStore();

  useEffect(() => {
    async function fetchData() {
      setPreloaderVisible(true);
      const game = await getNormalizedGameDataById(
        endpoints.games,
        props.params.id
      );
      isResponseOk(game) ? setGame(game) : setGame(null);
      setPreloaderVisible(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (store.user && game) {
      setIsVoted(checkIfUserVoted(game, store.user.id));
    } else {
      setIsVoted(false);
    }
  }, [store.user, game]);

  const handleVote = async () => {
    const jwt = store.token;

    let usersIdArray = game.users.length
      ? game.users.map((user) => user.id)
      : [];
    usersIdArray.push(store.user.id);
    // Сначала выполнили запрос на добавление голоса
    const response = await vote(
      `${endpoints.games}/${game.id}`,
      jwt,
      usersIdArray
    );
    // Только если запрос успешный,
    if (isResponseOk(response)) {
      console.log('sucsses')
      setGame(() => {
        return {
          ...game,
          users: [...game.users, store.user],
        };
      });
      setIsVoted(true);
    }
  };


  return (<main className="main">
    {game ? (
      <>
        <section className={Styles['game']}>
          <iframe className={Styles['game__iframe']} src={game.link}></iframe>
        </section>
        <section className={Styles['about']}>
          <h2 className={Styles['about__title']}>{game.title}</h2>
          <div className={Styles['about__content']}>
            <p className={Styles["about__description"]}>{game.description}</p>
            <div className={Styles["about__author"]}>
              <p>Автор: <span className={Styles["about__accent"]}>{game.developer}</span></p>
            </div>
          </div>
          <div className={Styles["about__vote"]}>
            <p className={Styles["about__vote-amount"]}>За игру уже проголосовали: <span className={Styles["about__accent"]}>{game.users.length}</span></p>
            <button
    disabled={!store.isAuth || isVoted}
  className={`button ${Styles["about__vote-button"]}`}
  onClick={handleVote}
>
  {isVoted ? "Голос учтён" : "Голосовать"}
</button> 
          </div>
        </section>
      </>
    ) : preloaderVisible ? (
      <Preloader />
    ) : (
      <GameNotFound />
    )}
  </main>
  );
}
