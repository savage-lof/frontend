import { Banner } from "./components/Banner/Banner";
import { Promo } from "./components/Promo/Promo";
import { getNormalizedGamesDataByCategory } from "./api/api-utils.js";
import { endpoints } from "./api/config.js";
import { CardsListSection } from "./components/CardsListSection/CardsListSection.jsx";
import { Preloader } from "./components/Preloader/Preloader.jsx";

export default async function Home() {
  const popularGames = await getNormalizedGamesDataByCategory(endpoints.games, 'popular');
  const newGames = await getNormalizedGamesDataByCategory(endpoints.games, 'new');
  return (
    <main className="main">
      <Banner />
      {popularGames ? <CardsListSection id="popular" title="Популярные" data={popularGames} type='slider'/> : <Preloader/>}
      {newGames ? <CardsListSection id="new" title="Новинки" data={newGames} type='slider'/> : <Preloader/>}
      <Promo/>
    </main>
  );
}

