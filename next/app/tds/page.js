'use client';
import { useGetDataByCategory } from "../api/api-hooks";
import { CardsList } from "../components/CardsListSection/CardsList";
import { endpoints } from "../api/config";
import { Preloader } from "../components/Preloader/Preloader";

export default function Tds() {
    const tdsGames = useGetDataByCategory(endpoints.games, 'TDS');

    return (
        <main className={"main-inner"}>
            {tdsGames ? (
                <CardsList id="TDS" title="tds" data={tdsGames} />
            ) : (
                <Preloader />
            )}
        </main>
    )
}