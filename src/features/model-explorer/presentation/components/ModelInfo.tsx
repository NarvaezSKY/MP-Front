import { Card } from '@/shared/ui/Card';

export function ModelInfo() {
  return (
    <Card title="¿Cómo funciona el modelo?">
      <div className="model-info">
        <section>
          <h4>1. Qué predice</h4>
          <p>
            Es un modelo de <strong>clasificación binaria</strong>: para cada programa estima la
            probabilidad de <strong>éxito</strong> (la ficha se ejecuta/termina) frente al{' '}
            <strong>fracaso</strong> (la ficha se cancela). Se entrena solo con formación titulada.
          </p>
        </section>

        <section>
          <h4>2. Cómo se calculan las probabilidades</h4>
          <p>
            Se usan variables históricas del programa <em>sin fuga de futuro</em> (nº de ofertas
            anteriores, tasa de éxito previa, promedio de matriculados, recencia y tendencia). El
            entrenamiento es temporal: 2020-2024 para entrenar y 2025-2026 para validar. Entre 3
            modelos se elige el mejor por ROC-AUC (Regresión Logística, AUC ≈ 0.785) y luego se{' '}
            <strong>calibran</strong> las probabilidades para que el valor sea honesto (no solo el
            orden).
          </p>
        </section>

        <section>
          <h4>3. "Historia" vs "Similitud"</h4>
          <ul>
            <li>
              <span className="tag tag--prediccion_historica">Historia</span> El programa tiene fichas
              anteriores en el histórico, así que la probabilidad la calcula el{' '}
              <strong>modelo</strong> con sus datos reales. Es la predicción más fiable.
            </li>
            <li>
              <span className="tag tag--estimacion_similitud">Similitud</span> El programa{' '}
              <strong>no tiene historia</strong> previa, por lo que su probabilidad se{' '}
              <strong>estima</strong> con el promedio de los programas de la misma{' '}
              <em>Red de Conocimiento</em> y <em>Nivel</em>. Es una aproximación, no una predicción
              del modelo.
            </li>
          </ul>
        </section>

        <section>
          <h4>4. Limitación</h4>
          <p>
            El objetivo es ejecución vs cancelación; <strong>no</strong> "cumple el mínimo de
            inscritos" (ese dato no está en el histórico). Si se cuenta con cupo/meta de matriculados,
            habría que redefinir el target y reentrenar.
          </p>
        </section>
      </div>
    </Card>
  );
}
