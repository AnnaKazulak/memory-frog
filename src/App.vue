<template>
  <div id="app">
    <h1 class="title">
      Memory Frog <img class="title__img" :src="frog" alt="Memory Frog Logo" />
    </h1>
    <div>
      <nav class="nav">
        <div class="nav__time">
          Time: {{ time.minutes }}:{{
            time.seconds.toString().padStart(2, "0")
          }}
        </div>
        <div class="nav__counter">Counter: {{ counter }}</div>
      </nav>
      <div class="cards" v-if="foundCards.length < cards.length">
        <div
          :class="[
            'card',
            {
              'card--active': activeCards
                .map((card) => card.id)
                .includes(`card_${index + 1}`),
            },
            {
              'card--hidden': foundCards
                .map((card) => card.id)
                .includes(`card_${index + 1}`),
            },
          ]"
          v-for="(card, index) in cards"
          :key="`${index}_${card.id} `"
          :id="`card_${index + 1} `"
          @click="openCard(`card_${index + 1}`, card.name)"
        >
          <div class="front"></div>
          <div class="back">
            <img class="back__img" :src="card.url" :alt="card.name" />
          </div>
        </div>
      </div>
      <div v-else class="win">
        <img class="win__img" :src="confetti" alt="Congrats!" />
        <div class="win__content">
          Congrats! You won.
        </div>
        <button class="win__restart" @click="loadCards">Repeat Game</button>
      </div>
    </div>
    <footer class="footer">
      <div v-if="showAuthors" class="flat-icons">
        Icons made by
        <a
          class="flat-icons__link"
          href="https://www.flaticon.com/authors/pongsakornred"
          title="pongsakornRed"
          >pongsakornRed</a
        >
        from
        <a
          class="flat-icons__link"
          href="https://www.flaticon.com/"
          title="Flaticon"
          >www.flaticon.com</a
        >
      </div>
      2021 &copy; Anna Kazulak
      <fa-icon @click="showAuthors = !showAuthors" icon="info-circle" />
    </footer>
  </div>
</template>

<script>
import cards from "@/assets/cards.json";
import shuffle from "knuth-shuffle-seeded";
import confetti from "@/assets/confetti.svg";
import frog from "@/assets/frog.svg";

export default {
  name: "App",
  data() {
    return {
      showAuthors: false,
      confetti,
      frog,
      time: {
        minutes: 0,
        seconds: 0,
      },
      counter: 0,
      cards: [],
      activeCards: [],
      foundCards: [],
    };
  },

  mounted() {
    // mamy 12 card, z concat podwajamy te karty, laczymy tablice
    // to ma byc pobrane jak sie strona laduje, tu cards.json
    // shuffle misza karty przypadkowo
    this.cards = shuffle(cards.concat(cards));
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    setTimer() {
      this.timer = setInterval(() => {
        if (this.time.seconds < 60) {
          this.time.seconds++;
        } else {
          this.time.seconds = 0;
          this.time.minutes++;
        }
      }, 1000);
    },
    loadCards() {
      this.cards = shuffle(cards.concat(cards));
      this.foundCards = [];
    },
    openCard(id, name) {
      console.log(id, name);
      if (!this.timer) {
        this.setTimer();
      }
      if (
        this.activeCards.length < 2 &&
        !this.activeCards.map((card) => card.id).includes(id) &&
        !this.foundCards.map((card) => card.id).includes(id)
      ) {
        this.activeCards.push({
          id,
          name,
        });
        if (this.activeCards.length === 2) {
          this.counter++;
          setTimeout(() => {
            if (this.activeCards[0].name === this.activeCards[1].name) {
              this.foundCards = this.foundCards.concat(this.activeCards);
              if (this.foundCards.length === this.cards.length) {
                clearInterval(this.timer);
              }
            }
            this.activeCards = [];
          }, 700);
        }
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .title {
    display: flex;
    align-items: center;
    .title__img {
      width: 50px;
      height: 50px;
      margin: 0 10px;
    }
  }
  .nav {
    width: 100%;

    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .nav__time {
      font-size: 20px;
    }
    .nav__counter {
      font-size: 20px;
    }
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 10px;
    .card {
      position: relative;
      width: 150px;
      height: 100px;
      transition: 0.3s ease;
      cursor: pointer;
      &:hover {
        transform: scale(0.98);
      }

      .front,
      .back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        backface-visibility: hidden;
        transition: 0.5s ease;
        border-radius: 20px;
      }
      .front {
        background-color: gray;
        transform: perspective(800px) rotateY(0);
      }
      .back {
        transform: perspective(800px) rotateY(180deg);

        .back__img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .card--active {
      cursor: default;
      .front {
        transform: perspective(800px) rotateY(180deg);
      }
      .back {
        transform: perspective(800px) rotateY(0);
      }
      &:hover {
        transform: scale(1);
      }
    }
    .card--hidden {
      opacity: 0;
      cursor: default;
    }
  }
  .win {
    width: 950px;
    height: 430px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: #505050;
    border-radius: 10px;
    text-align: center;
    .win__img {
      width: 150px;
      height: 150px;
      margin-bottom: 20px;
      animation: fadeIn 0.5s both;
    }
    .win__content {
      font-size: 25px;
      font-weight: bold;
      animation: fadeIn 0.5s both;
    }
    .win__restart {
      border-radius: 10px;
      font-size: 18px;
      font-family: "Baloo 2", sans-serif;
      border: none;
      background-color: $bg-primary;
      color: $primary;
      padding: 5px 10px;
      margin: 10px;
      cursor: pointer;
      outline: none;
    }
  }
  .footer {
    width: 100%;
    height: 60px;

    text-align: center;
    padding: 5px;
    .flat-icons {
      .flat-icons__link {
        text-decoration: none;
        color: limegreen;
        font-weight: bold;
        transition: 0.2s ease;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
