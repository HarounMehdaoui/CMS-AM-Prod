/**
 * Baseline "known-good" media for the demo dataset. `POST /api/admin/reset-images`
 * restores exactly these field values, by id, and leaves everything else
 * (text fields, published state, order, and any records not listed here)
 * untouched. Records created after this baseline was captured simply aren't
 * covered — reset never deletes or touches ids it doesn't recognize.
 */

export const DEFAULT_IMAGES = {
  // No project has ever had a real cover photo (see src/content/projects.json
  // in the site repo — media is null for all 9 originals); the site renders
  // a brand-toned placeholder instead. solstice-festival-aftermovie,
  // acme-product-launch, and harbor-city-documentary used to point at
  // synthetic "proj-X" demo swatches left over from the CMS's standalone
  // build, which is why they're not listed here — same as the other 8.
  projects: {} as Record<string, { media: string }>,
  services: {
    "video-production": {
      image: "http://localhost:3000/uploads/06869a02-219b-407b-806f-6baa165a23cd.png",
      icon: "http://localhost:3000/uploads/75db44b3-27f7-4302-89d3-bc5c4c9fb16c.png",
    },
    "motion-graphics": {
      image: "http://localhost:3000/uploads/73a9b11a-fbfd-450c-a293-64c466609103.png",
      icon: "http://localhost:3000/uploads/94d388f5-2d32-44f2-9b80-cef93d4e1f98.png",
    },
    "drone-aerials": {
      image: "http://localhost:3000/uploads/d3f394c4-bb0d-4498-b881-545f2ab89fdf.png",
      icon: "http://localhost:3000/uploads/d78cf342-9a19-4051-b5bc-5042131f1aff.png",
    },
  },
  testimonials: {
    "jane-doe": {
      avatar: "http://localhost:3000/uploads/5fedaa6b-a014-4f20-94f1-d363e80cd8e3.png",
    },
    "marcus-lee": {
      avatar: "http://localhost:3000/uploads/9ca06cdd-4e7f-448e-8a80-06f2b6a2d493.png",
    },
    "priya-shah": {
      avatar: "http://localhost:3000/uploads/8dc5af9a-5cea-4078-a479-4542449b98c6.png",
    },
  },
  clients: {
    "client-1": { image: "http://localhost:3000/uploads/9d756b5a-9bfb-4374-84af-67fa5fc73582.png" },
    "client-2": { image: "http://localhost:3000/uploads/427b5ad2-3233-4262-b7e9-3008186184b4.png" },
    "client-3": { image: "http://localhost:3000/uploads/219c3db4-51d3-47df-8468-bb5eade8cd73.png" },
    "client-4": { image: "http://localhost:3000/uploads/655e4a68-4fb5-4cf7-85ec-5b1d4bf45d6c.png" },
  },
  circleTicker: {
    "ticker-1": { imageUrl: "http://localhost:3000/uploads/006c3f0e-789d-4734-bf63-5d09479904ea.png" },
    "ticker-2": { imageUrl: "http://localhost:3000/uploads/6cf73d0d-65d4-4410-b421-cad91ab11cdf.png" },
    "ticker-3": { imageUrl: "http://localhost:3000/uploads/4c56560a-5edd-4c26-96f7-1b7d343c9d6b.png" },
    "ticker-4": { imageUrl: "http://localhost:3000/uploads/890fcecc-2c37-4767-b604-75e9b83cc258.png" },
    "ticker-5": { imageUrl: "http://localhost:3000/uploads/76628e36-1103-40da-94e5-f6397676e92a.png" },
    "ticker-6": { imageUrl: "http://localhost:3000/uploads/30933939-70f1-46ff-b22b-8b598197ea2d.png" },
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
