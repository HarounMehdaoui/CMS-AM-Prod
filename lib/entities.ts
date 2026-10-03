import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugSchema = z
  .string()
  .min(1)
  .max(96)
  .regex(SLUG_RE, "must be lowercase kebab-case (a-z, 0-9, hyphens)");

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  media: string | null;
  video_embed: string | null;
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export const projectOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  media: z.string().nullable(),
  videoEmbed: z.string().nullable(),
  published: z.boolean(),
  order: z.number(),
});
export type ProjectOutput = z.infer<typeof projectOutputSchema>;

export function mapProject(row: ProjectRow): ProjectOutput {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    media: row.media,
    videoEmbed: row.video_embed,
    published: row.published,
    order: row.order,
  };
}

export const projectCreateSchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  media: z.string().nullable().optional(),
  videoEmbed: z.string().nullable().optional(),
  published: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

// Not derived from projectCreateSchema via .omit().partial(): zod's
// .partial() does not strip .default(), so a derived schema would silently
// reintroduce defaulted values (e.g. order: 0) for every PATCH that omits
// them, clobbering existing data. Defined independently instead, with plain
// .optional() and no defaults, so an absent field stays absent in the parsed
// output and buildUpdateSet() correctly leaves that column untouched.
export const projectUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  media: z.string().nullable().optional(),
  videoEmbed: z.string().nullable().optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
});

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type ServiceRow = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  icon: string;
  layout: "wide" | "tall";
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export const serviceOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  icon: z.string(),
  layout: z.enum(["wide", "tall"]),
  published: z.boolean(),
  order: z.number(),
});
export type ServiceOutput = z.infer<typeof serviceOutputSchema>;

export function mapService(row: ServiceRow): ServiceOutput {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tags: row.tags,
    image: row.image,
    icon: row.icon,
    layout: row.layout,
    published: row.published,
    order: row.order,
  };
}

export const serviceCreateSchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  image: z.string().min(1),
  icon: z.string().min(1),
  layout: z.enum(["wide", "tall"]),
  published: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

// See projectUpdateSchema for why this isn't derived via .omit().partial().
export const serviceUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  layout: z.enum(["wide", "tall"]).optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
});

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  company: string;
  avatar: string;
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export const testimonialOutputSchema = z.object({
  id: z.string(),
  quote: z.string(),
  name: z.string(),
  company: z.string(),
  avatar: z.string(),
  published: z.boolean(),
  order: z.number(),
});
export type TestimonialOutput = z.infer<typeof testimonialOutputSchema>;

export function mapTestimonial(row: TestimonialRow): TestimonialOutput {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    company: row.company,
    avatar: row.avatar,
    published: row.published,
    order: row.order,
  };
}

export const testimonialCreateSchema = z.object({
  id: slugSchema,
  quote: z.string().min(1),
  name: z.string().min(1),
  company: z.string().min(1),
  avatar: z.string().min(1),
  published: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

// See projectUpdateSchema for why this isn't derived via .omit().partial().
export const testimonialUpdateSchema = z.object({
  quote: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  avatar: z.string().min(1).optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
});

/* ------------------------------------------------------------------ */
/* Team members                                                        */
/* ------------------------------------------------------------------ */

export type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export const teamMemberOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  photo: z.string(),
  published: z.boolean(),
  order: z.number(),
});
export type TeamMemberOutput = z.infer<typeof teamMemberOutputSchema>;

export function mapTeamMember(row: TeamMemberRow): TeamMemberOutput {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    photo: row.photo,
    published: row.published,
    order: row.order,
  };
}

export const teamMemberCreateSchema = z.object({
  id: slugSchema,
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  photo: z.string().min(1),
  published: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

// See projectUpdateSchema for why this isn't derived via .omit().partial().
export const teamMemberUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  photo: z.string().min(1).optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
});

/* ------------------------------------------------------------------ */
/* Clients                                                              */
/* ------------------------------------------------------------------ */

export type ClientRow = {
  id: string;
  name: string;
  image: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export const clientOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  order: z.number(),
});
export type ClientOutput = z.infer<typeof clientOutputSchema>;

export function mapClient(row: ClientRow): ClientOutput {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    order: row.order,
  };
}

export const clientCreateSchema = z.object({
  id: slugSchema,
  name: z.string().min(1),
  image: z.string().min(1),
  order: z.number().int().optional().default(0),
});

// See projectUpdateSchema for why this isn't derived via .omit().partial().
export const clientUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  order: z.number().int().optional(),
});

/* ------------------------------------------------------------------ */
/* Circle ticker images                                                */
/* ------------------------------------------------------------------ */

export type CircleTickerRow = {
  id: string;
  image_url: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export const circleTickerOutputSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  order: z.number(),
});
export type CircleTickerOutput = z.infer<typeof circleTickerOutputSchema>;

export function mapCircleTicker(row: CircleTickerRow): CircleTickerOutput {
  return {
    id: row.id,
    imageUrl: row.image_url,
    order: row.order,
  };
}

export const circleTickerCreateSchema = z.object({
  id: slugSchema,
  imageUrl: z.string().min(1),
  order: z.number().int().optional().default(0),
});

// See projectUpdateSchema for why this isn't derived via .omit().partial().
export const circleTickerUpdateSchema = z.object({
  imageUrl: z.string().min(1).optional(),
  order: z.number().int().optional(),
});

/* ------------------------------------------------------------------ */
/* Hero media (singleton)                                              */
/* ------------------------------------------------------------------ */

export type HeroMediaRow = {
  id: number;
  video_url: string;
  updated_at: string;
};

export const heroMediaOutputSchema = z.object({
  videoUrl: z.string(),
});
export type HeroMediaOutput = z.infer<typeof heroMediaOutputSchema>;

export function mapHeroMedia(row: HeroMediaRow): HeroMediaOutput {
  return { videoUrl: row.video_url };
}

export const heroMediaUpsertSchema = z.object({
  videoUrl: z.string().min(1),
});
