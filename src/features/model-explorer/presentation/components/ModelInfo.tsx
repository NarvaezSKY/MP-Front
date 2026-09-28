import { Card } from '@/shared/ui/Card';

export function ModelInfo() {
  return (
    <Card title="¿Cómo funciona el modelo?">
      <div className="model-info">
        <section>
          <h4>1. Qué predice</h4>
          <p>
            Para cada programa calcula la{' '}
            <strong>probabilidad de que haya demanda</strong>, es decir, de que las personas se
            inscriban y la ficha se pueda ejecutar, frente a la posibilidad de que la ficha se{' '}
            <strong>cancele</strong> por falta de inscritos.
          </p>
          <p>
            El análisis se hace solo con{' '}
            <strong>programas de formación titulada en oferta abierta</strong>, que es la modalidad
            donde la demanda es libre.
          </p>
        </section>

        <section>
          <h4>2. Cómo se calculan las probabilidades</h4>
          <p>Se combinan <strong>dos fuentes de información</strong>:</p>
          <ul>
            <li>
              <strong>El historial del propio programa:</strong> cuántas veces se ha ofrecido antes,
              cuánta demanda ha tenido en cada ocasión, cuántas personas se matricularon, se
              inscribieron o se certificaron, hace cuánto se ofreció por última vez y si esa demanda
              viene creciendo o cayendo.
            </li>
            <li>
              <strong>El contexto en el que se ofrece:</strong> el municipio, la jornada, el centro
              de formación, el área de conocimiento y el nivel. Un mismo programa puede tener más
              demanda en una zona que en otra, y eso también se tiene en cuenta.
            </li>
          </ul>
          <p>
            Para llegar al resultado, la balanza se inclina según{' '}
            <strong>cuánta historia tenga el programa</strong>: si el programa se ha ofrecido muchas
            veces, pesa más su propio comportamiento pasado; si se ofrece por primera vez, se
            confía más en lo que ocurre en su entorno.
          </p>
          <p>
            El modelo se probó con ofertas anteriores para asegurar que los números sean{' '}
            <strong>realistas</strong>: por ejemplo, si un programa muestra 70% de probabilidad,
            significa que, en casos muy parecidos, de cada 10 fichas similares unas 7 sí se
            ejecutaron.
          </p>
        </section>
      </div>
    </Card>
  );
}