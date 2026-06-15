export interface ILlmParameter {
  isEnabled: boolean;
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  isVariable: boolean;
  startVariateFrom: number | null;
  endVariateTo: number | null;
  stepsCount: number | null;
}
