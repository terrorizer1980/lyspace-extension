import type { Component } from 'solid-js';

import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <p>
          Welcome to <strong>Lyspace</strong>
        </p>
        <a
          class={styles.link}
          href="https://github.com/sanket143"
          target="_blank"
          rel="noopener noreferrer"
        >
          by sanket143
        </a>
      </header>
    </div>
  );
};

export default App;
