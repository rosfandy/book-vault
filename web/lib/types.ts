export interface Page {
  slug: string;
  title: string;
  path: string;
}

export interface PageContent {
  slug: string;
  title: string;
  content: string; // raw markdown
  headings: Heading[];
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}
