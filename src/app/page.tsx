import styles from "./page.module.css";
import { Game } from "@/components/Game";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>15 Puzzle</h1>
      <Game />
    </div>
  );
}
