export enum colorChoices {
  Primary = "primary",
  Secondary = "secondary",
}

export type Service = {
  id: number;
  name: string;
  thumbnail: string;
  short_description: string;
  long_description: string;
  slug: string;
};
