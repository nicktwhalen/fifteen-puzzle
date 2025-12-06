import { Board } from "@/components/Board";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>15 Puzzle</h1>
      <Board />
    </div>
  );
}
