export type Vehicle = {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  lugares: number;
};

export type User = {
  id: string;
  nome: string;
  email: string;
  genero: 'F' | 'M' | 'OUTRO';
  role: 'motorista' | 'passageiro';
};
