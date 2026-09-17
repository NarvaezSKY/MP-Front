import { Card } from '@/shared/ui/Card';

export function ModelInfo() {
  return (
    <Card title="¿Cómo funciona el modelo?">
      <div className="model-info">
        <section>
          <h4>1. Qué predice</h4>
          <p>
            Es un modelo de <strong>clasificación binaria</strong>: para cada programa estima la
            probabilidad de <strong>demanda</strong> (que la ficha se ejecute/termine) frente al{' '}
            <strong>fracaso</strong> (que la ficha se cancele). Se entrena solo con{' '}
            <strong>formación titulada</strong> y <strong>oferta abierta</strong>, que es el tipo de
            respuesta con demanda libre.
          </p>
        </section>

        <section>
          <h4>2. Cómo se calculan las probabilidades</h4>
          <p>
            Para cada programa se combinan <strong>dos fuentes</strong>, ambas{' '}
            <em>sin fuga de futuro</em> (solo usan información anterior a cada oferta):
          </p>
          <ul>
            <li>
              <strong>Historial propio del programa:</strong> número de ofertas anteriores, tasa de
              demanda previa, promedio de matriculados, inscritos y certificados, recencia (años
              desde la última oferta) y tendencia.
            </li>
            <li>
              <strong>Un modelo calibrado</strong> (GBM, el mejor de 3 evaluados por ROC-AUC ≈ 0.77)
              que modula el resultado con el contexto: municipio, jornada, centro, red de
              conocimiento y nivel de formación.
            </li>
          </ul>
          <p>
            La probabilidad final es un <strong>blend ponderado por la cantidad de evidencia</strong>:
            <em> w = n&nbsp;/&nbsp;(n&nbsp;+&nbsp;10)</em>. A más ofertas históricas del programa (n),
            más peso tiene su tasa propia; sin historia, la predicción la hace solo el modelo.
          </p>
          <p>
            El entrenamiento es temporal: <strong>2020-2024</strong> para entrenar y{' '}
            <strong>2025-2026</strong> para validar. Las probabilidades se{' '}
            <strong>calibran (sigmoid)</strong> para que el valor sea <strong>honesto</strong> y no
            solo el orden: un programa con 70% se ejecuta en ~7 de cada 10 fichas similares.
          </p>
        </section>
      </div>
    </Card>
  );
}