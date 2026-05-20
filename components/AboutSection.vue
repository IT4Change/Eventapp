<template>
  <section id="about" class="about bg-cream py-[120px]">
    <div class="container-w">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div class="about-image relative" />
        <div>
          <div class="text-[13px] tracking-[4px] uppercase text-rust mb-4 font-medium text-left">
            Unsere Geschichte · Our Story
          </div>
          <h2 class="font-serif text-[44px] text-cacao mb-2 leading-[1.15] font-normal">
            Geboren aus dem<br />
            <span class="script text-rust" style="font-size: 56px;">Feuer im Wald</span>
          </h2>
          <span class="italic text-rust text-base mb-6 block">— Born from the fire in the forest —</span>
          <p class="text-base text-cacao-dark mb-5 leading-[1.75]">
            Soul² entstand an einem Sommerabend, als sich zwölf Fremde um ein Lagerfeuer setzten
            und am nächsten Morgen als Familie wieder aufstanden. Wir wussten: Solche Räume braucht
            die Welt heute mehr denn je.
          </p>
          <p class="text-base text-cacao-dark mb-5 leading-[1.75]">
            Seitdem kuratieren wir Erlebnisse, in denen Körper, Geist und Erde sich wieder berühren
            — ohne Dogma, ohne Show. Nur ehrliches Beisammensein, kraftvolle Musik, mutige Bewegung
            und alte Weisheit, neu erzählt.
          </p>
          <blockquote class="font-serif italic text-xl text-rust border-l-[3px] border-saffron pl-5 my-7 leading-[1.5]">
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
.about-image {
  background-image: url('/img/brand/06_ceremony_motif.png');
  background-size: cover;
  background-position: center;
  height: 520px;
  border-radius: 4px;
}
.about-image::after {
  content: '';
  position: absolute;
  top: 24px;
  left: 24px;
  right: -24px;
  bottom: -24px;
  border: 1.5px solid var(--rust);
  border-radius: 4px;
  z-index: -1;
}
</style>
