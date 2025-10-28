"use client";
import React from "react";
import Secao from "../components/secao";
import Citacao from "../components/citacao";
import Estatisticas from "../components/estatisticas";
import styles from "../styles/sobre.module.css";

export default function Sobre() {
  return (
    <div className={styles.container}>
      <Secao
        imagem="/imgs/flor.jpg"
        titulo="MAIS SAÚDE, ALEGRIA E EQUILÍBRIO PARA SEU DIA A DIA!"
        subtitulo=" Queremos que cada arranjo nosso faça do seu espaço um refúgio de bem-estar e energia positiva. "
        texto="Juntos, podemos transformar cada cantinho em um lugar repleto de significado e inspiração, onde cada flor conta uma história, cada aroma desperta sensações de bem-estar, e cada cor traz alegria e harmonia para o seu dia. Fazemos com que cada espaço se torne um refúgio de beleza, acolhimento e momentos especiais."
        botao="Transforme seu espaço"
        invertido={false}
      />

      <Citacao
        texto="Em cada arranjo da BellaDonna, percebe-se uma atenção
        delicada aos detalhes, como se flor trouxesse sua própria
        voz. É um trabalho que celebra a natureza e traz energia ao
        espaço, transformando simples gestos em reflexos de beleza
        e serenidade."
        autor="Isabella Tavares, Fundadora da BellaDonna"
      />

      <Secao
        imagem="/imgs/flor1.jpg"
        titulo="TUDO COMEÇOU COM UM OLHAR ATENTO PARA OS PEQUENOS DETALHES DA VIDA."
        texto="Eu sempre percebi como um ambiente bem cuidado, com flores e cores certas, pode transformar nosso humor e trazer equilíbrio ao nosso dia a dia. Mas também percebi a dificuldade que muitos tinham em encontrar arranjos que transmitissem cuidado, significado e bem-estar, sem perder a beleza.

Foi a partir dessa percepção que nasceu a BellaDonna. Ao longo da minha jornada, mergulhei no mundo das flores, estudando suas cores, aromas e combinações, e aprendi que cada arranjo pode contar uma história e transformar qualquer espaço."
        invertido={true}
      />

      <Estatisticas />

      <div className={styles.cta}>
        <img
          src="imgs/flor2.jpg"
          alt="Flores delicadas"
          className={styles.bgImage}
        />
        <div className={styles.conteudo}>
          <h2>
            DÊ O PRIMEIRO PASSO EM DIREÇÃO A UM AMBIENTE QUE REFLETE O SEU
            MELHOR.
          </h2>
          <p>
            Se você sente que é hora de renovar suas energias e transformar o
            lugar onde vive, permita que a beleza das flores guie essa mudança.
            Cada arranjo da BellaDonna é um convite para desacelerar, respirar
            fundo e reconectar o equilíbrio que faz a vida florescer.
          </p>
          <button>Transforme seu espaço</button>
        </div>
      </div>
    </div>
  );
}
