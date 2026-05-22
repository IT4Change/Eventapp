<template>
  <section id="about" class="about bg-off py-[120px]">
    <div class="container-w">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div class="about-image-wrap relative">
          <div class="about-image" />
        </div>
        <div>
          <div class="section-eyebrow grad-text inline-block" style="text-align:left">
            Unsere Geschichte · Our Story
          </div>
          <h2 class="font-sans text-[42px] text-ink mb-1.5 leading-[1.2] font-extralight">
            Geboren aus dem<br />
            <span class="script grad-text" style="font-size: 54px;">Feuer im Wald</span>
          </h2>
          <span class="italic text-coral text-base mb-6 block font-serif">— Born from the fire in the forest —</span>
          <p class="text-base text-ink-soft mb-5 leading-[1.8] font-light">
            Soul² entstand an einem Sommerabend, als sich zwölf Fremde um ein Lagerfeuer setzten
            und am nächsten Morgen als Familie wieder aufstanden. Wir wussten: Solche Räume braucht
            die Welt heute mehr denn je.
          </p>
          <p class="text-base text-ink-soft mb-5 leading-[1.8] font-light">
            Seitdem kuratieren wir Erlebnisse, in denen Körper, Geist und Erde sich wieder berühren
            — ohne Dogma, ohne Show. Nur ehrliches Beisammensein, kraftvolle Musik, mutige Bewegung
            und alte Weisheit, neu erzählt.
          </p>
          <blockquote class="font-serif italic text-xl text-ink pl-5 my-7 leading-[1.5]" style="border-left: 3px solid var(--gold);">
            „Die Seele zum Quadrat — das ist, was wir füreinander werden, wenn wir uns wirklich
            treffen.“
          </blockquote>
          <a href="#" class="btn">Mehr erfahren</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-image-wrap {
  position: relative;
}
.about-image {
  background-image: url('/img/brand/06_ceremony_motif.png');
  background-size: cover;
  background-position: center;
  height: 640px;
  border-radius: 24px;
  position: relative;
  z-index: 1;
}
.about-image-wrap::after {
  content: '';
  position: absolute;
  top: 22px;
  left: 22px;
  right: -22px;
  bottom: -22px;
  border: 2px solid var(--teal);
  border-radius: 24px;
  z-index: 0;
  opacity: 0.5;
}
</style>
