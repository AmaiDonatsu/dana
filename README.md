# Dana

Este juego lleva el nombre de mi novia, a quien va dedicado este juego.

la temática del juego es aventura y combate en un mundo de fantasía instpidado en la cultura Asiatica.

las mecánicas del juego son sencillas, son puzles que representan combates mágicos intelectuales.
la dificultad de los puzles está ajustada a las habilidades de mi novia, quien es muy inteligente, por lo que, serán desafiantes pero no imposibles.

me inspisraré de los puzles de los juegos de puzzle de periodicos, de los pasatiempos de linkedin y puzzles usados para medir el IQ y habilidades psicométricas, cosas en las que mi novia es experta.

## Mecánicas:
- El personaje va caminando por el mundo, encontrando recursos, que le permiten avanzar en el juego.
- También puede toparse con NPCs, que le permiten obtener información o recursos, intercambiar items, etc.
- la exploración es libre, inspirado en juegos como Pokemon, Zelda, etc.
- los personajes contra los que se enfrenta son algo así como "duelistas".
- los duelistas son como hechizeras, seres mágicos, etc.
- cuando un duelista te ve o hablas con ella, se inicia un duelo.
- los duelos pueden variar, y serán diferentes puzzles dependiendo de el tipo de duelistas.

## Mecánicas (características técnicas):
### Para los duelos:
tengo que buscar una forma de implementar puzzles que puedan ser flexibles y variados aprovechando las caracteristicas de ReactNative que es en lo que está hecho este juego.
- las duelistas serán un componente, que dentro tienen un objeto llamado "flow" que tiene el arbol de decisiones del duelo.

```json
{
    flow: {
        fase: 1,
        puzzle: "",

        onResolve: {
            {
                fase: 2,
                puzzle: "",
                puzzleProps: {},
                onResolve: "finish",
                onFail: "fail",
            }
        },
        onFail: {
            {fase: 2, puzzle: "", puzzleProps: {}, onResolve: "finish", onFail: "fail"},
        },
    }
}
```


- el duelo es otro componente, que recibe como argumentos puzzle y puzzleProps.
- minijuegos disponibles (puzzles):

juego de memoria de trabajo:
recibe como props:
- tipo: "normal" | "invertido"
- velocidad: "normal" | "rapido"
- duracion: int
