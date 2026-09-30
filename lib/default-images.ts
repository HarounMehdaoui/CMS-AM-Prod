/**
 * Baseline "known-good" media for the demo dataset. `POST /api/admin/reset-images`
 * restores exactly these field values, by id, and leaves everything else
 * (text fields, published state, order, and any records not listed here)
 * untouched. Records created after this baseline was captured simply aren't
 * covered — reset never deletes or touches ids it doesn't recognize.
 */

export const DEFAULT_IMAGES = {
  projects: {
    "solstice-festival-aftermovie": {
      media: "http://localhost:3000/uploads/9f12da47-22f3-4060-84b6-b87157eabd84.png",
    },
    "acme-product-launch": {
      media: "http://localhost:3000/uploads/d5a91ad0-c4d0-42d2-8042-abd4c6b98098.png",
    },
    "harbor-city-documentary": {
      media: "http://localhost:3000/uploads/c8247db7-f67b-4244-a549-4812c1574fd7.png",
    },
  },
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
    "client-1": { image: "http://localhost:3000/uploads/0c84c75e-9884-4ab4-a904-4ca2820eb53e.png" },
    "client-2": { image: "http://localhost:3000/uploads/5b2d15c2-9900-43b2-bbfa-442444d96beb.png" },
    "client-3": { image: "http://localhost:3000/uploads/8274b59d-6cff-4a38-9e96-7b31bff2ce65.png" },
    "client-4": { image: "http://localhost:3000/uploads/89e73aca-8ab1-478d-a75a-39b24b166d81.png" },
  },
  circleTicker: {
    "ticker-1": { imageUrl: "http://localhost:3000/uploads/1d66d745-faa2-43eb-b372-b2176f9ffcdb.png" },
    "ticker-2": { imageUrl: "http://localhost:3000/uploads/1e2288bf-c1c5-4f0b-a688-81d7aa9d2677.png" },
    "ticker-3": { imageUrl: "http://localhost:3000/uploads/dd6570f9-e9bd-422a-b41e-d353e0b67123.png" },
    "ticker-4": { imageUrl: "http://localhost:3000/uploads/76b13d0a-f5f8-4dd4-bfed-870f7bf9a115.png" },
    "ticker-5": { imageUrl: "http://localhost:3000/uploads/44ae1ead-ddb4-4eaf-b32c-f4b0d0fdb7b7.png" },
    "ticker-6": { imageUrl: "http://localhost:3000/uploads/2ad1c757-0fd1-4914-88bd-a2b297cdd00f.png" },
  },
  heroMedia: {
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
} as const;
