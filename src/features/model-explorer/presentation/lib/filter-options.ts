import type { Programa } from '../../domain/entities';

function distinct(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function uniqueCentros(programas: Programa[]): string[] {
  return distinct(programas.map((p) => p.centro ?? 'Sin clasificar'));
}

export function uniqueTipos(programas: Programa[]): string[] {
  return distinct(programas.map((p) => p.tipoRespuesta));
}

export function uniqueNiveles(programas: Programa[]): string[] {
  return distinct(programas.map((p) => p.nivel ?? ''));
}

export function uniqueRedes(programas: Programa[]): string[] {
  return distinct(programas.map((p) => p.redConocimiento ?? ''));
}

export function uniqueModalidades(programas: Programa[]): string[] {
  return distinct(programas.map((p) => p.modalidad ?? ''));
}

export function uniqueMunicipios(programas: Programa[]): string[] {
  return distinct(programas.map((p) => p.municipio ?? ''));
}