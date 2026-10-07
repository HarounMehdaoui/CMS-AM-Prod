/**
 * Baseline "known-good" media for the real site content. `POST /api/admin/reset-images`
 * restores exactly these field values, by id, and leaves everything else
 * (text fields, published state, order, and any records not listed here)
 * untouched. Records created after this baseline was captured simply aren't
 * covered — reset never deletes or touches ids it doesn't recognize.
 *
 * Sourced directly from the site repo's src/content/*.json (the real site's
 * own content), not invented. No project has ever had a real cover photo
 * (projects.json has media: null across the board — the site renders a
 * brand-toned placeholder instead), so `projects` stays empty; same reason
 * `team_members` photos are null and untracked here.
 */

export const DEFAULT_IMAGES = {
  projects: {} as Record<string, { media: string }>,
  services: {
    "portrait-photography": {
      image: "http://localhost:3000/uploads/99e932bc-cde1-41db-a461-fbc333354cb1.png",
      icon: "http://localhost:3000/uploads/c6c265c3-76a9-4c38-aa30-75588836d8c4.svg",
    },
    "shot-with-top-gear": {
      image: "http://localhost:3000/uploads/0928c54f-0e20-4345-acb5-c52bee66c100.png",
      icon: "http://localhost:3000/uploads/1681e78c-5ae1-4425-beec-85d0fe1af312.svg",
    },
    "branding-lifestyle-photography": {
      image: "http://localhost:3000/uploads/42f21047-ab97-4730-98f0-7d3c3523c26a.png",
      icon: "http://localhost:3000/uploads/bcffc922-b755-460d-ab18-5db3ace6c35c.svg",
    },
  },
  testimonials: {
    "amelia-rhodes": {
      avatar: "http://localhost:3000/uploads/80da90b3-32b5-472b-a802-5acb3aa23b02.png",
    },
    "marcus-webb": {
      avatar: "http://localhost:3000/uploads/80da90b3-32b5-472b-a802-5acb3aa23b02.png",
    },
    "priya-nandan": {
      avatar: "http://localhost:3000/uploads/80da90b3-32b5-472b-a802-5acb3aa23b02.png",
    },
    "tobias-reyes": {
      avatar: "http://localhost:3000/uploads/80da90b3-32b5-472b-a802-5acb3aa23b02.png",
    },
    "hana-ito": {
      avatar: "http://localhost:3000/uploads/80da90b3-32b5-472b-a802-5acb3aa23b02.png",
    },
    "diego-fuentes": {
      avatar: "http://localhost:3000/uploads/80da90b3-32b5-472b-a802-5acb3aa23b02.png",
    },
    "freya-lindqvist": {
      avatar: "http://localhost:3000/uploads/80da90b3-32b5-472b-a802-5acb3aa23b02.png",
    },
  },
  clients: {
    logo: { image: "http://localhost:3000/uploads/9d756b5a-9bfb-4374-84af-67fa5fc73582.png" },
    "logo-ipsum": { image: "http://localhost:3000/uploads/427b5ad2-3233-4262-b7e9-3008186184b4.png" },
    ipsum: { image: "http://localhost:3000/uploads/219c3db4-51d3-47df-8468-bb5eade8cd73.png" },
    wave: { image: "http://localhost:3000/uploads/655e4a68-4fb5-4cf7-85ec-5b1d4bf45d6c.png" },
  },
  circleTicker: {
    "card-1": { imageUrl: "http://localhost:3000/uploads/006c3f0e-789d-4734-bf63-5d09479904ea.png" },
    "card-2": { imageUrl: "http://localhost:3000/uploads/6cf73d0d-65d4-4410-b421-cad91ab11cdf.png" },
    "card-3": { imageUrl: "http://localhost:3000/uploads/4c56560a-5edd-4c26-96f7-1b7d343c9d6b.png" },
    "card-4": { imageUrl: "http://localhost:3000/uploads/890fcecc-2c37-4767-b604-75e9b83cc258.png" },
    "card-5": { imageUrl: "http://localhost:3000/uploads/76628e36-1103-40da-94e5-f6397676e92a.png" },
    "card-6": { imageUrl: "http://localhost:3000/uploads/30933939-70f1-46ff-b22b-8b598197ea2d.png" },
    "card-7": { imageUrl: "http://localhost:3000/uploads/a1bff65a-da5b-4490-b6eb-20a2f013dad9.png" },
    "card-8": { imageUrl: "http://localhost:3000/uploads/32f5ebcf-dd15-4230-9906-feffd949a603.png" },
    "card-9": { imageUrl: "http://localhost:3000/uploads/6308fae0-dd2d-4435-abc8-c42ae7e43ea1.png" },
    "card-10": { imageUrl: "http://localhost:3000/uploads/b308ec45-fe9c-4815-becc-9b32e2f48e46.png" },
    "card-11": { imageUrl: "http://localhost:3000/uploads/85e35581-2663-4a7d-8958-5d1455aa60ea.png" },
    "card-12": { imageUrl: "http://localhost:3000/uploads/1593d02a-f892-4772-b796-3027e9b60c4e.png" },
  },
  heroMedia: {
    videoUrl: "http://localhost:3000/uploads/24a412e1-6113-4a68-94a8-8cb199d5612a.mp4",
  },
} as const;
