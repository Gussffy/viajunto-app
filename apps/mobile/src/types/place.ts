export type Place = {
  id: string;
  title: string;
  subtitle: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  city: string;
  approximate?: boolean;
};
