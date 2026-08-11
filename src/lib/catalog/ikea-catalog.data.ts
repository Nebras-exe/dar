/**
 * GENERATED FILE — do not edit by hand.
 * Produced by scripts/import-local-furniture.mjs from the local IKEA Oman
 * reference gallery. Re-run the importer to regenerate. Prices are ESTIMATED
 * (priceType: "estimated"); provenance is recorded in sourceLabel/sourceUrl.
 */
import type { CategorySlug, ColorId, Dimensions, MaterialId, RoomType, StyleTag } from "./types";

export interface RawVariant {
  variantId: string;
  colorId: ColorId;
  materialId?: MaterialId;
  image: string;
  gallery?: string[];
  priceOmr: number;
  sourceUrl: string;
}
export interface RawProduct {
  id: string;
  slug: string;
  category: CategorySlug;
  subcategory?: string;
  model: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  priceType: "estimated";
  sourceLabel: string;
  sourceUrl: string;
  stockStatus: "in-stock";
  customizable: boolean;
  materials: MaterialId[];
  styleTags: StyleTag[];
  roomTypes: RoomType[];
  dimensions: Dimensions;
  dimensionsKnown: boolean;
  colorIds: ColorId[];
  variants: RawVariant[];
  images: string[];
  addedAt: string;
  featuredRank: number;
}

export const RAW_IKEA_PRODUCTS: RawProduct[] = [
  {
    "id": "ikea-sandsberg-chair",
    "slug": "sandsberg-chair",
    "category": "chairs",
    "model": "SANDSBERG",
    "nameEn": "Sandsberg Chair",
    "nameAr": "كرسي SANDSBERG",
    "descEn": "Sandsberg Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 4 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SANDSBERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 4 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 30,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-white-10605424/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "black",
      "brown",
      "blue"
    ],
    "variants": [
      {
        "variantId": "sandsberg-chair-white",
        "colorId": "white",
        "image": "/images/catalog/sandsberg-chair/white.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-white-10605424/"
      },
      {
        "variantId": "sandsberg-chair-black",
        "colorId": "black",
        "image": "/images/catalog/sandsberg-chair/black.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-black-30605423/"
      },
      {
        "variantId": "sandsberg-chair-brown",
        "colorId": "brown",
        "image": "/images/catalog/sandsberg-chair/brown.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-red-brown-60605426/"
      },
      {
        "variantId": "sandsberg-chair-blue",
        "colorId": "blue",
        "image": "/images/catalog/sandsberg-chair/blue.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-blue-80605425/"
      }
    ],
    "images": [
      "/images/catalog/sandsberg-chair/white.jpg",
      "/images/catalog/sandsberg-chair/black.jpg",
      "/images/catalog/sandsberg-chair/brown.jpg",
      "/images/catalog/sandsberg-chair/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 0
  },
  {
    "id": "ikea-tossberg-chair",
    "slug": "tossberg-chair",
    "category": "chairs",
    "model": "TOSSBERG",
    "nameEn": "Tossberg Chair",
    "nameAr": "كرسي TOSSBERG",
    "descEn": "Tossberg Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي TOSSBERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 22,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tossberg-chair-metal-white-gunnared-beige-80565274/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "tossberg-chair-white",
        "colorId": "white",
        "materialId": "metal",
        "image": "/images/catalog/tossberg-chair/white.jpg",
        "priceOmr": 22,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tossberg-chair-metal-white-gunnared-beige-80565274/"
      },
      {
        "variantId": "tossberg-chair-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/tossberg-chair/black.jpg",
        "priceOmr": 22,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tossberg-chair-metal-black-gunnared-dark-grey-10582644/"
      }
    ],
    "images": [
      "/images/catalog/tossberg-chair/white.jpg",
      "/images/catalog/tossberg-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 1
  },
  {
    "id": "ikea-gunde-folding-chair",
    "slug": "gunde-folding-chair",
    "category": "chairs",
    "subcategory": "folding-chair",
    "model": "GUNDE",
    "nameEn": "Gunde Folding Chair",
    "nameAr": "كرسي قابل للطي GUNDE",
    "descEn": "Gunde Folding Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي قابل للطي GUNDE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 15,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gunde-folding-chair-black-00217797/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "gunde-folding-chair-black",
        "colorId": "black",
        "image": "/images/catalog/gunde-folding-chair/black.jpg",
        "priceOmr": 15,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gunde-folding-chair-black-00217797/"
      }
    ],
    "images": [
      "/images/catalog/gunde-folding-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 2
  },
  {
    "id": "ikea-dyvlinge-armchair",
    "slug": "dyvlinge-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "DYVLINGE",
    "nameEn": "Dyvlinge Armchair",
    "nameAr": "كرسي بذراعين DYVLINGE",
    "descEn": "Dyvlinge Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين DYVLINGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 53,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/dyvlinge-swivel-easy-chair-kelinge-orange-00581918/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "orange"
    ],
    "variants": [
      {
        "variantId": "dyvlinge-armchair-orange",
        "colorId": "orange",
        "image": "/images/catalog/dyvlinge-armchair/orange.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/dyvlinge-swivel-easy-chair-kelinge-orange-00581918/"
      }
    ],
    "images": [
      "/images/catalog/dyvlinge-armchair/orange.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 3
  },
  {
    "id": "ikea-vihals-chair",
    "slug": "vihals-chair",
    "category": "chairs",
    "model": "VIHALS",
    "nameEn": "Vihals Chair",
    "nameAr": "كرسي VIHALS",
    "descEn": "Vihals Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 34,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-chair-green-tibbleby-grey-green-80592767/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-chair-grey",
        "colorId": "grey",
        "image": "/images/catalog/vihals-chair/grey.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-chair-green-tibbleby-grey-green-80592767/"
      },
      {
        "variantId": "vihals-chair-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-chair/white.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-chair-white-tibbleby-beige-grey-30592760/"
      }
    ],
    "images": [
      "/images/catalog/vihals-chair/grey.jpg",
      "/images/catalog/vihals-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 4
  },
  {
    "id": "ikea-sandsberg-chair-2",
    "slug": "sandsberg-chair-2",
    "category": "chairs",
    "model": "SANDSBERG",
    "nameEn": "Sandsberg Chair",
    "nameAr": "كرسي SANDSBERG",
    "descEn": "Sandsberg Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SANDSBERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 33,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-anthracite-remmarn-anthracite-40605253/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "charcoal",
      "brown",
      "blue"
    ],
    "variants": [
      {
        "variantId": "sandsberg-chair-2-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/sandsberg-chair-2/charcoal.jpg",
        "priceOmr": 33,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-anthracite-remmarn-anthracite-40605253/"
      },
      {
        "variantId": "sandsberg-chair-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/sandsberg-chair-2/brown.jpg",
        "priceOmr": 33,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-red-brown-remmarn-red-brown-90605255/"
      },
      {
        "variantId": "sandsberg-chair-2-blue",
        "colorId": "blue",
        "image": "/images/catalog/sandsberg-chair-2/blue.jpg",
        "priceOmr": 33,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-chair-dark-blue-remmarn-dark-blue-20605254/"
      }
    ],
    "images": [
      "/images/catalog/sandsberg-chair-2/charcoal.jpg",
      "/images/catalog/sandsberg-chair-2/brown.jpg",
      "/images/catalog/sandsberg-chair-2/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 5
  },
  {
    "id": "ikea-nasinge-chair",
    "slug": "nasinge-chair",
    "category": "chairs",
    "model": "NÄSINGE",
    "nameEn": "NäSinge Chair",
    "nameAr": "كرسي NÄSINGE",
    "descEn": "NäSinge Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي NÄSINGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 34,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-chair-dark-brown-stained-kilanda-light-beige-40587503/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "white"
    ],
    "variants": [
      {
        "variantId": "nasinge-chair-beige",
        "colorId": "beige",
        "image": "/images/catalog/nasinge-chair/beige.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-chair-dark-brown-stained-kilanda-light-beige-40587503/"
      },
      {
        "variantId": "nasinge-chair-white",
        "colorId": "white",
        "image": "/images/catalog/nasinge-chair/white.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-chair-white-tibbleby-beige-grey-60587502/"
      }
    ],
    "images": [
      "/images/catalog/nasinge-chair/beige.jpg",
      "/images/catalog/nasinge-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 6
  },
  {
    "id": "ikea-tobias-chair",
    "slug": "tobias-chair",
    "category": "chairs",
    "model": "TOBIAS",
    "nameEn": "Tobias Chair",
    "nameAr": "كرسي TOBIAS",
    "descEn": "Tobias Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي TOBIAS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 53,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tobias-chair-transparent-chrome-plated-80349671/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "clear",
      "grey",
      "brown"
    ],
    "variants": [
      {
        "variantId": "tobias-chair-clear",
        "colorId": "clear",
        "materialId": "metal",
        "image": "/images/catalog/tobias-chair/clear.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tobias-chair-transparent-chrome-plated-80349671/"
      },
      {
        "variantId": "tobias-chair-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/tobias-chair/grey.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tobias-chair-grey-chrome-plated-20349674/"
      },
      {
        "variantId": "tobias-chair-brown",
        "colorId": "brown",
        "materialId": "metal",
        "image": "/images/catalog/tobias-chair/brown.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tobias-chair-brown-red-chrome-plated-90532589/"
      }
    ],
    "images": [
      "/images/catalog/tobias-chair/clear.jpg",
      "/images/catalog/tobias-chair/grey.jpg",
      "/images/catalog/tobias-chair/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 7
  },
  {
    "id": "ikea-rosentorp-chair",
    "slug": "rosentorp-chair",
    "category": "chairs",
    "model": "ROSENTORP",
    "nameEn": "Rosentorp Chair",
    "nameAr": "كرسي ROSENTORP",
    "descEn": "Rosentorp Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي ROSENTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 29,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-chair-white-80569998/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "rosentorp-chair-white",
        "colorId": "white",
        "image": "/images/catalog/rosentorp-chair/white.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-chair-white-80569998/"
      },
      {
        "variantId": "rosentorp-chair-black",
        "colorId": "black",
        "image": "/images/catalog/rosentorp-chair/black.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-chair-black-00570000/"
      }
    ],
    "images": [
      "/images/catalog/rosentorp-chair/white.jpg",
      "/images/catalog/rosentorp-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 8
  },
  {
    "id": "ikea-nordmansskar-chair",
    "slug": "nordmansskar-chair",
    "category": "chairs",
    "model": "NORDMANSSKÄR",
    "nameEn": "NordmansskäR Chair",
    "nameAr": "كرسي NORDMANSSKÄR",
    "descEn": "NordmansskäR Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي NORDMANSSKÄR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 46,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nordmansskaer-chair-black-tonerud-grey-s99618215/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "nordmansskar-chair-black",
        "colorId": "black",
        "image": "/images/catalog/nordmansskar-chair/black.jpg",
        "gallery": [
          "/images/catalog/nordmansskar-chair/black-1.jpg",
          "/images/catalog/nordmansskar-chair/black-2.jpg"
        ],
        "priceOmr": 46,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nordmansskaer-chair-black-tonerud-grey-s99618215/"
      }
    ],
    "images": [
      "/images/catalog/nordmansskar-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 9
  },
  {
    "id": "ikea-herrakra-armchair",
    "slug": "herrakra-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "HERRÅKRA",
    "nameEn": "HerråKra Armchair",
    "nameAr": "كرسي بذراعين HERRÅKRA",
    "descEn": "HerråKra Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين HERRÅKRA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 73,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/herrakra-armchair-diseroed-dark-yellow-30535543/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "yellow",
      "grey",
      "black"
    ],
    "variants": [
      {
        "variantId": "herrakra-armchair-yellow",
        "colorId": "yellow",
        "image": "/images/catalog/herrakra-armchair/yellow.jpg",
        "priceOmr": 73,
        "sourceUrl": "https://www.ikea.com/om/ar/p/herrakra-armchair-diseroed-dark-yellow-30535543/"
      },
      {
        "variantId": "herrakra-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/herrakra-armchair/grey.jpg",
        "priceOmr": 73,
        "sourceUrl": "https://www.ikea.com/om/ar/p/herrakra-armchair-vissle-grey-40544716/"
      },
      {
        "variantId": "herrakra-armchair-black",
        "colorId": "black",
        "image": "/images/catalog/herrakra-armchair/black.jpg",
        "priceOmr": 73,
        "sourceUrl": "https://www.ikea.com/om/ar/p/herrakra-armchair-skulsta-black-20535548/"
      }
    ],
    "images": [
      "/images/catalog/herrakra-armchair/yellow.jpg",
      "/images/catalog/herrakra-armchair/grey.jpg",
      "/images/catalog/herrakra-armchair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 10
  },
  {
    "id": "ikea-skalboda-armchair",
    "slug": "skalboda-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "SKÅLBODA",
    "nameEn": "SkåLboda Armchair",
    "nameAr": "كرسي بذراعين SKÅLBODA",
    "descEn": "SkåLboda Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين SKÅLBODA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 163,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalboda-armchair-white-20582035/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "black",
      "orange"
    ],
    "variants": [
      {
        "variantId": "skalboda-armchair-white",
        "colorId": "white",
        "image": "/images/catalog/skalboda-armchair/white.jpg",
        "priceOmr": 163,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalboda-armchair-white-20582035/"
      },
      {
        "variantId": "skalboda-armchair-black",
        "colorId": "black",
        "image": "/images/catalog/skalboda-armchair/black.jpg",
        "priceOmr": 163,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalboda-armchair-black-90554388/"
      },
      {
        "variantId": "skalboda-armchair-orange",
        "colorId": "orange",
        "image": "/images/catalog/skalboda-armchair/orange.jpg",
        "priceOmr": 163,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalboda-armchair-orange-40555309/"
      }
    ],
    "images": [
      "/images/catalog/skalboda-armchair/white.jpg",
      "/images/catalog/skalboda-armchair/black.jpg",
      "/images/catalog/skalboda-armchair/orange.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 11
  },
  {
    "id": "ikea-kattil-chair",
    "slug": "kattil-chair",
    "category": "chairs",
    "model": "KÄTTIL",
    "nameEn": "KäTtil Chair",
    "nameAr": "كرسي KÄTTIL",
    "descEn": "KäTtil Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي KÄTTIL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 16,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kaettil-chair-white-knisa-light-grey-60500325/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "kattil-chair-white",
        "colorId": "white",
        "image": "/images/catalog/kattil-chair/white.jpg",
        "priceOmr": 16,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kaettil-chair-white-knisa-light-grey-60500325/"
      }
    ],
    "images": [
      "/images/catalog/kattil-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 12
  },
  {
    "id": "ikea-vihals-chair-2",
    "slug": "vihals-chair-2",
    "category": "chairs",
    "model": "VIHALS",
    "nameEn": "Vihals Chair",
    "nameAr": "كرسي VIHALS",
    "descEn": "Vihals Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 43,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-chair-white-50569103/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-chair-2-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-chair-2/white.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-chair-white-50569103/"
      }
    ],
    "images": [
      "/images/catalog/vihals-chair-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 13
  },
  {
    "id": "ikea-hauga-chair",
    "slug": "hauga-chair",
    "category": "chairs",
    "model": "HAUGA",
    "nameEn": "Hauga Chair",
    "nameAr": "كرسي HAUGA",
    "descEn": "Hauga Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي HAUGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 53,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-chair-white-10576718/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "grey"
    ],
    "variants": [
      {
        "variantId": "hauga-chair-white",
        "colorId": "white",
        "image": "/images/catalog/hauga-chair/white.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-chair-white-10576718/"
      },
      {
        "variantId": "hauga-chair-grey",
        "colorId": "grey",
        "image": "/images/catalog/hauga-chair/grey.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-chair-grey-30576717/"
      }
    ],
    "images": [
      "/images/catalog/hauga-chair/white.jpg",
      "/images/catalog/hauga-chair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 14
  },
  {
    "id": "ikea-ikea-ps-2026-armchair",
    "slug": "ikea-ps-2026-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Armchair",
    "nameAr": "كرسي بذراعين IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 51,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-easy-chair-birch-00621071/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-armchair-natural",
        "colorId": "natural",
        "image": "/images/catalog/ikea-ps-2026-armchair/natural.jpg",
        "priceOmr": 51,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-easy-chair-birch-00621071/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-armchair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 15
  },
  {
    "id": "ikea-buslatt-chair",
    "slug": "buslatt-chair",
    "category": "chairs",
    "model": "BUSLÄTT",
    "nameEn": "BusläTt Chair",
    "nameAr": "كرسي BUSLÄTT",
    "descEn": "BusläTt Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BUSLÄTT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 48,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/buslaett-chair-white-pine-90601139/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "buslatt-chair-white",
        "colorId": "white",
        "image": "/images/catalog/buslatt-chair/white.jpg",
        "priceOmr": 48,
        "sourceUrl": "https://www.ikea.com/om/ar/p/buslaett-chair-white-pine-90601139/"
      }
    ],
    "images": [
      "/images/catalog/buslatt-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 16
  },
  {
    "id": "ikea-alhult-chair",
    "slug": "alhult-chair",
    "category": "chairs",
    "model": "ÅLHULT",
    "nameEn": "åLhult Chair",
    "nameAr": "كرسي ÅLHULT",
    "descEn": "åLhult Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي ÅLHULT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 31,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-chair-beige-kabusa-light-beige-20581818/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "black"
    ],
    "variants": [
      {
        "variantId": "alhult-chair-beige",
        "colorId": "beige",
        "image": "/images/catalog/alhult-chair/beige.jpg",
        "priceOmr": 31,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-chair-beige-kabusa-light-beige-20581818/"
      },
      {
        "variantId": "alhult-chair-black",
        "colorId": "black",
        "image": "/images/catalog/alhult-chair/black.jpg",
        "priceOmr": 31,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-chair-black-bomstad-black-10600799/"
      }
    ],
    "images": [
      "/images/catalog/alhult-chair/beige.jpg",
      "/images/catalog/alhult-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 17
  },
  {
    "id": "ikea-stockholm-2025-chair",
    "slug": "stockholm-2025-chair",
    "category": "chairs",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Chair",
    "nameAr": "كرسي STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 21,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-dark-brown-leather-40590954/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "leather"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown",
      "oak"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-chair-brown",
        "colorId": "brown",
        "materialId": "leather",
        "image": "/images/catalog/stockholm-2025-chair/brown.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-dark-brown-leather-40590954/"
      },
      {
        "variantId": "stockholm-2025-chair-oak",
        "colorId": "oak",
        "materialId": "leather",
        "image": "/images/catalog/stockholm-2025-chair/oak.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-oak-leather-00590140/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-chair/brown.jpg",
      "/images/catalog/stockholm-2025-chair/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 18
  },
  {
    "id": "ikea-justina-chair-pad",
    "slug": "justina-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "JUSTINA",
    "nameEn": "Justina Chair Pad",
    "nameAr": "وسادة كرسي JUSTINA",
    "descEn": "Justina Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي JUSTINA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 6,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-60175006/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 40,
      "heightCm": 4
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "natural",
      "green"
    ],
    "variants": [
      {
        "variantId": "justina-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/justina-chair-pad/grey.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-60175006/"
      },
      {
        "variantId": "justina-chair-pad-natural",
        "colorId": "natural",
        "image": "/images/catalog/justina-chair-pad/natural.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-natural-90175000/"
      },
      {
        "variantId": "justina-chair-pad-green",
        "colorId": "green",
        "image": "/images/catalog/justina-chair-pad/green.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-light-green-10563546/"
      }
    ],
    "images": [
      "/images/catalog/justina-chair-pad/grey.jpg",
      "/images/catalog/justina-chair-pad/natural.jpg",
      "/images/catalog/justina-chair-pad/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 19
  },
  {
    "id": "ikea-gronsta-chair",
    "slug": "gronsta-chair",
    "category": "chairs",
    "model": "GRÖNSTA",
    "nameEn": "GröNsta Chair",
    "nameAr": "كرسي GRÖNSTA",
    "descEn": "GröNsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي GRÖNSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 53,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-chair-with-armrests-in-outdoor-white-90557886/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "grey"
    ],
    "variants": [
      {
        "variantId": "gronsta-chair-white",
        "colorId": "white",
        "image": "/images/catalog/gronsta-chair/white.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-chair-with-armrests-in-outdoor-white-90557886/"
      },
      {
        "variantId": "gronsta-chair-grey",
        "colorId": "grey",
        "image": "/images/catalog/gronsta-chair/grey.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-chair-with-armrests-in-outdoor-grey-turquoise-20557875/"
      }
    ],
    "images": [
      "/images/catalog/gronsta-chair/white.jpg",
      "/images/catalog/gronsta-chair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 20
  },
  {
    "id": "ikea-ikea-ps-2026-folding-chair",
    "slug": "ikea-ps-2026-folding-chair",
    "category": "chairs",
    "subcategory": "folding-chair",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Folding Chair",
    "nameAr": "كرسي قابل للطي IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Folding Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي قابل للطي IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 19,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-folding-chair-birch-blue-black-red-10617894/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-folding-chair-black",
        "colorId": "black",
        "image": "/images/catalog/ikea-ps-2026-folding-chair/black.jpg",
        "priceOmr": 19,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-folding-chair-birch-blue-black-red-10617894/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-folding-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 21
  },
  {
    "id": "ikea-teodores-chair",
    "slug": "teodores-chair",
    "category": "chairs",
    "model": "TEODORES",
    "nameEn": "Teodores Chair",
    "nameAr": "كرسي TEODORES",
    "descEn": "Teodores Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي TEODORES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 14,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/teodores-chair-white-s99399835/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "teodores-chair-white",
        "colorId": "white",
        "image": "/images/catalog/teodores-chair/white.jpg",
        "priceOmr": 14,
        "sourceUrl": "https://www.ikea.com/om/ar/p/teodores-chair-white-s99399835/"
      }
    ],
    "images": [
      "/images/catalog/teodores-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 22
  },
  {
    "id": "ikea-bramon-chair-pad",
    "slug": "bramon-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "BRÄMÖN",
    "nameEn": "BräMöN Chair Pad",
    "nameAr": "وسادة كرسي BRÄMÖN",
    "descEn": "BräMöN Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي BRÄMÖN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 9,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/braemoen-chair-pad-grey-beige-in-outdoor-30483209/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 34,
      "depthCm": 34,
      "heightCm": 1
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "bramon-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/bramon-chair-pad/grey.jpg",
        "priceOmr": 9,
        "sourceUrl": "https://www.ikea.com/om/ar/p/braemoen-chair-pad-grey-beige-in-outdoor-30483209/"
      }
    ],
    "images": [
      "/images/catalog/bramon-chair-pad/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 23
  },
  {
    "id": "ikea-gavle-armchair",
    "slug": "gavle-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "GÄVLE",
    "nameEn": "GäVle Armchair",
    "nameAr": "كرسي بذراعين GÄVLE",
    "descEn": "GäVle Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين GÄVLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 88,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gaevle-easy-chair-diseroed-grey-60588846/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "red"
    ],
    "variants": [
      {
        "variantId": "gavle-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/gavle-armchair/grey.jpg",
        "priceOmr": 88,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gaevle-easy-chair-diseroed-grey-60588846/"
      },
      {
        "variantId": "gavle-armchair-red",
        "colorId": "red",
        "image": "/images/catalog/gavle-armchair/red.jpg",
        "priceOmr": 88,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gaevle-easy-chair-diseroed-red-30588838/"
      }
    ],
    "images": [
      "/images/catalog/gavle-armchair/grey.jpg",
      "/images/catalog/gavle-armchair/red.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 24
  },
  {
    "id": "ikea-pinntorp-chair",
    "slug": "pinntorp-chair",
    "category": "chairs",
    "model": "PINNTORP",
    "nameEn": "Pinntorp Chair",
    "nameAr": "كرسي PINNTORP",
    "descEn": "Pinntorp Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي PINNTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 21,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-chair-blue-stained-pine-30635175/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural",
      "white",
      "brown"
    ],
    "variants": [
      {
        "variantId": "pinntorp-chair-natural",
        "colorId": "natural",
        "image": "/images/catalog/pinntorp-chair/natural.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-chair-blue-stained-pine-30635175/"
      },
      {
        "variantId": "pinntorp-chair-white",
        "colorId": "white",
        "image": "/images/catalog/pinntorp-chair/white.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-chair-white-stained-pine-90635177/"
      },
      {
        "variantId": "pinntorp-chair-brown",
        "colorId": "brown",
        "image": "/images/catalog/pinntorp-chair/brown.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-chair-light-brown-stained-pine-00590480/"
      }
    ],
    "images": [
      "/images/catalog/pinntorp-chair/natural.jpg",
      "/images/catalog/pinntorp-chair/white.jpg",
      "/images/catalog/pinntorp-chair/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 25
  },
  {
    "id": "ikea-skalsta-chair",
    "slug": "skalsta-chair",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 50,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-grey-green-tubular-metal-black-grey-s29608743/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair/black.jpg",
        "priceOmr": 50,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-grey-green-tubular-metal-black-grey-s29608743/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 26
  },
  {
    "id": "ikea-ektorp-armchair",
    "slug": "ektorp-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "EKTORP",
    "nameEn": "Ektorp Armchair",
    "nameAr": "كرسي بذراعين EKTORP",
    "descEn": "Ektorp Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين EKTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 89,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ektorp-armchair-and-footstool-hakebo-grey-green-s29553873/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "ektorp-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/ektorp-armchair/grey.jpg",
        "gallery": [
          "/images/catalog/ektorp-armchair/grey-1.jpg"
        ],
        "priceOmr": 89,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ektorp-armchair-and-footstool-hakebo-grey-green-s29553873/"
      },
      {
        "variantId": "ektorp-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/ektorp-armchair/beige.jpg",
        "priceOmr": 89,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ektorp-armchair-and-footstool-kilanda-light-beige-s19553864/"
      }
    ],
    "images": [
      "/images/catalog/ektorp-armchair/grey.jpg",
      "/images/catalog/ektorp-armchair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 27
  },
  {
    "id": "ikea-vedbo-armchair",
    "slug": "vedbo-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "VEDBO",
    "nameEn": "Vedbo Armchair",
    "nameAr": "كرسي بذراعين VEDBO",
    "descEn": "Vedbo Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين VEDBO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 97,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vedbo-high-back-armchair-gunnared-dark-grey-10424131/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "vedbo-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/vedbo-armchair/grey.jpg",
        "priceOmr": 97,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vedbo-high-back-armchair-gunnared-dark-grey-10424131/"
      }
    ],
    "images": [
      "/images/catalog/vedbo-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 28
  },
  {
    "id": "ikea-soderhamn-armchair",
    "slug": "soderhamn-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "SÖDERHAMN",
    "nameEn": "SöDerhamn Armchair",
    "nameAr": "كرسي بذراعين SÖDERHAMN",
    "descEn": "SöDerhamn Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين SÖDERHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 120,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-armchair-fridtuna-dark-grey-blue-s39622201/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "soderhamn-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/soderhamn-armchair/grey.jpg",
        "gallery": [
          "/images/catalog/soderhamn-armchair/grey-1.jpg"
        ],
        "priceOmr": 120,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-armchair-fridtuna-dark-grey-blue-s39622201/"
      },
      {
        "variantId": "soderhamn-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/soderhamn-armchair/beige.jpg",
        "priceOmr": 120,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-armchair-kelinge-beige-s19622198/"
      }
    ],
    "images": [
      "/images/catalog/soderhamn-armchair/grey.jpg",
      "/images/catalog/soderhamn-armchair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 29
  },
  {
    "id": "ikea-frosvi-folding-chair",
    "slug": "frosvi-folding-chair",
    "category": "chairs",
    "subcategory": "folding-chair",
    "model": "FRÖSVI",
    "nameEn": "FröSvi Folding Chair",
    "nameAr": "كرسي قابل للطي FRÖSVI",
    "descEn": "FröSvi Folding Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي قابل للطي FRÖSVI — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 17,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/froesvi-folding-chair-black-10534318/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "white",
      "natural"
    ],
    "variants": [
      {
        "variantId": "frosvi-folding-chair-black",
        "colorId": "black",
        "image": "/images/catalog/frosvi-folding-chair/black.jpg",
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froesvi-folding-chair-black-10534318/"
      },
      {
        "variantId": "frosvi-folding-chair-white",
        "colorId": "white",
        "image": "/images/catalog/frosvi-folding-chair/white.jpg",
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froesvi-folding-chair-white-80534329/"
      },
      {
        "variantId": "frosvi-folding-chair-natural",
        "colorId": "natural",
        "image": "/images/catalog/frosvi-folding-chair/natural.jpg",
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froesvi-folding-chair-beech-70534315/"
      }
    ],
    "images": [
      "/images/catalog/frosvi-folding-chair/black.jpg",
      "/images/catalog/frosvi-folding-chair/white.jpg",
      "/images/catalog/frosvi-folding-chair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 30
  },
  {
    "id": "ikea-teodores-chair-2",
    "slug": "teodores-chair-2",
    "category": "chairs",
    "model": "TEODORES",
    "nameEn": "Teodores Chair",
    "nameAr": "كرسي TEODORES",
    "descEn": "Teodores Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي TEODORES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 29,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/teodores-chair-white-s19399839/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "teodores-chair-2-white",
        "colorId": "white",
        "image": "/images/catalog/teodores-chair-2/white.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/teodores-chair-white-s19399839/"
      }
    ],
    "images": [
      "/images/catalog/teodores-chair-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 31
  },
  {
    "id": "ikea-bergmund-chair",
    "slug": "bergmund-chair",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 41,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-black-gunnared-medium-grey-s69384307/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-black",
        "colorId": "black",
        "image": "/images/catalog/bergmund-chair/black.jpg",
        "gallery": [
          "/images/catalog/bergmund-chair/black-1.jpg"
        ],
        "priceOmr": 41,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-black-gunnared-medium-grey-s69384307/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 32
  },
  {
    "id": "ikea-stockholm-2025-armchair",
    "slug": "stockholm-2025-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Armchair",
    "nameAr": "كرسي بذراعين STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 133,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-armchair-djurmo-grey-white-20594750/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-armchair-white",
        "colorId": "white",
        "image": "/images/catalog/stockholm-2025-armchair/white.jpg",
        "priceOmr": 133,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-armchair-djurmo-grey-white-20594750/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-armchair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 33
  },
  {
    "id": "ikea-buskbo-armchair",
    "slug": "buskbo-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "BUSKBO",
    "nameEn": "Buskbo Armchair",
    "nameAr": "كرسي بذراعين BUSKBO",
    "descEn": "Buskbo Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين BUSKBO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/buskbo-armchair-rattan-djupvik-white-s79299016/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "buskbo-armchair-white",
        "colorId": "white",
        "materialId": "rattan",
        "image": "/images/catalog/buskbo-armchair/white.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/buskbo-armchair-rattan-djupvik-white-s79299016/"
      }
    ],
    "images": [
      "/images/catalog/buskbo-armchair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 34
  },
  {
    "id": "ikea-ismantorp-armchair",
    "slug": "ismantorp-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "ISMANTORP",
    "nameEn": "Ismantorp Armchair",
    "nameAr": "كرسي بذراعين ISMANTORP",
    "descEn": "Ismantorp Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين ISMANTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 175,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ismantorp-armchair-metal-black-blue-tibbleby-beige-grey-40598224/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "grey"
    ],
    "variants": [
      {
        "variantId": "ismantorp-armchair-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/ismantorp-armchair/black.jpg",
        "priceOmr": 175,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ismantorp-armchair-metal-black-blue-tibbleby-beige-grey-40598224/"
      },
      {
        "variantId": "ismantorp-armchair-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/ismantorp-armchair/grey.jpg",
        "priceOmr": 175,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ismantorp-armchair-metal-light-grey-beige-tibbleby-light-beige-00598221/"
      }
    ],
    "images": [
      "/images/catalog/ismantorp-armchair/black.jpg",
      "/images/catalog/ismantorp-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 35
  },
  {
    "id": "ikea-skansnas-chair",
    "slug": "skansnas-chair",
    "category": "chairs",
    "model": "SKANSNÄS",
    "nameEn": "SkansnäS Chair",
    "nameAr": "كرسي SKANSNÄS",
    "descEn": "SkansnäS Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKANSNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 49,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skansnaes-chair-brown-beech-70563242/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "skansnas-chair-brown",
        "colorId": "brown",
        "image": "/images/catalog/skansnas-chair/brown.jpg",
        "priceOmr": 49,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skansnaes-chair-brown-beech-70563242/"
      }
    ],
    "images": [
      "/images/catalog/skansnas-chair/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 36
  },
  {
    "id": "ikea-vippart-chair-pad",
    "slug": "vippart-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "VIPPÄRT",
    "nameEn": "VippäRt Chair Pad",
    "nameAr": "وسادة كرسي VIPPÄRT",
    "descEn": "VippäRt Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي VIPPÄRT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 12,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vippaert-chair-pad-dark-grey-90612166/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 40,
      "heightCm": 38
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "vippart-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/vippart-chair-pad/grey.jpg",
        "priceOmr": 12,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vippaert-chair-pad-dark-grey-90612166/"
      },
      {
        "variantId": "vippart-chair-pad-beige",
        "colorId": "beige",
        "image": "/images/catalog/vippart-chair-pad/beige.jpg",
        "priceOmr": 12,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vippaert-chair-pad-beige-00612161/"
      }
    ],
    "images": [
      "/images/catalog/vippart-chair-pad/grey.jpg",
      "/images/catalog/vippart-chair-pad/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 37
  },
  {
    "id": "ikea-justina-chair-pad-2",
    "slug": "justina-chair-pad-2",
    "category": "decor",
    "subcategory": "cushion",
    "model": "JUSTINA",
    "nameEn": "Justina Chair Pad",
    "nameAr": "وسادة كرسي JUSTINA",
    "descEn": "Justina Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي JUSTINA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 11,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-s09502813/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 40,
      "heightCm": 4
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "natural"
    ],
    "variants": [
      {
        "variantId": "justina-chair-pad-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/justina-chair-pad-2/grey.jpg",
        "priceOmr": 11,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-s09502813/"
      },
      {
        "variantId": "justina-chair-pad-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/justina-chair-pad-2/natural.jpg",
        "priceOmr": 11,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-natural-s49503212/"
      }
    ],
    "images": [
      "/images/catalog/justina-chair-pad-2/grey.jpg",
      "/images/catalog/justina-chair-pad-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 38
  },
  {
    "id": "ikea-stockholm-2025-chair-2",
    "slug": "stockholm-2025-chair-2",
    "category": "chairs",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Chair",
    "nameAr": "كرسي STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 30,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-oak-rattan-60590142/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-chair-2-oak",
        "colorId": "oak",
        "materialId": "rattan",
        "image": "/images/catalog/stockholm-2025-chair-2/oak.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-oak-rattan-60590142/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-chair-2/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 39
  },
  {
    "id": "ikea-poang-armchair",
    "slug": "poang-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 87,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-dark-green-kelinge-beige-s79625014/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "green",
      "grey"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair/beige.jpg",
        "priceOmr": 87,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-dark-green-kelinge-beige-s79625014/"
      },
      {
        "variantId": "poang-armchair-green",
        "colorId": "green",
        "image": "/images/catalog/poang-armchair/green.jpg",
        "priceOmr": 87,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-dark-green-kelinge-dark-yellow-s59625010/"
      },
      {
        "variantId": "poang-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/poang-armchair/grey.jpg",
        "priceOmr": 87,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-dark-green-gunnared-dark-grey-s79625033/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair/beige.jpg",
      "/images/catalog/poang-armchair/green.jpg",
      "/images/catalog/poang-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 40
  },
  {
    "id": "ikea-lillehem-armchair",
    "slug": "lillehem-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "LILLEHEM",
    "nameEn": "Lillehem Armchair",
    "nameAr": "كرسي بذراعين LILLEHEM",
    "descEn": "Lillehem Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين LILLEHEM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 104,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lillehem-armchair-gunnared-dark-grey-wood-s79470309/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "brown"
    ],
    "variants": [
      {
        "variantId": "lillehem-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/lillehem-armchair/grey.jpg",
        "priceOmr": 104,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lillehem-armchair-gunnared-dark-grey-wood-s79470309/"
      },
      {
        "variantId": "lillehem-armchair-brown",
        "colorId": "brown",
        "image": "/images/catalog/lillehem-armchair/brown.jpg",
        "gallery": [
          "/images/catalog/lillehem-armchair/brown-1.jpg"
        ],
        "priceOmr": 104,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lillehem-armchair-gunnared-brown-red-wood-s49470297/"
      }
    ],
    "images": [
      "/images/catalog/lillehem-armchair/grey.jpg",
      "/images/catalog/lillehem-armchair/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 41
  },
  {
    "id": "ikea-ikea-ps-2026-chair",
    "slug": "ikea-ps-2026-chair",
    "category": "chairs",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Chair",
    "nameAr": "كرسي IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 38,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bright-blue-knaebaeck-bright-blue-20617879/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "blue",
      "green"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-chair-blue",
        "colorId": "blue",
        "image": "/images/catalog/ikea-ps-2026-chair/blue.jpg",
        "priceOmr": 38,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bright-blue-knaebaeck-bright-blue-20617879/"
      },
      {
        "variantId": "ikea-ps-2026-chair-green",
        "colorId": "green",
        "image": "/images/catalog/ikea-ps-2026-chair/green.jpg",
        "priceOmr": 38,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bright-green-knaebaeck-bright-green-50617967/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-chair/blue.jpg",
      "/images/catalog/ikea-ps-2026-chair/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 42
  },
  {
    "id": "ikea-stockholm-2025-armchair-2",
    "slug": "stockholm-2025-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Armchair",
    "nameAr": "كرسي بذراعين STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 101,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-easy-chair-birch-veneer-80594785/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-armchair-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/stockholm-2025-armchair-2/natural.jpg",
        "priceOmr": 101,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-easy-chair-birch-veneer-80594785/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-armchair-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 43
  },
  {
    "id": "ikea-lillesater-armchair",
    "slug": "lillesater-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "LILLESÄTER",
    "nameEn": "LillesäTer Armchair",
    "nameAr": "كرسي بذراعين LILLESÄTER",
    "descEn": "LillesäTer Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين LILLESÄTER — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 54,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lillesaeter-swivel-easy-chair-gunnared-dark-blue-10618488/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "blue",
      "ivory"
    ],
    "variants": [
      {
        "variantId": "lillesater-armchair-blue",
        "colorId": "blue",
        "image": "/images/catalog/lillesater-armchair/blue.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lillesaeter-swivel-easy-chair-gunnared-dark-blue-10618488/"
      },
      {
        "variantId": "lillesater-armchair-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/lillesater-armchair/ivory.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lillesaeter-swivel-easy-chair-axvall-off-white-00618686/"
      }
    ],
    "images": [
      "/images/catalog/lillesater-armchair/blue.jpg",
      "/images/catalog/lillesater-armchair/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 44
  },
  {
    "id": "ikea-voxlov-chair",
    "slug": "voxlov-chair",
    "category": "chairs",
    "model": "VOXLÖV",
    "nameEn": "VoxlöV Chair",
    "nameAr": "كرسي VOXLÖV",
    "descEn": "VoxlöV Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي VOXLÖV — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/voxloev-chair-light-bamboo-50450236/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "voxlov-chair-natural",
        "colorId": "natural",
        "materialId": "rattan",
        "image": "/images/catalog/voxlov-chair/natural.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/voxloev-chair-light-bamboo-50450236/"
      }
    ],
    "images": [
      "/images/catalog/voxlov-chair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 45
  },
  {
    "id": "ikea-djupvik-chair-pad",
    "slug": "djupvik-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "DJUPVIK",
    "nameEn": "Djupvik Chair Pad",
    "nameAr": "وسادة كرسي DJUPVIK",
    "descEn": "Djupvik Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي DJUPVIK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 11,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/djupvik-cushion-blekinge-white-30204798/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 54,
      "depthCm": 54,
      "heightCm": 5
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "djupvik-chair-pad-white",
        "colorId": "white",
        "image": "/images/catalog/djupvik-chair-pad/white.jpg",
        "priceOmr": 11,
        "sourceUrl": "https://www.ikea.com/om/ar/p/djupvik-cushion-blekinge-white-30204798/"
      }
    ],
    "images": [
      "/images/catalog/djupvik-chair-pad/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 46
  },
  {
    "id": "ikea-baltsar-chair",
    "slug": "baltsar-chair",
    "category": "chairs",
    "model": "BALTSAR",
    "nameEn": "Baltsar Chair",
    "nameAr": "كرسي BALTSAR",
    "descEn": "Baltsar Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي BALTSAR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 54,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/baltsar-chair-white-50532143/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "baltsar-chair-white",
        "colorId": "white",
        "image": "/images/catalog/baltsar-chair/white.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/baltsar-chair-white-50532143/"
      },
      {
        "variantId": "baltsar-chair-black",
        "colorId": "black",
        "image": "/images/catalog/baltsar-chair/black.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/baltsar-chair-black-50532138/"
      }
    ],
    "images": [
      "/images/catalog/baltsar-chair/white.jpg",
      "/images/catalog/baltsar-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 47
  },
  {
    "id": "ikea-skalsta-chair-2",
    "slug": "skalsta-chair-2",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 41,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-dark-grey-tubular-metal-light-grey-beige-s69608473/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-2-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-2/grey.jpg",
        "priceOmr": 41,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-dark-grey-tubular-metal-light-grey-beige-s69608473/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 48
  },
  {
    "id": "ikea-odger-chair",
    "slug": "odger-chair",
    "category": "chairs",
    "model": "ODGER",
    "nameEn": "Odger Chair",
    "nameAr": "كرسي ODGER",
    "descEn": "Odger Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي ODGER — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 24,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/odger-chair-anthracite-50457313/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "charcoal",
      "red"
    ],
    "variants": [
      {
        "variantId": "odger-chair-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/odger-chair/charcoal.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/odger-chair-anthracite-50457313/"
      },
      {
        "variantId": "odger-chair-red",
        "colorId": "red",
        "image": "/images/catalog/odger-chair/red.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/odger-chair-red-70516552/"
      }
    ],
    "images": [
      "/images/catalog/odger-chair/charcoal.jpg",
      "/images/catalog/odger-chair/red.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 49
  },
  {
    "id": "ikea-yngvar-bar-stool",
    "slug": "yngvar-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "YNGVAR",
    "nameEn": "Yngvar Bar Stool",
    "nameAr": "كرسي بار YNGVAR",
    "descEn": "Yngvar Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بار YNGVAR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 32,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/yngvar-bar-stool-anthracite-60400745/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 75,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "yngvar-bar-stool-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/yngvar-bar-stool/charcoal.jpg",
        "priceOmr": 32,
        "sourceUrl": "https://www.ikea.com/om/ar/p/yngvar-bar-stool-anthracite-60400745/"
      }
    ],
    "images": [
      "/images/catalog/yngvar-bar-stool/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 50
  },
  {
    "id": "ikea-glenn-bar-stool",
    "slug": "glenn-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "GLENN",
    "nameEn": "Glenn Bar Stool",
    "nameAr": "كرسي بار GLENN",
    "descEn": "Glenn Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بار GLENN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 53,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/glenn-bar-stool-counter-height-white-chrome-plated-60131734/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 66,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "glenn-bar-stool-white",
        "colorId": "white",
        "materialId": "metal",
        "image": "/images/catalog/glenn-bar-stool/white.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/glenn-bar-stool-counter-height-white-chrome-plated-60131734/"
      }
    ],
    "images": [
      "/images/catalog/glenn-bar-stool/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 51
  },
  {
    "id": "ikea-lisabo-chair",
    "slug": "lisabo-chair",
    "category": "chairs",
    "model": "LISABO",
    "nameEn": "Lisabo Chair",
    "nameAr": "كرسي LISABO",
    "descEn": "Lisabo Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي LISABO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 17,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-chair-ash-00457235/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "ash"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "lisabo-chair-natural",
        "colorId": "natural",
        "materialId": "ash",
        "image": "/images/catalog/lisabo-chair/natural.jpg",
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-chair-ash-00457235/"
      }
    ],
    "images": [
      "/images/catalog/lisabo-chair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 52
  },
  {
    "id": "ikea-skalsta-chair-3",
    "slug": "skalsta-chair-3",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 36,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-dark-grey-tubular-metal-black-grey-s19590772/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-3-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-3/black.jpg",
        "priceOmr": 36,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-dark-grey-tubular-metal-black-grey-s19590772/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-3/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 53
  },
  {
    "id": "ikea-bergmund-chair-2",
    "slug": "bergmund-chair-2",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 32,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-black-gunnared-medium-grey-s79481586/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-2-black",
        "colorId": "black",
        "image": "/images/catalog/bergmund-chair-2/black.jpg",
        "priceOmr": 32,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-black-gunnared-medium-grey-s79481586/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair-2/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 54
  },
  {
    "id": "ikea-bergmund-chair-3",
    "slug": "bergmund-chair-3",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 37,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-oak-effect-orrsta-light-grey-s99387738/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-3-grey",
        "colorId": "grey",
        "materialId": "oak",
        "image": "/images/catalog/bergmund-chair-3/grey.jpg",
        "gallery": [
          "/images/catalog/bergmund-chair-3/grey-1.jpg"
        ],
        "priceOmr": 37,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-oak-effect-orrsta-light-grey-s99387738/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 55
  },
  {
    "id": "ikea-stockholm-2025-chair-3",
    "slug": "stockholm-2025-chair-3",
    "category": "chairs",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Chair",
    "nameAr": "كرسي STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 35,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-red-40590138/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "red",
      "brown"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-chair-3-red",
        "colorId": "red",
        "image": "/images/catalog/stockholm-2025-chair-3/red.jpg",
        "priceOmr": 35,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-red-40590138/"
      },
      {
        "variantId": "stockholm-2025-chair-3-brown",
        "colorId": "brown",
        "image": "/images/catalog/stockholm-2025-chair-3/brown.jpg",
        "priceOmr": 35,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-chair-dark-brown-20590139/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-chair-3/red.jpg",
      "/images/catalog/stockholm-2025-chair-3/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 56
  },
  {
    "id": "ikea-skalsta-chair-4",
    "slug": "skalsta-chair-4",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 31,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-beige-tubular-metal-light-grey-beige-s89608740/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-4-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-4/grey.jpg",
        "priceOmr": 31,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-beige-tubular-metal-light-grey-beige-s89608740/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-4/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 57
  },
  {
    "id": "ikea-janinge-bar-stool",
    "slug": "janinge-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "JANINGE",
    "nameEn": "Janinge Bar Stool",
    "nameAr": "كرسي بار JANINGE",
    "descEn": "Janinge Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بار JANINGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 25,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/janinge-bar-stool-white-70246089/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 76,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "grey"
    ],
    "variants": [
      {
        "variantId": "janinge-bar-stool-white",
        "colorId": "white",
        "image": "/images/catalog/janinge-bar-stool/white.jpg",
        "priceOmr": 25,
        "sourceUrl": "https://www.ikea.com/om/ar/p/janinge-bar-stool-white-70246089/"
      },
      {
        "variantId": "janinge-bar-stool-grey",
        "colorId": "grey",
        "image": "/images/catalog/janinge-bar-stool/grey.jpg",
        "priceOmr": 25,
        "sourceUrl": "https://www.ikea.com/om/ar/p/janinge-bar-stool-grey-10281354/"
      }
    ],
    "images": [
      "/images/catalog/janinge-bar-stool/white.jpg",
      "/images/catalog/janinge-bar-stool/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 58
  },
  {
    "id": "ikea-poang-armchair-2",
    "slug": "poang-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-walnut-effect-kelinge-dark-yellow-s69625463/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "walnut"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-2-walnut",
        "colorId": "walnut",
        "materialId": "walnut",
        "image": "/images/catalog/poang-armchair-2/walnut.jpg",
        "gallery": [
          "/images/catalog/poang-armchair-2/walnut-1.jpg",
          "/images/catalog/poang-armchair-2/walnut-2.jpg"
        ],
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-walnut-effect-kelinge-dark-yellow-s69625463/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-2/walnut.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 59
  },
  {
    "id": "ikea-poang-armchair-3",
    "slug": "poang-armchair-3",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 135,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-frame-birch-veneer-80418056/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-3-natural",
        "colorId": "natural",
        "image": "/images/catalog/poang-armchair-3/natural.jpg",
        "priceOmr": 135,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-frame-birch-veneer-80418056/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-3/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 60
  },
  {
    "id": "ikea-skalsta-chair-5",
    "slug": "skalsta-chair-5",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-plastic-beige-tubular-metal-light-grey-beige-s99590768/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-5-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-5/grey.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-plastic-beige-tubular-metal-light-grey-beige-s99590768/"
      },
      {
        "variantId": "skalsta-chair-5-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-5/black.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-plastic-beige-tubular-metal-black-grey-s29608427/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-5/grey.jpg",
      "/images/catalog/skalsta-chair-5/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 61
  },
  {
    "id": "ikea-poang-armchair-4",
    "slug": "poang-armchair-4",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 79,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-birch-veneer-kelinge-dark-yellow-s49617713/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural",
      "beige",
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-4-natural",
        "colorId": "natural",
        "image": "/images/catalog/poang-armchair-4/natural.jpg",
        "priceOmr": 79,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-birch-veneer-kelinge-dark-yellow-s49617713/"
      },
      {
        "variantId": "poang-armchair-4-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair-4/beige.jpg",
        "priceOmr": 79,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-birch-veneer-kelinge-beige-s19625012/"
      },
      {
        "variantId": "poang-armchair-4-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/poang-armchair-4/charcoal.jpg",
        "priceOmr": 79,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-birch-veneer-hillared-anthracite-s19197775/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-4/natural.jpg",
      "/images/catalog/poang-armchair-4/beige.jpg",
      "/images/catalog/poang-armchair-4/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 62
  },
  {
    "id": "ikea-skalsta-chair-6",
    "slug": "skalsta-chair-6",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 21,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-oak-veneer-tubular-metal-light-grey-beige-s79608745/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-6-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-6/grey.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-oak-veneer-tubular-metal-light-grey-beige-s79608745/"
      },
      {
        "variantId": "skalsta-chair-6-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-6/black.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-oak-veneer-tubular-metal-black-grey-s09608744/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-6/grey.jpg",
      "/images/catalog/skalsta-chair-6/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 63
  },
  {
    "id": "ikea-vattenmott-chair-pad",
    "slug": "vattenmott-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "VATTENMOTT",
    "nameEn": "Vattenmott Chair Pad",
    "nameAr": "وسادة كرسي VATTENMOTT",
    "descEn": "Vattenmott Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي VATTENMOTT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 10,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vattenmott-chair-cushion-beige-50573015/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 38,
      "heightCm": 5
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "vattenmott-chair-pad-beige",
        "colorId": "beige",
        "image": "/images/catalog/vattenmott-chair-pad/beige.jpg",
        "priceOmr": 10,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vattenmott-chair-cushion-beige-50573015/"
      }
    ],
    "images": [
      "/images/catalog/vattenmott-chair-pad/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 64
  },
  {
    "id": "ikea-skalsta-chair-7",
    "slug": "skalsta-chair-7",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 20,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-plastic-red-tubular-metal-black-grey-s29608465/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-7-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-7/black.jpg",
        "priceOmr": 20,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-plastic-red-tubular-metal-black-grey-s29608465/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-7/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 65
  },
  {
    "id": "ikea-skalsta-chair-8",
    "slug": "skalsta-chair-8",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 15,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-beige-tubular-metal-black-grey-s09608739/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-8-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-8/black.jpg",
        "priceOmr": 15,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-knaebaeck-beige-tubular-metal-black-grey-s09608739/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-8/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 66
  },
  {
    "id": "ikea-lillanas-chair",
    "slug": "lillanas-chair",
    "category": "chairs",
    "model": "LILLÅNÄS",
    "nameEn": "LillåNäS Chair",
    "nameAr": "كرسي LILLÅNÄS",
    "descEn": "LillåNäS Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي LILLÅNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 17,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lillanaes-chair-chrome-plated-gunnared-dark-grey-80534758/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lillanas-chair-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/lillanas-chair/grey.jpg",
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lillanaes-chair-chrome-plated-gunnared-dark-grey-80534758/"
      }
    ],
    "images": [
      "/images/catalog/lillanas-chair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 67
  },
  {
    "id": "ikea-skalsta-chair-9",
    "slug": "skalsta-chair-9",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 52,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-oak-veneer-30611669/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "oak",
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "oak",
      "walnut"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-9-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/skalsta-chair-9/oak.jpg",
        "priceOmr": 52,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-oak-veneer-30611669/"
      },
      {
        "variantId": "skalsta-chair-9-walnut",
        "colorId": "walnut",
        "materialId": "walnut",
        "image": "/images/catalog/skalsta-chair-9/walnut.jpg",
        "priceOmr": 52,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-walnut-veneer-90611671/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-9/oak.jpg",
      "/images/catalog/skalsta-chair-9/walnut.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 68
  },
  {
    "id": "ikea-tullsta-armchair",
    "slug": "tullsta-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "TULLSTA",
    "nameEn": "Tullsta Armchair",
    "nameAr": "كرسي بذراعين TULLSTA",
    "descEn": "Tullsta Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين TULLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 174,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tullsta-armchair-nordvalla-medium-grey-s59284662/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "tullsta-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/tullsta-armchair/grey.jpg",
        "priceOmr": 174,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tullsta-armchair-nordvalla-medium-grey-s59284662/"
      },
      {
        "variantId": "tullsta-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/tullsta-armchair/beige.jpg",
        "priceOmr": 174,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tullsta-armchair-lofallet-beige-s29272712/"
      }
    ],
    "images": [
      "/images/catalog/tullsta-armchair/grey.jpg",
      "/images/catalog/tullsta-armchair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 69
  },
  {
    "id": "ikea-yngvar-chair",
    "slug": "yngvar-chair",
    "category": "chairs",
    "model": "YNGVAR",
    "nameEn": "Yngvar Chair",
    "nameAr": "كرسي YNGVAR",
    "descEn": "Yngvar Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي YNGVAR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 30,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/yngvar-chair-anthracite-80417636/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "yngvar-chair-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/yngvar-chair/charcoal.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/yngvar-chair-anthracite-80417636/"
      }
    ],
    "images": [
      "/images/catalog/yngvar-chair/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 70
  },
  {
    "id": "ikea-ikea-ps-2026-bed-frame",
    "slug": "ikea-ps-2026-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Bed Frame",
    "nameAr": "هيكل سرير IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "هيكل سرير IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 136,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bed-skiftebo-bright-orange-60620375/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "orange",
      "grey"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-bed-frame-orange",
        "colorId": "orange",
        "image": "/images/catalog/ikea-ps-2026-bed-frame/orange.jpg",
        "priceOmr": 136,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bed-skiftebo-bright-orange-60620375/"
      },
      {
        "variantId": "ikea-ps-2026-bed-frame-grey",
        "colorId": "grey",
        "image": "/images/catalog/ikea-ps-2026-bed-frame/grey.jpg",
        "priceOmr": 136,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bed-skiftebo-light-grey-beige-00620359/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-bed-frame/orange.jpg",
      "/images/catalog/ikea-ps-2026-bed-frame/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 71
  },
  {
    "id": "ikea-kullaberg-stool",
    "slug": "kullaberg-stool",
    "category": "chairs",
    "subcategory": "stool",
    "model": "KULLABERG",
    "nameEn": "Kullaberg Stool",
    "nameAr": "كرسي بدون ظهر KULLABERG",
    "descEn": "Kullaberg Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بدون ظهر KULLABERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 10,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kullaberg-stool-pine-black-10363651/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "kullaberg-stool-black",
        "colorId": "black",
        "image": "/images/catalog/kullaberg-stool/black.jpg",
        "priceOmr": 10,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kullaberg-stool-pine-black-10363651/"
      }
    ],
    "images": [
      "/images/catalog/kullaberg-stool/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 72
  },
  {
    "id": "ikea-angsfraken-chair-pad",
    "slug": "angsfraken-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "ÄNGSFRÄKEN",
    "nameEn": "äNgsfräKen Chair Pad",
    "nameAr": "وسادة كرسي ÄNGSFRÄKEN",
    "descEn": "äNgsfräKen Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي ÄNGSFRÄKEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 14,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/aengsfraeken-chair-pad-brown-red-in-outdoor-80624754/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 40,
      "heightCm": 36
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown",
      "beige",
      "blue"
    ],
    "variants": [
      {
        "variantId": "angsfraken-chair-pad-brown",
        "colorId": "brown",
        "image": "/images/catalog/angsfraken-chair-pad/brown.jpg",
        "priceOmr": 14,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aengsfraeken-chair-pad-brown-red-in-outdoor-80624754/"
      },
      {
        "variantId": "angsfraken-chair-pad-beige",
        "colorId": "beige",
        "image": "/images/catalog/angsfraken-chair-pad/beige.jpg",
        "priceOmr": 14,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aengsfraeken-chair-pad-dark-beige-in-outdoor-80624749/"
      },
      {
        "variantId": "angsfraken-chair-pad-blue",
        "colorId": "blue",
        "image": "/images/catalog/angsfraken-chair-pad/blue.jpg",
        "priceOmr": 14,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aengsfraeken-chair-pad-blue-in-outdoor-70624759/"
      }
    ],
    "images": [
      "/images/catalog/angsfraken-chair-pad/brown.jpg",
      "/images/catalog/angsfraken-chair-pad/beige.jpg",
      "/images/catalog/angsfraken-chair-pad/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 73
  },
  {
    "id": "ikea-holmsta-armchair",
    "slug": "holmsta-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "HOLMSTA",
    "nameEn": "Holmsta Armchair",
    "nameAr": "كرسي بذراعين HOLMSTA",
    "descEn": "Holmsta Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين HOLMSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 145,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/holmsta-armchair-handmade-beige-90508551/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "holmsta-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/holmsta-armchair/beige.jpg",
        "priceOmr": 145,
        "sourceUrl": "https://www.ikea.com/om/ar/p/holmsta-armchair-handmade-beige-90508551/"
      }
    ],
    "images": [
      "/images/catalog/holmsta-armchair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 74
  },
  {
    "id": "ikea-oskarshamn-armchair",
    "slug": "oskarshamn-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "OSKARSHAMN",
    "nameEn": "Oskarshamn Armchair",
    "nameAr": "كرسي بذراعين OSKARSHAMN",
    "descEn": "Oskarshamn Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين OSKARSHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 57,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-with-footstool-tibbleby-beige-grey-s99485343/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black",
      "red"
    ],
    "variants": [
      {
        "variantId": "oskarshamn-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/oskarshamn-armchair/grey.jpg",
        "priceOmr": 57,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-with-footstool-tibbleby-beige-grey-s99485343/"
      },
      {
        "variantId": "oskarshamn-armchair-black",
        "colorId": "black",
        "image": "/images/catalog/oskarshamn-armchair/black.jpg",
        "priceOmr": 57,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-with-footstool-gunnared-black-grey-s09485333/"
      },
      {
        "variantId": "oskarshamn-armchair-red",
        "colorId": "red",
        "image": "/images/catalog/oskarshamn-armchair/red.jpg",
        "priceOmr": 57,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-with-footstool-tonerud-red-s99485338/"
      }
    ],
    "images": [
      "/images/catalog/oskarshamn-armchair/grey.jpg",
      "/images/catalog/oskarshamn-armchair/black.jpg",
      "/images/catalog/oskarshamn-armchair/red.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 75
  },
  {
    "id": "ikea-brannboll-armchair",
    "slug": "brannboll-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "BRÄNNBOLL",
    "nameEn": "BräNnboll Armchair",
    "nameAr": "كرسي بذراعين BRÄNNBOLL",
    "descEn": "BräNnboll Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين BRÄNNBOLL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 143,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-gaming-easy-chair-grey-bright-yellow-60586338/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black"
    ],
    "variants": [
      {
        "variantId": "brannboll-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/brannboll-armchair/grey.jpg",
        "priceOmr": 143,
        "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-gaming-easy-chair-grey-bright-yellow-60586338/"
      },
      {
        "variantId": "brannboll-armchair-black",
        "colorId": "black",
        "image": "/images/catalog/brannboll-armchair/black.jpg",
        "priceOmr": 143,
        "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-gaming-easy-chair-grey-black-00586336/"
      }
    ],
    "images": [
      "/images/catalog/brannboll-armchair/grey.jpg",
      "/images/catalog/brannboll-armchair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 76
  },
  {
    "id": "ikea-frosvi-folding-chair-2",
    "slug": "frosvi-folding-chair-2",
    "category": "chairs",
    "subcategory": "folding-chair",
    "model": "FRÖSVI",
    "nameEn": "FröSvi Folding Chair",
    "nameAr": "كرسي قابل للطي FRÖSVI",
    "descEn": "FröSvi Folding Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي قابل للطي FRÖSVI — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 12,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/froesvi-folding-chair-white-knisa-light-grey-20534332/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "frosvi-folding-chair-2-white",
        "colorId": "white",
        "image": "/images/catalog/frosvi-folding-chair-2/white.jpg",
        "priceOmr": 12,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froesvi-folding-chair-white-knisa-light-grey-20534332/"
      }
    ],
    "images": [
      "/images/catalog/frosvi-folding-chair-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 77
  },
  {
    "id": "ikea-tornsborg-sofa-bed",
    "slug": "tornsborg-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "TORNSBORG",
    "nameEn": "Tornsborg Sofa-bed",
    "nameAr": "كنبة سرير TORNSBORG",
    "descEn": "Tornsborg Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير TORNSBORG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 528,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-2-seat-sofa-bed-naggen-beige-pine-90584658/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tornsborg-sofa-bed-beige",
        "colorId": "beige",
        "image": "/images/catalog/tornsborg-sofa-bed/beige.jpg",
        "priceOmr": 528,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-2-seat-sofa-bed-naggen-beige-pine-90584658/"
      }
    ],
    "images": [
      "/images/catalog/tornsborg-sofa-bed/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 78
  },
  {
    "id": "ikea-baltsar-chair-2",
    "slug": "baltsar-chair-2",
    "category": "chairs",
    "model": "BALTSAR",
    "nameEn": "Baltsar Chair",
    "nameAr": "كرسي BALTSAR",
    "descEn": "Baltsar Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي BALTSAR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 43,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/baltsar-swivel-chair-white-10511538/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "baltsar-chair-2-white",
        "colorId": "white",
        "image": "/images/catalog/baltsar-chair-2/white.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/baltsar-swivel-chair-white-10511538/"
      },
      {
        "variantId": "baltsar-chair-2-black",
        "colorId": "black",
        "image": "/images/catalog/baltsar-chair-2/black.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/baltsar-swivel-chair-black-80521242/"
      }
    ],
    "images": [
      "/images/catalog/baltsar-chair-2/white.jpg",
      "/images/catalog/baltsar-chair-2/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 79
  },
  {
    "id": "ikea-persbol-armchair",
    "slug": "persbol-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "PERSBOL",
    "nameEn": "Persbol Armchair",
    "nameAr": "كرسي بذراعين PERSBOL",
    "descEn": "Persbol Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين PERSBOL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 90,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/persbol-armchair-brown-red-tibbleby-beige-grey-70525919/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black"
    ],
    "variants": [
      {
        "variantId": "persbol-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/persbol-armchair/grey.jpg",
        "gallery": [
          "/images/catalog/persbol-armchair/grey-1.jpg"
        ],
        "priceOmr": 90,
        "sourceUrl": "https://www.ikea.com/om/ar/p/persbol-armchair-brown-red-tibbleby-beige-grey-70525919/"
      },
      {
        "variantId": "persbol-armchair-black",
        "colorId": "black",
        "image": "/images/catalog/persbol-armchair/black.jpg",
        "priceOmr": 90,
        "sourceUrl": "https://www.ikea.com/om/ar/p/persbol-armchair-black-tibbleby-beige-grey-50525920/"
      }
    ],
    "images": [
      "/images/catalog/persbol-armchair/grey.jpg",
      "/images/catalog/persbol-armchair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 80
  },
  {
    "id": "ikea-bergmund-bar-stool",
    "slug": "bergmund-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "BERGMUND",
    "nameEn": "Bergmund Bar Stool",
    "nameAr": "كرسي بار BERGMUND",
    "descEn": "Bergmund Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بار BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 31,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-cover-for-bar-stool-with-backrest-gunnared-medium-grey-70481091/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 95,
      "seatHeightCm": 74
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "bergmund-bar-stool-grey",
        "colorId": "grey",
        "image": "/images/catalog/bergmund-bar-stool/grey.jpg",
        "priceOmr": 31,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-cover-for-bar-stool-with-backrest-gunnared-medium-grey-70481091/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-bar-stool/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 81
  },
  {
    "id": "ikea-vedbo-armchair-2",
    "slug": "vedbo-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "VEDBO",
    "nameEn": "Vedbo Armchair",
    "nameAr": "كرسي بذراعين VEDBO",
    "descEn": "Vedbo Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين VEDBO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 61,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vedbo-armchair-gunnared-dark-grey-10424126/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "brown"
    ],
    "variants": [
      {
        "variantId": "vedbo-armchair-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/vedbo-armchair-2/grey.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vedbo-armchair-gunnared-dark-grey-10424126/"
      },
      {
        "variantId": "vedbo-armchair-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/vedbo-armchair-2/brown.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vedbo-armchair-gunnared-light-brown-pink-40423578/"
      }
    ],
    "images": [
      "/images/catalog/vedbo-armchair-2/grey.jpg",
      "/images/catalog/vedbo-armchair-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 82
  },
  {
    "id": "ikea-dvargdunort-chair-pad",
    "slug": "dvargdunort-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "DVÄRGDUNÖRT",
    "nameEn": "DväRgdunöRt Chair Pad",
    "nameAr": "وسادة كرسي DVÄRGDUNÖRT",
    "descEn": "DväRgdunöRt Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي DVÄRGDUNÖRT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 10,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/dvaergdunoert-chair-pad-grey-white-30548852/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 42,
      "heightCm": 4
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "dvargdunort-chair-pad-white",
        "colorId": "white",
        "image": "/images/catalog/dvargdunort-chair-pad/white.jpg",
        "priceOmr": 10,
        "sourceUrl": "https://www.ikea.com/om/ar/p/dvaergdunoert-chair-pad-grey-white-30548852/"
      }
    ],
    "images": [
      "/images/catalog/dvargdunort-chair-pad/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 83
  },
  {
    "id": "ikea-parleternell-chair-pad",
    "slug": "parleternell-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "PÄRLETERNELL",
    "nameEn": "PäRleternell Chair Pad",
    "nameAr": "وسادة كرسي PÄRLETERNELL",
    "descEn": "PäRleternell Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي PÄRLETERNELL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 10,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/paerleternell-chair-pad-grann-black-00552096/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 40,
      "heightCm": 35
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "parleternell-chair-pad-black",
        "colorId": "black",
        "image": "/images/catalog/parleternell-chair-pad/black.jpg",
        "priceOmr": 10,
        "sourceUrl": "https://www.ikea.com/om/ar/p/paerleternell-chair-pad-grann-black-00552096/"
      }
    ],
    "images": [
      "/images/catalog/parleternell-chair-pad/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 84
  },
  {
    "id": "ikea-muren-chair",
    "slug": "muren-chair",
    "category": "chairs",
    "model": "MUREN",
    "nameEn": "Muren Chair",
    "nameAr": "كرسي MUREN",
    "descEn": "Muren Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي MUREN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 42,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/muren-recliner-remmarn-dark-grey-10438557/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "muren-chair-grey",
        "colorId": "grey",
        "image": "/images/catalog/muren-chair/grey.jpg",
        "gallery": [
          "/images/catalog/muren-chair/grey-1.jpg"
        ],
        "priceOmr": 42,
        "sourceUrl": "https://www.ikea.com/om/ar/p/muren-recliner-remmarn-dark-grey-10438557/"
      }
    ],
    "images": [
      "/images/catalog/muren-chair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 85
  },
  {
    "id": "ikea-idolf-chair",
    "slug": "idolf-chair",
    "category": "chairs",
    "model": "IDOLF",
    "nameEn": "Idolf Chair",
    "nameAr": "كرسي IDOLF",
    "descEn": "Idolf Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي IDOLF — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 27,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idolf-chair-white-40228812/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "idolf-chair-white",
        "colorId": "white",
        "image": "/images/catalog/idolf-chair/white.jpg",
        "priceOmr": 27,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idolf-chair-white-40228812/"
      }
    ],
    "images": [
      "/images/catalog/idolf-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 86
  },
  {
    "id": "ikea-bergmund-chair-4",
    "slug": "bergmund-chair-4",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 22,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-white-gunnared-medium-grey-s79384632/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-4-white",
        "colorId": "white",
        "image": "/images/catalog/bergmund-chair-4/white.jpg",
        "gallery": [
          "/images/catalog/bergmund-chair-4/white-1.jpg"
        ],
        "priceOmr": 22,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-white-gunnared-medium-grey-s79384632/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair-4/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 87
  },
  {
    "id": "ikea-franklin-bar-stool",
    "slug": "franklin-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "FRANKLIN",
    "nameEn": "Franklin Bar Stool",
    "nameAr": "كرسي بار FRANKLIN",
    "descEn": "Franklin Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بار FRANKLIN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 58,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/franklin-bar-stool-with-backrest-foldable-counter-height-white-white-70404875/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 63,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "franklin-bar-stool-white",
        "colorId": "white",
        "image": "/images/catalog/franklin-bar-stool/white.jpg",
        "priceOmr": 58,
        "sourceUrl": "https://www.ikea.com/om/ar/p/franklin-bar-stool-with-backrest-foldable-counter-height-white-white-70404875/"
      },
      {
        "variantId": "franklin-bar-stool-black",
        "colorId": "black",
        "image": "/images/catalog/franklin-bar-stool/black.jpg",
        "priceOmr": 58,
        "sourceUrl": "https://www.ikea.com/om/ar/p/franklin-bar-stool-with-backrest-foldable-counter-height-black-black-50406465/"
      }
    ],
    "images": [
      "/images/catalog/franklin-bar-stool/white.jpg",
      "/images/catalog/franklin-bar-stool/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 88
  },
  {
    "id": "ikea-rosentorp-bar-stool",
    "slug": "rosentorp-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "ROSENTORP",
    "nameEn": "Rosentorp Bar Stool",
    "nameAr": "كرسي بار ROSENTORP",
    "descEn": "Rosentorp Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بار ROSENTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 59,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-bar-stool-with-backrest-counter-height-white-50618194/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 63,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "rosentorp-bar-stool-white",
        "colorId": "white",
        "image": "/images/catalog/rosentorp-bar-stool/white.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-bar-stool-with-backrest-counter-height-white-50618194/"
      }
    ],
    "images": [
      "/images/catalog/rosentorp-bar-stool/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 89
  },
  {
    "id": "ikea-bergmund-chair-5",
    "slug": "bergmund-chair-5",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 27,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-white-gunnared-medium-grey-s69481596/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-5-white",
        "colorId": "white",
        "image": "/images/catalog/bergmund-chair-5/white.jpg",
        "priceOmr": 27,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-white-gunnared-medium-grey-s69481596/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair-5/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 90
  },
  {
    "id": "ikea-stefan-chair",
    "slug": "stefan-chair",
    "category": "chairs",
    "model": "STEFAN",
    "nameEn": "Stefan Chair",
    "nameAr": "كرسي STEFAN",
    "descEn": "Stefan Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي STEFAN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 16,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stefan-chair-brown-black-knisa-grey-beige-80512087/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "stefan-chair-black",
        "colorId": "black",
        "image": "/images/catalog/stefan-chair/black.jpg",
        "priceOmr": 16,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stefan-chair-brown-black-knisa-grey-beige-80512087/"
      }
    ],
    "images": [
      "/images/catalog/stefan-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 91
  },
  {
    "id": "ikea-oskarshamn-armchair-2",
    "slug": "oskarshamn-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "OSKARSHAMN",
    "nameEn": "Oskarshamn Armchair",
    "nameAr": "كرسي بذراعين OSKARSHAMN",
    "descEn": "Oskarshamn Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين OSKARSHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 64,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-tibbleby-beige-grey-20523611/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black",
      "red"
    ],
    "variants": [
      {
        "variantId": "oskarshamn-armchair-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/oskarshamn-armchair-2/grey.jpg",
        "priceOmr": 64,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-tibbleby-beige-grey-20523611/"
      },
      {
        "variantId": "oskarshamn-armchair-2-black",
        "colorId": "black",
        "image": "/images/catalog/oskarshamn-armchair-2/black.jpg",
        "priceOmr": 64,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-gunnared-black-grey-00503671/"
      },
      {
        "variantId": "oskarshamn-armchair-2-red",
        "colorId": "red",
        "image": "/images/catalog/oskarshamn-armchair-2/red.jpg",
        "priceOmr": 64,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oskarshamn-wing-chair-tonerud-red-50521682/"
      }
    ],
    "images": [
      "/images/catalog/oskarshamn-armchair-2/grey.jpg",
      "/images/catalog/oskarshamn-armchair-2/black.jpg",
      "/images/catalog/oskarshamn-armchair-2/red.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 92
  },
  {
    "id": "ikea-strandmon-armchair",
    "slug": "strandmon-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STRANDMON",
    "nameEn": "Strandmon Armchair",
    "nameAr": "كرسي بذراعين STRANDMON",
    "descEn": "Strandmon Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STRANDMON — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 144,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-childrens-armchair-vissle-grey-70392542/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "strandmon-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/strandmon-armchair/grey.jpg",
        "priceOmr": 144,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-childrens-armchair-vissle-grey-70392542/"
      }
    ],
    "images": [
      "/images/catalog/strandmon-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 93
  },
  {
    "id": "ikea-justina-chair-pad-3",
    "slug": "justina-chair-pad-3",
    "category": "decor",
    "subcategory": "cushion",
    "model": "JUSTINA",
    "nameEn": "Justina Chair Pad",
    "nameAr": "وسادة كرسي JUSTINA",
    "descEn": "Justina Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي JUSTINA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 10,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-s29503232/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 40,
      "heightCm": 4
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "natural"
    ],
    "variants": [
      {
        "variantId": "justina-chair-pad-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/justina-chair-pad-3/grey.jpg",
        "priceOmr": 10,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-s29503232/"
      },
      {
        "variantId": "justina-chair-pad-3-natural",
        "colorId": "natural",
        "image": "/images/catalog/justina-chair-pad-3/natural.jpg",
        "priceOmr": 10,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-natural-s99503238/"
      }
    ],
    "images": [
      "/images/catalog/justina-chair-pad-3/grey.jpg",
      "/images/catalog/justina-chair-pad-3/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 94
  },
  {
    "id": "ikea-staggstarr-chair-pad",
    "slug": "staggstarr-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "STAGGSTARR",
    "nameEn": "Staggstarr Chair Pad",
    "nameAr": "وسادة كرسي STAGGSTARR",
    "descEn": "Staggstarr Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي STAGGSTARR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 6,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/staggstarr-chair-pad-red-00508763/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 36,
      "depthCm": 36,
      "heightCm": 2
    },
    "dimensionsKnown": true,
    "colorIds": [
      "red",
      "black"
    ],
    "variants": [
      {
        "variantId": "staggstarr-chair-pad-red",
        "colorId": "red",
        "image": "/images/catalog/staggstarr-chair-pad/red.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/staggstarr-chair-pad-red-00508763/"
      },
      {
        "variantId": "staggstarr-chair-pad-black",
        "colorId": "black",
        "image": "/images/catalog/staggstarr-chair-pad/black.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/staggstarr-chair-pad-black-80508735/"
      }
    ],
    "images": [
      "/images/catalog/staggstarr-chair-pad/red.jpg",
      "/images/catalog/staggstarr-chair-pad/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 95
  },
  {
    "id": "ikea-poang-armchair-5",
    "slug": "poang-armchair-5",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 154,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-birch-veneer-skogbo-animal-pattern-s19598914/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural",
      "beige"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-5-natural",
        "colorId": "natural",
        "image": "/images/catalog/poang-armchair-5/natural.jpg",
        "priceOmr": 154,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-birch-veneer-skogbo-animal-pattern-s19598914/"
      },
      {
        "variantId": "poang-armchair-5-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair-5/beige.jpg",
        "priceOmr": 154,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-birch-veneer-knisa-light-beige-s49412561/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-5/natural.jpg",
      "/images/catalog/poang-armchair-5/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 96
  },
  {
    "id": "ikea-poang-armchair-6",
    "slug": "poang-armchair-6",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 98,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-walnut-effect-kelinge-dark-yellow-s79625009/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "walnut",
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-6-walnut",
        "colorId": "walnut",
        "materialId": "walnut",
        "image": "/images/catalog/poang-armchair-6/walnut.jpg",
        "priceOmr": 98,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-walnut-effect-kelinge-dark-yellow-s79625009/"
      },
      {
        "variantId": "poang-armchair-6-beige",
        "colorId": "beige",
        "materialId": "walnut",
        "image": "/images/catalog/poang-armchair-6/beige.jpg",
        "priceOmr": 98,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-walnut-effect-kelinge-beige-s49617708/"
      },
      {
        "variantId": "poang-armchair-6-grey",
        "colorId": "grey",
        "materialId": "walnut",
        "image": "/images/catalog/poang-armchair-6/grey.jpg",
        "priceOmr": 98,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-walnut-effect-gunnared-dark-grey-s99625032/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-6/walnut.jpg",
      "/images/catalog/poang-armchair-6/beige.jpg",
      "/images/catalog/poang-armchair-6/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 97
  },
  {
    "id": "ikea-poang-armchair-7",
    "slug": "poang-armchair-7",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 173,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-black-brown-vissle-black-s09551568/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-7-black",
        "colorId": "black",
        "image": "/images/catalog/poang-armchair-7/black.jpg",
        "gallery": [
          "/images/catalog/poang-armchair-7/black-1.jpg",
          "/images/catalog/poang-armchair-7/black-2.jpg"
        ],
        "priceOmr": 173,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-black-brown-vissle-black-s09551568/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-7/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 98
  },
  {
    "id": "ikea-poang-armchair-8",
    "slug": "poang-armchair-8",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 117,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-red-vissle-black-s99551578/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "red",
      "beige"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-8-black",
        "colorId": "black",
        "image": "/images/catalog/poang-armchair-8/black.jpg",
        "priceOmr": 117,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-red-vissle-black-s99551578/"
      },
      {
        "variantId": "poang-armchair-8-red",
        "colorId": "red",
        "image": "/images/catalog/poang-armchair-8/red.jpg",
        "priceOmr": 117,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-red-vissle-red-s99551583/"
      },
      {
        "variantId": "poang-armchair-8-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair-8/beige.jpg",
        "priceOmr": 117,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-red-katorp-natural-colour-beige-s89551611/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-8/black.jpg",
      "/images/catalog/poang-armchair-8/red.jpg",
      "/images/catalog/poang-armchair-8/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 99
  },
  {
    "id": "ikea-gronsta-chair-2",
    "slug": "gronsta-chair-2",
    "category": "chairs",
    "model": "GRÖNSTA",
    "nameEn": "GröNsta Chair",
    "nameAr": "كرسي GRÖNSTA",
    "descEn": "GröNsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي GRÖNSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 24,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-chair-in-outdoor-grey-turquoise-70554577/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "gronsta-chair-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/gronsta-chair-2/grey.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-chair-in-outdoor-grey-turquoise-70554577/"
      },
      {
        "variantId": "gronsta-chair-2-white",
        "colorId": "white",
        "image": "/images/catalog/gronsta-chair-2/white.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-chair-in-outdoor-white-70519763/"
      }
    ],
    "images": [
      "/images/catalog/gronsta-chair-2/grey.jpg",
      "/images/catalog/gronsta-chair-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 100
  },
  {
    "id": "ikea-vippart-chair-pad-2",
    "slug": "vippart-chair-pad-2",
    "category": "decor",
    "subcategory": "cushion",
    "model": "VIPPÄRT",
    "nameEn": "VippäRt Chair Pad",
    "nameAr": "وسادة كرسي VIPPÄRT",
    "descEn": "VippäRt Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي VIPPÄRT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 9,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vippaert-chair-pad-dark-grey-20599045/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 38,
      "depthCm": 38,
      "heightCm": 6
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "vippart-chair-pad-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/vippart-chair-pad-2/grey.jpg",
        "priceOmr": 9,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vippaert-chair-pad-dark-grey-20599045/"
      },
      {
        "variantId": "vippart-chair-pad-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/vippart-chair-pad-2/beige.jpg",
        "priceOmr": 9,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vippaert-chair-pad-beige-10599282/"
      }
    ],
    "images": [
      "/images/catalog/vippart-chair-pad-2/grey.jpg",
      "/images/catalog/vippart-chair-pad-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 101
  },
  {
    "id": "ikea-poang-rocking-chair",
    "slug": "poang-rocking-chair",
    "category": "chairs",
    "subcategory": "rocking-chair",
    "model": "POÄNG",
    "nameEn": "PoäNg Rocking Chair",
    "nameAr": "كرسي هزّاز POÄNG",
    "descEn": "PoäNg Rocking Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي هزّاز POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 73,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-rocking-chair-birch-veneer-kelinge-beige-s89625853/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "natural",
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "poang-rocking-chair-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-rocking-chair/beige.jpg",
        "priceOmr": 73,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-rocking-chair-birch-veneer-kelinge-beige-s89625853/"
      },
      {
        "variantId": "poang-rocking-chair-natural",
        "colorId": "natural",
        "image": "/images/catalog/poang-rocking-chair/natural.jpg",
        "priceOmr": 73,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-rocking-chair-birch-veneer-kelinge-dark-yellow-s09625852/"
      },
      {
        "variantId": "poang-rocking-chair-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/poang-rocking-chair/charcoal.jpg",
        "priceOmr": 73,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-rocking-chair-birch-veneer-hillared-anthracite-s29429119/"
      }
    ],
    "images": [
      "/images/catalog/poang-rocking-chair/beige.jpg",
      "/images/catalog/poang-rocking-chair/natural.jpg",
      "/images/catalog/poang-rocking-chair/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 102
  },
  {
    "id": "ikea-akervindefly-chair-pad",
    "slug": "akervindefly-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "ÅKERVINDEFLY",
    "nameEn": "åKervindefly Chair Pad",
    "nameAr": "وسادة كرسي ÅKERVINDEFLY",
    "descEn": "åKervindefly Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي ÅKERVINDEFLY — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 4,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/akervindefly-chair-cushion-beige-20560203/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 37,
      "heightCm": 5
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "akervindefly-chair-pad-beige",
        "colorId": "beige",
        "image": "/images/catalog/akervindefly-chair-pad/beige.jpg",
        "priceOmr": 4,
        "sourceUrl": "https://www.ikea.com/om/ar/p/akervindefly-chair-cushion-beige-20560203/"
      },
      {
        "variantId": "akervindefly-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/akervindefly-chair-pad/grey.jpg",
        "priceOmr": 4,
        "sourceUrl": "https://www.ikea.com/om/ar/p/akervindefly-chair-cushion-grey-40554362/"
      }
    ],
    "images": [
      "/images/catalog/akervindefly-chair-pad/beige.jpg",
      "/images/catalog/akervindefly-chair-pad/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 103
  },
  {
    "id": "ikea-landskrona-armchair",
    "slug": "landskrona-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "LANDSKRONA",
    "nameEn": "Landskrona Armchair",
    "nameAr": "كرسي بذراعين LANDSKRONA",
    "descEn": "Landskrona Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين LANDSKRONA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 50,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/landskrona-armchair-grann-bomstad-black-wood-s59031778/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "brown"
    ],
    "variants": [
      {
        "variantId": "landskrona-armchair-black",
        "colorId": "black",
        "image": "/images/catalog/landskrona-armchair/black.jpg",
        "gallery": [
          "/images/catalog/landskrona-armchair/black-1.jpg"
        ],
        "priceOmr": 50,
        "sourceUrl": "https://www.ikea.com/om/ar/p/landskrona-armchair-grann-bomstad-black-wood-s59031778/"
      },
      {
        "variantId": "landskrona-armchair-brown",
        "colorId": "brown",
        "image": "/images/catalog/landskrona-armchair/brown.jpg",
        "gallery": [
          "/images/catalog/landskrona-armchair/brown-1.jpg"
        ],
        "priceOmr": 50,
        "sourceUrl": "https://www.ikea.com/om/ar/p/landskrona-armchair-grann-bomstad-golden-brown-wood-s19269197/"
      }
    ],
    "images": [
      "/images/catalog/landskrona-armchair/black.jpg",
      "/images/catalog/landskrona-armchair/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 104
  },
  {
    "id": "ikea-smaskrake-table",
    "slug": "smaskrake-table",
    "category": "dining",
    "model": "SMÅSKRAKE",
    "nameEn": "SmåSkrake Table",
    "nameAr": "طاولة SMÅSKRAKE",
    "descEn": "SmåSkrake Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة SMÅSKRAKE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 255,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/smaskrake-multi-functional-child-chair-table-green-60569744/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": false,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "smaskrake-table-green",
        "colorId": "green",
        "image": "/images/catalog/smaskrake-table/green.jpg",
        "priceOmr": 255,
        "sourceUrl": "https://www.ikea.com/om/ar/p/smaskrake-multi-functional-child-chair-table-green-60569744/"
      }
    ],
    "images": [
      "/images/catalog/smaskrake-table/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 105
  },
  {
    "id": "ikea-bergmund-chair-6",
    "slug": "bergmund-chair-6",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 54,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-black-gunnared-medium-grey-s59481587/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-6-black",
        "colorId": "black",
        "image": "/images/catalog/bergmund-chair-6/black.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-black-gunnared-medium-grey-s59481587/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair-6/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 106
  },
  {
    "id": "ikea-mofalla-armchair",
    "slug": "mofalla-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "MOFALLA",
    "nameEn": "Mofalla Armchair",
    "nameAr": "كرسي بذراعين MOFALLA",
    "descEn": "Mofalla Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين MOFALLA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 120,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/mofalla-easy-chair-80555091/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "mofalla-armchair-natural",
        "colorId": "natural",
        "image": "/images/catalog/mofalla-armchair/natural.jpg",
        "priceOmr": 120,
        "sourceUrl": "https://www.ikea.com/om/ar/p/mofalla-easy-chair-80555091/"
      }
    ],
    "images": [
      "/images/catalog/mofalla-armchair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 107
  },
  {
    "id": "ikea-skalsta-chair-10",
    "slug": "skalsta-chair-10",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 34,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-knaebaeck-dark-grey-20611783/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-10-grey",
        "colorId": "grey",
        "image": "/images/catalog/skalsta-chair-10/grey.jpg",
        "gallery": [
          "/images/catalog/skalsta-chair-10/grey-1.jpg"
        ],
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-knaebaeck-dark-grey-20611783/"
      },
      {
        "variantId": "skalsta-chair-10-beige",
        "colorId": "beige",
        "image": "/images/catalog/skalsta-chair-10/beige.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-knaebaeck-beige-60611762/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-10/grey.jpg",
      "/images/catalog/skalsta-chair-10/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 108
  },
  {
    "id": "ikea-madonnalilja-chair-pad",
    "slug": "madonnalilja-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "MADONNALILJA",
    "nameEn": "Madonnalilja Chair Pad",
    "nameAr": "وسادة كرسي MADONNALILJA",
    "descEn": "Madonnalilja Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي MADONNALILJA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 14,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/madonnalilja-chair-pad-beige-70559725/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 40,
      "heightCm": 32
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "madonnalilja-chair-pad-beige",
        "colorId": "beige",
        "image": "/images/catalog/madonnalilja-chair-pad/beige.jpg",
        "priceOmr": 14,
        "sourceUrl": "https://www.ikea.com/om/ar/p/madonnalilja-chair-pad-beige-70559725/"
      }
    ],
    "images": [
      "/images/catalog/madonnalilja-chair-pad/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 109
  },
  {
    "id": "ikea-ektorp-armchair-2",
    "slug": "ektorp-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "EKTORP",
    "nameEn": "Ektorp Armchair",
    "nameAr": "كرسي بذراعين EKTORP",
    "descEn": "Ektorp Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين EKTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 61,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ektorp-armchair-hakebo-grey-green-s09552110/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "blue"
    ],
    "variants": [
      {
        "variantId": "ektorp-armchair-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/ektorp-armchair-2/grey.jpg",
        "gallery": [
          "/images/catalog/ektorp-armchair-2/grey-1.jpg"
        ],
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ektorp-armchair-hakebo-grey-green-s09552110/"
      },
      {
        "variantId": "ektorp-armchair-2-blue",
        "colorId": "blue",
        "image": "/images/catalog/ektorp-armchair-2/blue.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ektorp-armchair-kilanda-dark-blue-s19552100/"
      }
    ],
    "images": [
      "/images/catalog/ektorp-armchair-2/grey.jpg",
      "/images/catalog/ektorp-armchair-2/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 110
  },
  {
    "id": "ikea-alvgrasmal-chair-pad",
    "slug": "alvgrasmal-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "ÄLVGRÄSMAL",
    "nameEn": "äLvgräSmal Chair Pad",
    "nameAr": "وسادة كرسي ÄLVGRÄSMAL",
    "descEn": "äLvgräSmal Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي ÄLVGRÄSMAL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 6,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/aelvgraesmal-chair-pad-red-20538226/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 40,
      "heightCm": 5
    },
    "dimensionsKnown": false,
    "colorIds": [
      "red",
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "alvgrasmal-chair-pad-red",
        "colorId": "red",
        "image": "/images/catalog/alvgrasmal-chair-pad/red.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aelvgraesmal-chair-pad-red-20538226/"
      },
      {
        "variantId": "alvgrasmal-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/alvgrasmal-chair-pad/grey.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aelvgraesmal-chair-pad-grey-00538114/"
      },
      {
        "variantId": "alvgrasmal-chair-pad-beige",
        "colorId": "beige",
        "image": "/images/catalog/alvgrasmal-chair-pad/beige.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aelvgraesmal-chair-pad-beige-90538218/"
      }
    ],
    "images": [
      "/images/catalog/alvgrasmal-chair-pad/red.jpg",
      "/images/catalog/alvgrasmal-chair-pad/grey.jpg",
      "/images/catalog/alvgrasmal-chair-pad/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 111
  },
  {
    "id": "ikea-justina-chair-pad-4",
    "slug": "justina-chair-pad-4",
    "category": "decor",
    "subcategory": "cushion",
    "model": "JUSTINA",
    "nameEn": "Justina Chair Pad",
    "nameAr": "وسادة كرسي JUSTINA",
    "descEn": "Justina Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي JUSTINA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 13,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-s19503218/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 40,
      "heightCm": 4
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "natural"
    ],
    "variants": [
      {
        "variantId": "justina-chair-pad-4-grey",
        "colorId": "grey",
        "image": "/images/catalog/justina-chair-pad-4/grey.jpg",
        "priceOmr": 13,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-grey-s19503218/"
      },
      {
        "variantId": "justina-chair-pad-4-natural",
        "colorId": "natural",
        "image": "/images/catalog/justina-chair-pad-4/natural.jpg",
        "priceOmr": 13,
        "sourceUrl": "https://www.ikea.com/om/ar/p/justina-chair-pad-natural-s69503225/"
      }
    ],
    "images": [
      "/images/catalog/justina-chair-pad-4/grey.jpg",
      "/images/catalog/justina-chair-pad-4/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 112
  },
  {
    "id": "ikea-poang-armchair-9",
    "slug": "poang-armchair-9",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 61,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-natural-colour-beige-vissle-black-s69551594/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "beige"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-9-black",
        "colorId": "black",
        "image": "/images/catalog/poang-armchair-9/black.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-natural-colour-beige-vissle-black-s69551594/"
      },
      {
        "variantId": "poang-armchair-9-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair-9/beige.jpg",
        "gallery": [
          "/images/catalog/poang-armchair-9/beige-1.jpg"
        ],
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-low-back-armchair-natural-colour-beige-katorp-natural-colour-beige-s09551605/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-9/black.jpg",
      "/images/catalog/poang-armchair-9/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 113
  },
  {
    "id": "ikea-kullaberg-chair",
    "slug": "kullaberg-chair",
    "category": "chairs",
    "model": "KULLABERG",
    "nameEn": "Kullaberg Chair",
    "nameAr": "كرسي KULLABERG",
    "descEn": "Kullaberg Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي KULLABERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kullaberg-swivel-chair-pine-black-10320341/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "kullaberg-chair-black",
        "colorId": "black",
        "image": "/images/catalog/kullaberg-chair/black.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kullaberg-swivel-chair-pine-black-10320341/"
      }
    ],
    "images": [
      "/images/catalog/kullaberg-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 114
  },
  {
    "id": "ikea-gronsta-bar-stool",
    "slug": "gronsta-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "GRÖNSTA",
    "nameEn": "GröNsta Bar Stool",
    "nameAr": "كرسي بار GRÖNSTA",
    "descEn": "GröNsta Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بار GRÖNSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 53,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-bar-stool-counter-height-grey-turquoise-in-outdoor-60554634/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 64,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "gronsta-bar-stool-grey",
        "colorId": "grey",
        "image": "/images/catalog/gronsta-bar-stool/grey.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-bar-stool-counter-height-grey-turquoise-in-outdoor-60554634/"
      },
      {
        "variantId": "gronsta-bar-stool-white",
        "colorId": "white",
        "image": "/images/catalog/gronsta-bar-stool/white.jpg",
        "priceOmr": 53,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groensta-bar-stool-counter-height-white-in-outdoor-30554635/"
      }
    ],
    "images": [
      "/images/catalog/gronsta-bar-stool/grey.jpg",
      "/images/catalog/gronsta-bar-stool/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 115
  },
  {
    "id": "ikea-sotenas-armchair",
    "slug": "sotenas-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "SOTENÄS",
    "nameEn": "SotenäS Armchair",
    "nameAr": "كرسي بذراعين SOTENÄS",
    "descEn": "SotenäS Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين SOTENÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 113,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sotenaes-armchair-hakebo-red-10581913/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "red"
    ],
    "variants": [
      {
        "variantId": "sotenas-armchair-red",
        "colorId": "red",
        "image": "/images/catalog/sotenas-armchair/red.jpg",
        "priceOmr": 113,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sotenaes-armchair-hakebo-red-10581913/"
      }
    ],
    "images": [
      "/images/catalog/sotenas-armchair/red.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 116
  },
  {
    "id": "ikea-salno-gryttom-armchair",
    "slug": "salno-gryttom-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "SALNÖ / GRYTTOM",
    "nameEn": "Salnö / Gryttom Armchair",
    "nameAr": "كرسي بذراعين SALNÖ / GRYTTOM",
    "descEn": "Salnö / Gryttom Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين SALNÖ / GRYTTOM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 88,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/salnoe-gryttom-armchair-with-cushion-s19534413/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "salno-gryttom-armchair-natural",
        "colorId": "natural",
        "image": "/images/catalog/salno-gryttom-armchair/natural.jpg",
        "priceOmr": 88,
        "sourceUrl": "https://www.ikea.com/om/ar/p/salnoe-gryttom-armchair-with-cushion-s19534413/"
      }
    ],
    "images": [
      "/images/catalog/salno-gryttom-armchair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 117
  },
  {
    "id": "ikea-stockholm-2025-armchair-3",
    "slug": "stockholm-2025-armchair-3",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Armchair",
    "nameAr": "كرسي بذراعين STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 157,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-armchair-rattan-djurmo-grey-white-s79578263/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-armchair-3-white",
        "colorId": "white",
        "materialId": "rattan",
        "image": "/images/catalog/stockholm-2025-armchair-3/white.jpg",
        "priceOmr": 157,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-armchair-rattan-djurmo-grey-white-s79578263/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-armchair-3/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 118
  },
  {
    "id": "ikea-skalsta-chair-11",
    "slug": "skalsta-chair-11",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 39,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-plastic-red-60611795/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "red",
      "beige"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-11-red",
        "colorId": "red",
        "image": "/images/catalog/skalsta-chair-11/red.jpg",
        "priceOmr": 39,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-plastic-red-60611795/"
      },
      {
        "variantId": "skalsta-chair-11-beige",
        "colorId": "beige",
        "image": "/images/catalog/skalsta-chair-11/beige.jpg",
        "priceOmr": 39,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-seat-shell-plastic-beige-20611797/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-11/red.jpg",
      "/images/catalog/skalsta-chair-11/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 119
  },
  {
    "id": "ikea-ommjange-chair",
    "slug": "ommjange-chair",
    "category": "chairs",
    "model": "OMMJÄNGE",
    "nameEn": "OmmjäNge Chair",
    "nameAr": "كرسي OMMJÄNGE",
    "descEn": "OmmjäNge Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي OMMJÄNGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 33,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ommjaenge-chair-stained-blue-50594678/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "blue"
    ],
    "variants": [
      {
        "variantId": "ommjange-chair-blue",
        "colorId": "blue",
        "image": "/images/catalog/ommjange-chair/blue.jpg",
        "priceOmr": 33,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ommjaenge-chair-stained-blue-50594678/"
      }
    ],
    "images": [
      "/images/catalog/ommjange-chair/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 120
  },
  {
    "id": "ikea-salno-armchair",
    "slug": "salno-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "SALNÖ",
    "nameEn": "Salnö Armchair",
    "nameAr": "كرسي بذراعين SALNÖ",
    "descEn": "Salnö Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين SALNÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 110,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/salnoe-armchair-rattan-60500778/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "salno-armchair-natural",
        "colorId": "natural",
        "materialId": "rattan",
        "image": "/images/catalog/salno-armchair/natural.jpg",
        "priceOmr": 110,
        "sourceUrl": "https://www.ikea.com/om/ar/p/salnoe-armchair-rattan-60500778/"
      }
    ],
    "images": [
      "/images/catalog/salno-armchair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 121
  },
  {
    "id": "ikea-buskbo-armchair-2",
    "slug": "buskbo-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "BUSKBO",
    "nameEn": "Buskbo Armchair",
    "nameAr": "كرسي بذراعين BUSKBO",
    "descEn": "Buskbo Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين BUSKBO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 112,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/buskbo-armchair-rattan-70434311/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "buskbo-armchair-2-natural",
        "colorId": "natural",
        "materialId": "rattan",
        "image": "/images/catalog/buskbo-armchair-2/natural.jpg",
        "priceOmr": 112,
        "sourceUrl": "https://www.ikea.com/om/ar/p/buskbo-armchair-rattan-70434311/"
      }
    ],
    "images": [
      "/images/catalog/buskbo-armchair-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 122
  },
  {
    "id": "ikea-bergmund-chair-7",
    "slug": "bergmund-chair-7",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 17,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-white-gunnared-medium-grey-s09481599/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-7-white",
        "colorId": "white",
        "image": "/images/catalog/bergmund-chair-7/white.jpg",
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-white-gunnared-medium-grey-s09481599/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair-7/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 123
  },
  {
    "id": "ikea-saltsjobaden-armchair",
    "slug": "saltsjobaden-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "SALTSJÖBADEN",
    "nameEn": "SaltsjöBaden Armchair",
    "nameAr": "كرسي بذراعين SALTSJÖBADEN",
    "descEn": "SaltsjöBaden Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين SALTSJÖBADEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 131,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/saltsjoebaden-armchair-tonerud-grey-s99622731/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "saltsjobaden-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/saltsjobaden-armchair/grey.jpg",
        "gallery": [
          "/images/catalog/saltsjobaden-armchair/grey-1.jpg"
        ],
        "priceOmr": 131,
        "sourceUrl": "https://www.ikea.com/om/ar/p/saltsjoebaden-armchair-tonerud-grey-s99622731/"
      },
      {
        "variantId": "saltsjobaden-armchair-white",
        "colorId": "white",
        "image": "/images/catalog/saltsjobaden-armchair/white.jpg",
        "priceOmr": 131,
        "sourceUrl": "https://www.ikea.com/om/ar/p/saltsjoebaden-armchair-blekinge-white-s99622707/"
      }
    ],
    "images": [
      "/images/catalog/saltsjobaden-armchair/grey.jpg",
      "/images/catalog/saltsjobaden-armchair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 124
  },
  {
    "id": "ikea-landskrona-armchair-2",
    "slug": "landskrona-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "LANDSKRONA",
    "nameEn": "Landskrona Armchair",
    "nameAr": "كرسي بذراعين LANDSKRONA",
    "descEn": "Landskrona Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين LANDSKRONA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 150,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/landskrona-armchair-gunnared-dark-grey-metal-s99269160/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "green"
    ],
    "variants": [
      {
        "variantId": "landskrona-armchair-2-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/landskrona-armchair-2/grey.jpg",
        "gallery": [
          "/images/catalog/landskrona-armchair-2/grey-1.jpg"
        ],
        "priceOmr": 150,
        "sourceUrl": "https://www.ikea.com/om/ar/p/landskrona-armchair-gunnared-dark-grey-metal-s99269160/"
      },
      {
        "variantId": "landskrona-armchair-2-green",
        "colorId": "green",
        "image": "/images/catalog/landskrona-armchair-2/green.jpg",
        "gallery": [
          "/images/catalog/landskrona-armchair-2/green-1.jpg"
        ],
        "priceOmr": 150,
        "sourceUrl": "https://www.ikea.com/om/ar/p/landskrona-armchair-gunnared-light-green-wood-s89269721/"
      }
    ],
    "images": [
      "/images/catalog/landskrona-armchair-2/grey.jpg",
      "/images/catalog/landskrona-armchair-2/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 125
  },
  {
    "id": "ikea-pynten-chair-pad",
    "slug": "pynten-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "PYNTEN",
    "nameEn": "Pynten Chair Pad",
    "nameAr": "وسادة كرسي PYNTEN",
    "descEn": "Pynten Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي PYNTEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 6,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/pynten-seat-pad-yellow-80636417/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 41,
      "depthCm": 43,
      "heightCm": 5
    },
    "dimensionsKnown": true,
    "colorIds": [
      "yellow",
      "grey"
    ],
    "variants": [
      {
        "variantId": "pynten-chair-pad-yellow",
        "colorId": "yellow",
        "image": "/images/catalog/pynten-chair-pad/yellow.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pynten-seat-pad-yellow-80636417/"
      },
      {
        "variantId": "pynten-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/pynten-chair-pad/grey.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pynten-seat-pad-dark-grey-30473205/"
      }
    ],
    "images": [
      "/images/catalog/pynten-chair-pad/yellow.jpg",
      "/images/catalog/pynten-chair-pad/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 126
  },
  {
    "id": "ikea-teodores-chair-3",
    "slug": "teodores-chair-3",
    "category": "chairs",
    "model": "TEODORES",
    "nameEn": "Teodores Chair",
    "nameAr": "كرسي TEODORES",
    "descEn": "Teodores Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي TEODORES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 24,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/teodores-chair-white-90350937/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "blue"
    ],
    "variants": [
      {
        "variantId": "teodores-chair-3-white",
        "colorId": "white",
        "image": "/images/catalog/teodores-chair-3/white.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/teodores-chair-white-90350937/"
      },
      {
        "variantId": "teodores-chair-3-blue",
        "colorId": "blue",
        "image": "/images/catalog/teodores-chair-3/blue.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/teodores-chair-blue-90530627/"
      }
    ],
    "images": [
      "/images/catalog/teodores-chair-3/white.jpg",
      "/images/catalog/teodores-chair-3/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 127
  },
  {
    "id": "ikea-hogved-chair",
    "slug": "hogved-chair",
    "category": "chairs",
    "model": "HÖGVED",
    "nameEn": "HöGved Chair",
    "nameAr": "كرسي HÖGVED",
    "descEn": "HöGved Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي HÖGVED — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 18,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hoegved-chair-birch-veneer-90606820/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "hogved-chair-natural",
        "colorId": "natural",
        "image": "/images/catalog/hogved-chair/natural.jpg",
        "priceOmr": 18,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hoegved-chair-birch-veneer-90606820/"
      }
    ],
    "images": [
      "/images/catalog/hogved-chair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 128
  },
  {
    "id": "ikea-bergmund-chair-8",
    "slug": "bergmund-chair-8",
    "category": "chairs",
    "model": "BERGMUND",
    "nameEn": "Bergmund Chair",
    "nameAr": "كرسي BERGMUND",
    "descEn": "Bergmund Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BERGMUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 40,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-cover-orrsta-light-grey-70486201/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "bergmund-chair-8-grey",
        "colorId": "grey",
        "image": "/images/catalog/bergmund-chair-8/grey.jpg",
        "gallery": [
          "/images/catalog/bergmund-chair-8/grey-1.jpg"
        ],
        "priceOmr": 40,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergmund-chair-cover-orrsta-light-grey-70486201/"
      }
    ],
    "images": [
      "/images/catalog/bergmund-chair-8/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 129
  },
  {
    "id": "ikea-norrmanso-chair",
    "slug": "norrmanso-chair",
    "category": "chairs",
    "model": "NORRMANSÖ",
    "nameEn": "Norrmansö Chair",
    "nameAr": "كرسي NORRMANSÖ",
    "descEn": "Norrmansö Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي NORRMANSÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/norrmansoe-chair-outdoor-in-outdoor-beige-acacia-40511080/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "norrmanso-chair-beige",
        "colorId": "beige",
        "image": "/images/catalog/norrmanso-chair/beige.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/norrmansoe-chair-outdoor-in-outdoor-beige-acacia-40511080/"
      }
    ],
    "images": [
      "/images/catalog/norrmanso-chair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 130
  },
  {
    "id": "ikea-tonstad-chair",
    "slug": "tonstad-chair",
    "category": "chairs",
    "model": "TONSTAD",
    "nameEn": "Tonstad Chair",
    "nameAr": "كرسي TONSTAD",
    "descEn": "Tonstad Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 30,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-brown-oak-effect-fridtuna-light-beige-00594020/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "ivory"
    ],
    "variants": [
      {
        "variantId": "tonstad-chair-beige",
        "colorId": "beige",
        "materialId": "oak",
        "image": "/images/catalog/tonstad-chair/beige.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-brown-oak-effect-fridtuna-light-beige-00594020/"
      },
      {
        "variantId": "tonstad-chair-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-chair/ivory.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-off-white-fridtuna-light-beige-20594019/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-chair/beige.jpg",
      "/images/catalog/tonstad-chair/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 131
  },
  {
    "id": "ikea-skalsta-chair-12",
    "slug": "skalsta-chair-12",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 24,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-underframe-tubular-metal-black-grey-50611814/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "grey"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-12-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-12/black.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-underframe-tubular-metal-black-grey-50611814/"
      },
      {
        "variantId": "skalsta-chair-12-grey",
        "colorId": "grey",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-12/grey.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-underframe-tubular-metal-light-grey-beige-00611816/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-12/black.jpg",
      "/images/catalog/skalsta-chair-12/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 132
  },
  {
    "id": "ikea-poang-armchair-10",
    "slug": "poang-armchair-10",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 143,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-cushion-skogbo-animal-pattern-30597687/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural",
      "beige"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-10-natural",
        "colorId": "natural",
        "image": "/images/catalog/poang-armchair-10/natural.jpg",
        "priceOmr": 143,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-cushion-skogbo-animal-pattern-30597687/"
      },
      {
        "variantId": "poang-armchair-10-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair-10/beige.jpg",
        "priceOmr": 143,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-childrens-armchair-cushion-knisa-light-beige-40489668/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-10/natural.jpg",
      "/images/catalog/poang-armchair-10/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 133
  },
  {
    "id": "ikea-tegelon-chair",
    "slug": "tegelon-chair",
    "category": "chairs",
    "model": "TEGELÖN",
    "nameEn": "TegelöN Chair",
    "nameAr": "كرسي TEGELÖN",
    "descEn": "TegelöN Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي TEGELÖN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 49,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tegeloen-chair-in-outdoor-dark-grey-black-00503807/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "tegelon-chair-black",
        "colorId": "black",
        "image": "/images/catalog/tegelon-chair/black.jpg",
        "priceOmr": 49,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tegeloen-chair-in-outdoor-dark-grey-black-00503807/"
      }
    ],
    "images": [
      "/images/catalog/tegelon-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 134
  },
  {
    "id": "ikea-lustebo-chair",
    "slug": "lustebo-chair",
    "category": "chairs",
    "model": "LUSTEBO",
    "nameEn": "Lustebo Chair",
    "nameAr": "كرسي LUSTEBO",
    "descEn": "Lustebo Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي LUSTEBO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 19,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lustebo-chair-viarp-beige-brown-90534461/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "lustebo-chair-beige",
        "colorId": "beige",
        "image": "/images/catalog/lustebo-chair/beige.jpg",
        "priceOmr": 19,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lustebo-chair-viarp-beige-brown-90534461/"
      }
    ],
    "images": [
      "/images/catalog/lustebo-chair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 135
  },
  {
    "id": "ikea-nordviken-chair",
    "slug": "nordviken-chair",
    "category": "chairs",
    "model": "NORDVIKEN",
    "nameEn": "Nordviken Chair",
    "nameAr": "كرسي NORDVIKEN",
    "descEn": "Nordviken Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي NORDVIKEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 35,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nordviken-chair-black-40369109/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "natural"
    ],
    "variants": [
      {
        "variantId": "nordviken-chair-black",
        "colorId": "black",
        "image": "/images/catalog/nordviken-chair/black.jpg",
        "priceOmr": 35,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nordviken-chair-black-40369109/"
      },
      {
        "variantId": "nordviken-chair-natural",
        "colorId": "natural",
        "image": "/images/catalog/nordviken-chair/natural.jpg",
        "priceOmr": 35,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nordviken-chair-antique-stain-30488546/"
      }
    ],
    "images": [
      "/images/catalog/nordviken-chair/black.jpg",
      "/images/catalog/nordviken-chair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 136
  },
  {
    "id": "ikea-lyckan-chair",
    "slug": "lyckan-chair",
    "category": "chairs",
    "model": "LYCKAN",
    "nameEn": "Lyckan Chair",
    "nameAr": "كرسي LYCKAN",
    "descEn": "Lyckan Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي LYCKAN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 17,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lyckan-chair-black-birch-veneer-20569190/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "natural"
    ],
    "variants": [
      {
        "variantId": "lyckan-chair-black",
        "colorId": "black",
        "image": "/images/catalog/lyckan-chair/black.jpg",
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyckan-chair-black-birch-veneer-20569190/"
      },
      {
        "variantId": "lyckan-chair-natural",
        "colorId": "natural",
        "image": "/images/catalog/lyckan-chair/natural.jpg",
        "gallery": [
          "/images/catalog/lyckan-chair/natural-1.jpg"
        ],
        "priceOmr": 17,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyckan-chair-yellow-birch-veneer-00569186/"
      }
    ],
    "images": [
      "/images/catalog/lyckan-chair/black.jpg",
      "/images/catalog/lyckan-chair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 137
  },
  {
    "id": "ikea-grotan-chair",
    "slug": "grotan-chair",
    "category": "chairs",
    "model": "GRÖTÅN",
    "nameEn": "GröTåN Chair",
    "nameAr": "كرسي GRÖTÅN",
    "descEn": "GröTåN Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي GRÖTÅN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 44,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/groetan-chair-tibbleby-dark-beige-10610425/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "grotan-chair-beige",
        "colorId": "beige",
        "image": "/images/catalog/grotan-chair/beige.jpg",
        "priceOmr": 44,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groetan-chair-tibbleby-dark-beige-10610425/"
      }
    ],
    "images": [
      "/images/catalog/grotan-chair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 138
  },
  {
    "id": "ikea-duvskar-chair",
    "slug": "duvskar-chair",
    "category": "chairs",
    "model": "DUVSKÄR",
    "nameEn": "DuvskäR Chair",
    "nameAr": "كرسي DUVSKÄR",
    "descEn": "DuvskäR Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي DUVSKÄR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 43,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/duvskaer-chair-in-outdoor-black-blue-70515760/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "duvskar-chair-black",
        "colorId": "black",
        "image": "/images/catalog/duvskar-chair/black.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/duvskaer-chair-in-outdoor-black-blue-70515760/"
      }
    ],
    "images": [
      "/images/catalog/duvskar-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 139
  },
  {
    "id": "ikea-pinntorp-chair-2",
    "slug": "pinntorp-chair-2",
    "category": "chairs",
    "model": "PINNTORP",
    "nameEn": "Pinntorp Chair",
    "nameAr": "كرسي PINNTORP",
    "descEn": "Pinntorp Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي PINNTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 44,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-chair-light-brown-stained-katorp-natural-20529482/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "pinntorp-chair-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/pinntorp-chair-2/brown.jpg",
        "priceOmr": 44,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-chair-light-brown-stained-katorp-natural-20529482/"
      }
    ],
    "images": [
      "/images/catalog/pinntorp-chair-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 140
  },
  {
    "id": "ikea-vassholmen-chair",
    "slug": "vassholmen-chair",
    "category": "chairs",
    "model": "VASSHOLMEN",
    "nameEn": "Vassholmen Chair",
    "nameAr": "كرسي VASSHOLMEN",
    "descEn": "Vassholmen Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي VASSHOLMEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vassholmen-chair-in-outdoor-black-white-30503740/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vassholmen-chair-white",
        "colorId": "white",
        "image": "/images/catalog/vassholmen-chair/white.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vassholmen-chair-in-outdoor-black-white-30503740/"
      }
    ],
    "images": [
      "/images/catalog/vassholmen-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 141
  },
  {
    "id": "ikea-tonstad-chair-2",
    "slug": "tonstad-chair-2",
    "category": "chairs",
    "model": "TONSTAD",
    "nameEn": "Tonstad Chair",
    "nameAr": "كرسي TONSTAD",
    "descEn": "Tonstad Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-cover-fridtuna-light-beige-80603577/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tonstad-chair-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/tonstad-chair-2/beige.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-cover-fridtuna-light-beige-80603577/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-chair-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 142
  },
  {
    "id": "ikea-stig-bar-stool",
    "slug": "stig-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "STIG",
    "nameEn": "Stig Bar Stool",
    "nameAr": "كرسي بار STIG",
    "descEn": "Stig Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بار STIG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 34,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stig-bar-stool-with-backrest-counter-height-black-black-30498418/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 95,
      "seatHeightCm": 74
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "stig-bar-stool-black",
        "colorId": "black",
        "image": "/images/catalog/stig-bar-stool/black.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stig-bar-stool-with-backrest-counter-height-black-black-30498418/"
      }
    ],
    "images": [
      "/images/catalog/stig-bar-stool/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 143
  },
  {
    "id": "ikea-lisabo-chair-2",
    "slug": "lisabo-chair-2",
    "category": "chairs",
    "model": "LISABO",
    "nameEn": "Lisabo Chair",
    "nameAr": "كرسي LISABO",
    "descEn": "Lisabo Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي LISABO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 38,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-chair-ash-tallmyra-white-black-30553706/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "ash"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "lisabo-chair-2-white",
        "colorId": "white",
        "materialId": "ash",
        "image": "/images/catalog/lisabo-chair-2/white.jpg",
        "priceOmr": 38,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-chair-ash-tallmyra-white-black-30553706/"
      }
    ],
    "images": [
      "/images/catalog/lisabo-chair-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 144
  },
  {
    "id": "ikea-tarno-chair",
    "slug": "tarno-chair",
    "category": "chairs",
    "model": "TÄRNÖ",
    "nameEn": "TäRnö Chair",
    "nameAr": "كرسي TÄRNÖ",
    "descEn": "TäRnö Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي TÄRNÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 15,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/taernoe-chair-outdoor-foldable-black-light-brown-stained-90095428/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "tarno-chair-black",
        "colorId": "black",
        "image": "/images/catalog/tarno-chair/black.jpg",
        "priceOmr": 15,
        "sourceUrl": "https://www.ikea.com/om/ar/p/taernoe-chair-outdoor-foldable-black-light-brown-stained-90095428/"
      }
    ],
    "images": [
      "/images/catalog/tarno-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 145
  },
  {
    "id": "ikea-arsunda-armchair",
    "slug": "arsunda-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "ÅRSUNDA",
    "nameEn": "åRsunda Armchair",
    "nameAr": "كرسي بذراعين ÅRSUNDA",
    "descEn": "åRsunda Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين ÅRSUNDA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 86,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/arsunda-armchair-knisa-light-grey-00535894/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "arsunda-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/arsunda-armchair/grey.jpg",
        "priceOmr": 86,
        "sourceUrl": "https://www.ikea.com/om/ar/p/arsunda-armchair-knisa-light-grey-00535894/"
      }
    ],
    "images": [
      "/images/catalog/arsunda-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 146
  },
  {
    "id": "ikea-skogsta-chair",
    "slug": "skogsta-chair",
    "category": "chairs",
    "model": "SKOGSTA",
    "nameEn": "Skogsta Chair",
    "nameAr": "كرسي SKOGSTA",
    "descEn": "Skogsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي SKOGSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 21,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-chair-acacia-70544866/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural",
      "black"
    ],
    "variants": [
      {
        "variantId": "skogsta-chair-natural",
        "colorId": "natural",
        "image": "/images/catalog/skogsta-chair/natural.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-chair-acacia-70544866/"
      },
      {
        "variantId": "skogsta-chair-black",
        "colorId": "black",
        "image": "/images/catalog/skogsta-chair/black.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-chair-black-50544867/"
      }
    ],
    "images": [
      "/images/catalog/skogsta-chair/natural.jpg",
      "/images/catalog/skogsta-chair/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 147
  },
  {
    "id": "ikea-rosentorp-chair-2",
    "slug": "rosentorp-chair-2",
    "category": "chairs",
    "model": "ROSENTORP",
    "nameEn": "Rosentorp Chair",
    "nameAr": "كرسي ROSENTORP",
    "descEn": "Rosentorp Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي ROSENTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 48,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-chair-tibbleby-beige-grey-black-30614173/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "white"
    ],
    "variants": [
      {
        "variantId": "rosentorp-chair-2-black",
        "colorId": "black",
        "image": "/images/catalog/rosentorp-chair-2/black.jpg",
        "priceOmr": 48,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-chair-tibbleby-beige-grey-black-30614173/"
      },
      {
        "variantId": "rosentorp-chair-2-white",
        "colorId": "white",
        "image": "/images/catalog/rosentorp-chair-2/white.jpg",
        "priceOmr": 48,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-chair-kilanda-light-beige-white-10614169/"
      }
    ],
    "images": [
      "/images/catalog/rosentorp-chair-2/black.jpg",
      "/images/catalog/rosentorp-chair-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 148
  },
  {
    "id": "ikea-linneback-armchair",
    "slug": "linneback-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "LINNEBÄCK",
    "nameEn": "LinnebäCk Armchair",
    "nameAr": "كرسي بذراعين LINNEBÄCK",
    "descEn": "LinnebäCk Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين LINNEBÄCK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 108,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/linnebaeck-easy-chair-orrsta-light-grey-70487229/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "linneback-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/linneback-armchair/grey.jpg",
        "gallery": [
          "/images/catalog/linneback-armchair/grey-1.jpg"
        ],
        "priceOmr": 108,
        "sourceUrl": "https://www.ikea.com/om/ar/p/linnebaeck-easy-chair-orrsta-light-grey-70487229/"
      }
    ],
    "images": [
      "/images/catalog/linneback-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 149
  },
  {
    "id": "ikea-fagerbacken-armchair",
    "slug": "fagerbacken-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "FAGERBACKEN",
    "nameEn": "Fagerbacken Armchair",
    "nameAr": "كرسي بذراعين FAGERBACKEN",
    "descEn": "Fagerbacken Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين FAGERBACKEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 129,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/fagerbacken-armchair-alhamn-dark-grey-blue-s79612672/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige",
      "brown"
    ],
    "variants": [
      {
        "variantId": "fagerbacken-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/fagerbacken-armchair/grey.jpg",
        "priceOmr": 129,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fagerbacken-armchair-alhamn-dark-grey-blue-s79612672/"
      },
      {
        "variantId": "fagerbacken-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/fagerbacken-armchair/beige.jpg",
        "priceOmr": 129,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fagerbacken-armchair-knaebaeck-light-beige-s49612678/"
      },
      {
        "variantId": "fagerbacken-armchair-brown",
        "colorId": "brown",
        "image": "/images/catalog/fagerbacken-armchair/brown.jpg",
        "priceOmr": 129,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fagerbacken-armchair-alhamn-dark-yellow-brown-s09612675/"
      }
    ],
    "images": [
      "/images/catalog/fagerbacken-armchair/grey.jpg",
      "/images/catalog/fagerbacken-armchair/beige.jpg",
      "/images/catalog/fagerbacken-armchair/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 150
  },
  {
    "id": "ikea-agen-chair",
    "slug": "agen-chair",
    "category": "chairs",
    "model": "AGEN",
    "nameEn": "Agen Chair",
    "nameAr": "كرسي AGEN",
    "descEn": "Agen Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي AGEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 24,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/agen-chair-rattan-bamboo-50058376/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "agen-chair-natural",
        "colorId": "natural",
        "materialId": "rattan",
        "image": "/images/catalog/agen-chair/natural.jpg",
        "priceOmr": 24,
        "sourceUrl": "https://www.ikea.com/om/ar/p/agen-chair-rattan-bamboo-50058376/"
      }
    ],
    "images": [
      "/images/catalog/agen-chair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 151
  },
  {
    "id": "ikea-skalsta-chair-13",
    "slug": "skalsta-chair-13",
    "category": "chairs",
    "model": "SKÅLSTA",
    "nameEn": "SkåLsta Chair",
    "nameAr": "كرسي SKÅLSTA",
    "descEn": "SkåLsta Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي SKÅLSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 29,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-walnut-veneer-tubular-metal-black-grey-s49608756/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "metal"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skalsta-chair-13-black",
        "colorId": "black",
        "materialId": "metal",
        "image": "/images/catalog/skalsta-chair-13/black.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skalsta-chair-walnut-veneer-tubular-metal-black-grey-s49608756/"
      }
    ],
    "images": [
      "/images/catalog/skalsta-chair-13/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 152
  },
  {
    "id": "ikea-rocksjon-armchair",
    "slug": "rocksjon-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "ROCKSJÖN",
    "nameEn": "RocksjöN Armchair",
    "nameAr": "كرسي بذراعين ROCKSJÖN",
    "descEn": "RocksjöN Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين ROCKSJÖN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 84,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/rocksjoen-armchair-klovsta-grey-white-s69514691/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "beige"
    ],
    "variants": [
      {
        "variantId": "rocksjon-armchair-white",
        "colorId": "white",
        "image": "/images/catalog/rocksjon-armchair/white.jpg",
        "gallery": [
          "/images/catalog/rocksjon-armchair/white-1.jpg"
        ],
        "priceOmr": 84,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rocksjoen-armchair-klovsta-grey-white-s69514691/"
      },
      {
        "variantId": "rocksjon-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/rocksjon-armchair/beige.jpg",
        "priceOmr": 84,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rocksjoen-armchair-kilanda-light-beige-s29508852/"
      }
    ],
    "images": [
      "/images/catalog/rocksjon-armchair/white.jpg",
      "/images/catalog/rocksjon-armchair/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 153
  },
  {
    "id": "ikea-ekenaset-armchair",
    "slug": "ekenaset-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "EKENÄSET",
    "nameEn": "EkenäSet Armchair",
    "nameAr": "كرسي بذراعين EKENÄSET",
    "descEn": "EkenäSet Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين EKENÄSET — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 134,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ekenaeset-armchair-kilanda-light-beige-90533174/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "ekenaset-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/ekenaset-armchair/beige.jpg",
        "priceOmr": 134,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ekenaeset-armchair-kilanda-light-beige-90533174/"
      },
      {
        "variantId": "ekenaset-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/ekenaset-armchair/grey.jpg",
        "priceOmr": 134,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ekenaeset-armchair-kelinge-grey-turquoise-80533481/"
      }
    ],
    "images": [
      "/images/catalog/ekenaset-armchair/beige.jpg",
      "/images/catalog/ekenaset-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 154
  },
  {
    "id": "ikea-vihals-folding-chair",
    "slug": "vihals-folding-chair",
    "category": "chairs",
    "subcategory": "folding-chair",
    "model": "VIHALS",
    "nameEn": "Vihals Folding Chair",
    "nameAr": "كرسي قابل للطي VIHALS",
    "descEn": "Vihals Folding Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي قابل للطي VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 9,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-folding-chair-white-30569104/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "red"
    ],
    "variants": [
      {
        "variantId": "vihals-folding-chair-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-folding-chair/white.jpg",
        "priceOmr": 9,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-folding-chair-white-30569104/"
      },
      {
        "variantId": "vihals-folding-chair-red",
        "colorId": "red",
        "image": "/images/catalog/vihals-folding-chair/red.jpg",
        "priceOmr": 9,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-folding-chair-red-70592744/"
      }
    ],
    "images": [
      "/images/catalog/vihals-folding-chair/white.jpg",
      "/images/catalog/vihals-folding-chair/red.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 155
  },
  {
    "id": "ikea-tonstad-chair-3",
    "slug": "tonstad-chair-3",
    "category": "chairs",
    "model": "TONSTAD",
    "nameEn": "Tonstad Chair",
    "nameAr": "كرسي TONSTAD",
    "descEn": "Tonstad Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 40,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-fridtuna-light-beige-brown-oak-effect-s39596259/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tonstad-chair-3-beige",
        "colorId": "beige",
        "materialId": "oak",
        "image": "/images/catalog/tonstad-chair-3/beige.jpg",
        "priceOmr": 40,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-fridtuna-light-beige-brown-oak-effect-s39596259/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-chair-3/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 156
  },
  {
    "id": "ikea-kivik-sofa-bed",
    "slug": "kivik-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "KIVIK",
    "nameEn": "Kivik Sofa-bed",
    "nameAr": "كنبة سرير KIVIK",
    "descEn": "Kivik Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير KIVIK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 566,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-tresund-light-beige-s09470237/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey",
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "kivik-sofa-bed-beige",
        "colorId": "beige",
        "image": "/images/catalog/kivik-sofa-bed/beige.jpg",
        "priceOmr": 566,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-tresund-light-beige-s09470237/"
      },
      {
        "variantId": "kivik-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/kivik-sofa-bed/grey.jpg",
        "gallery": [
          "/images/catalog/kivik-sofa-bed/grey-1.jpg"
        ],
        "priceOmr": 566,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-kelinge-grey-turquoise-s19470227/"
      },
      {
        "variantId": "kivik-sofa-bed-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/kivik-sofa-bed/charcoal.jpg",
        "priceOmr": 566,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-tresund-anthracite-s89470243/"
      }
    ],
    "images": [
      "/images/catalog/kivik-sofa-bed/beige.jpg",
      "/images/catalog/kivik-sofa-bed/grey.jpg",
      "/images/catalog/kivik-sofa-bed/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 157
  },
  {
    "id": "ikea-strandmon-armchair-2",
    "slug": "strandmon-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STRANDMON",
    "nameEn": "Strandmon Armchair",
    "nameAr": "كرسي بذراعين STRANDMON",
    "descEn": "Strandmon Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STRANDMON — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 157,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-sulviken-blue-beige-00613170/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "yellow",
      "brown"
    ],
    "variants": [
      {
        "variantId": "strandmon-armchair-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/strandmon-armchair-2/beige.jpg",
        "priceOmr": 157,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-sulviken-blue-beige-00613170/"
      },
      {
        "variantId": "strandmon-armchair-2-yellow",
        "colorId": "yellow",
        "image": "/images/catalog/strandmon-armchair-2/yellow.jpg",
        "priceOmr": 157,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-tibbleby-yellow-00613165/"
      },
      {
        "variantId": "strandmon-armchair-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/strandmon-armchair-2/brown.jpg",
        "priceOmr": 157,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-tommaboda-brown-red-30613164/"
      }
    ],
    "images": [
      "/images/catalog/strandmon-armchair-2/beige.jpg",
      "/images/catalog/strandmon-armchair-2/yellow.jpg",
      "/images/catalog/strandmon-armchair-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 158
  },
  {
    "id": "ikea-strandmon-armchair-3",
    "slug": "strandmon-armchair-3",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STRANDMON",
    "nameEn": "Strandmon Armchair",
    "nameAr": "كرسي بذراعين STRANDMON",
    "descEn": "Strandmon Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STRANDMON — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 82,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-with-footstool-sulviken-blue-beige-s99590339/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "strandmon-armchair-3-beige",
        "colorId": "beige",
        "image": "/images/catalog/strandmon-armchair-3/beige.jpg",
        "gallery": [
          "/images/catalog/strandmon-armchair-3/beige-1.jpg"
        ],
        "priceOmr": 82,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-with-footstool-sulviken-blue-beige-s99590339/"
      },
      {
        "variantId": "strandmon-armchair-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/strandmon-armchair-3/grey.jpg",
        "priceOmr": 82,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-with-footstool-nordvalla-dark-grey-s39618100/"
      }
    ],
    "images": [
      "/images/catalog/strandmon-armchair-3/beige.jpg",
      "/images/catalog/strandmon-armchair-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 159
  },
  {
    "id": "ikea-fejan-chair",
    "slug": "fejan-chair",
    "category": "chairs",
    "model": "FEJAN",
    "nameEn": "Fejan Chair",
    "nameAr": "كرسي FEJAN",
    "descEn": "Fejan Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي FEJAN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 21,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/fejan-chair-outdoor-foldable-white-10255307/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "fejan-chair-white",
        "colorId": "white",
        "image": "/images/catalog/fejan-chair/white.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fejan-chair-outdoor-foldable-white-10255307/"
      }
    ],
    "images": [
      "/images/catalog/fejan-chair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 160
  },
  {
    "id": "ikea-malinda-chair-pad",
    "slug": "malinda-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "MALINDA",
    "nameEn": "Malinda Chair Pad",
    "nameAr": "وسادة كرسي MALINDA",
    "descEn": "Malinda Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي MALINDA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 4,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malinda-chair-cushion-light-beige-10209202/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 38,
      "heightCm": 7
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige",
      "red",
      "grey"
    ],
    "variants": [
      {
        "variantId": "malinda-chair-pad-beige",
        "colorId": "beige",
        "image": "/images/catalog/malinda-chair-pad/beige.jpg",
        "gallery": [
          "/images/catalog/malinda-chair-pad/beige-1.jpg"
        ],
        "priceOmr": 4,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malinda-chair-cushion-light-beige-10209202/"
      },
      {
        "variantId": "malinda-chair-pad-red",
        "colorId": "red",
        "image": "/images/catalog/malinda-chair-pad/red.jpg",
        "priceOmr": 4,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malinda-chair-cushion-dark-red-10572800/"
      },
      {
        "variantId": "malinda-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/malinda-chair-pad/grey.jpg",
        "priceOmr": 4,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malinda-chair-cushion-grey-10331014/"
      }
    ],
    "images": [
      "/images/catalog/malinda-chair-pad/beige.jpg",
      "/images/catalog/malinda-chair-pad/red.jpg",
      "/images/catalog/malinda-chair-pad/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 161
  },
  {
    "id": "ikea-ulriksberg-armchair",
    "slug": "ulriksberg-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "ULRIKSBERG",
    "nameEn": "Ulriksberg Armchair",
    "nameAr": "كرسي بذراعين ULRIKSBERG",
    "descEn": "Ulriksberg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين ULRIKSBERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 49,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ulriksberg-armchair-rattan-anthracite-90434310/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "ulriksberg-armchair-charcoal",
        "colorId": "charcoal",
        "materialId": "rattan",
        "image": "/images/catalog/ulriksberg-armchair/charcoal.jpg",
        "priceOmr": 49,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ulriksberg-armchair-rattan-anthracite-90434310/"
      }
    ],
    "images": [
      "/images/catalog/ulriksberg-armchair/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 162
  },
  {
    "id": "ikea-agen-armchair",
    "slug": "agen-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "AGEN",
    "nameEn": "Agen Armchair",
    "nameAr": "كرسي بذراعين AGEN",
    "descEn": "Agen Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين AGEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 146,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/agen-armchair-with-cushion-rattan-norna-natural-s19390773/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "agen-armchair-natural",
        "colorId": "natural",
        "materialId": "rattan",
        "image": "/images/catalog/agen-armchair/natural.jpg",
        "priceOmr": 146,
        "sourceUrl": "https://www.ikea.com/om/ar/p/agen-armchair-with-cushion-rattan-norna-natural-s19390773/"
      }
    ],
    "images": [
      "/images/catalog/agen-armchair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 163
  },
  {
    "id": "ikea-dalfred-bar-stool",
    "slug": "dalfred-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "DALFRED",
    "nameEn": "Dalfred Bar Stool",
    "nameAr": "كرسي بار DALFRED",
    "descEn": "Dalfred Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بار DALFRED — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 55,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/dalfred-bar-stool-birch-80613091/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 74,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural",
      "black"
    ],
    "variants": [
      {
        "variantId": "dalfred-bar-stool-natural",
        "colorId": "natural",
        "image": "/images/catalog/dalfred-bar-stool/natural.jpg",
        "priceOmr": 55,
        "sourceUrl": "https://www.ikea.com/om/ar/p/dalfred-bar-stool-birch-80613091/"
      },
      {
        "variantId": "dalfred-bar-stool-black",
        "colorId": "black",
        "image": "/images/catalog/dalfred-bar-stool/black.jpg",
        "priceOmr": 55,
        "sourceUrl": "https://www.ikea.com/om/ar/p/dalfred-bar-stool-black-60155602/"
      }
    ],
    "images": [
      "/images/catalog/dalfred-bar-stool/natural.jpg",
      "/images/catalog/dalfred-bar-stool/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 164
  },
  {
    "id": "ikea-brannboll-chair",
    "slug": "brannboll-chair",
    "category": "chairs",
    "model": "BRÄNNBOLL",
    "nameEn": "BräNnboll Chair",
    "nameAr": "كرسي BRÄNNBOLL",
    "descEn": "BräNnboll Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BRÄNNBOLL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 55,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-inflatable-gaming-lounge-chair-bright-orange-90586285/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "orange"
    ],
    "variants": [
      {
        "variantId": "brannboll-chair-orange",
        "colorId": "orange",
        "image": "/images/catalog/brannboll-chair/orange.jpg",
        "priceOmr": 55,
        "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-inflatable-gaming-lounge-chair-bright-orange-90586285/"
      }
    ],
    "images": [
      "/images/catalog/brannboll-chair/orange.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 165
  },
  {
    "id": "ikea-ikea-ps-lomsk-armchair",
    "slug": "ikea-ps-lomsk-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "IKEA PS LÖMSK",
    "nameEn": "Ikea Ps LöMsk Armchair",
    "nameAr": "كرسي بذراعين IKEA PS LÖMSK",
    "descEn": "Ikea Ps LöMsk Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين IKEA PS LÖMSK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 117,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-loemsk-swivel-armchair-white-red-10407136/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-lomsk-armchair-white",
        "colorId": "white",
        "image": "/images/catalog/ikea-ps-lomsk-armchair/white.jpg",
        "priceOmr": 117,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-loemsk-swivel-armchair-white-red-10407136/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-lomsk-armchair/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 166
  },
  {
    "id": "ikea-holmsta-froknabo-armchair",
    "slug": "holmsta-froknabo-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "HOLMSTA / FRÖKNABO",
    "nameEn": "Holmsta / FröKnabo Armchair",
    "nameAr": "كرسي بذراعين HOLMSTA / FRÖKNABO",
    "descEn": "Holmsta / FröKnabo Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين HOLMSTA / FRÖKNABO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 131,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/holmsta-froeknabo-armchair-s19428808/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "holmsta-froknabo-armchair-natural",
        "colorId": "natural",
        "image": "/images/catalog/holmsta-froknabo-armchair/natural.jpg",
        "priceOmr": 131,
        "sourceUrl": "https://www.ikea.com/om/ar/p/holmsta-froeknabo-armchair-s19428808/"
      }
    ],
    "images": [
      "/images/catalog/holmsta-froknabo-armchair/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 167
  },
  {
    "id": "ikea-poang-armchair-11",
    "slug": "poang-armchair-11",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 68,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-birch-veneer-vissle-deep-green-s79625472/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural",
      "beige"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-11-natural",
        "colorId": "natural",
        "image": "/images/catalog/poang-armchair-11/natural.jpg",
        "gallery": [
          "/images/catalog/poang-armchair-11/natural-1.jpg"
        ],
        "priceOmr": 68,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-birch-veneer-vissle-deep-green-s79625472/"
      },
      {
        "variantId": "poang-armchair-11-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair-11/beige.jpg",
        "priceOmr": 68,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-birch-veneer-kelinge-beige-s59625699/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-11/natural.jpg",
      "/images/catalog/poang-armchair-11/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 168
  },
  {
    "id": "ikea-poang-armchair-12",
    "slug": "poang-armchair-12",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 162,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-dark-green-kelinge-beige-s89625688/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-12-beige",
        "colorId": "beige",
        "image": "/images/catalog/poang-armchair-12/beige.jpg",
        "gallery": [
          "/images/catalog/poang-armchair-12/beige-1.jpg"
        ],
        "priceOmr": 162,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-dark-green-kelinge-beige-s89625688/"
      },
      {
        "variantId": "poang-armchair-12-grey",
        "colorId": "grey",
        "image": "/images/catalog/poang-armchair-12/grey.jpg",
        "priceOmr": 162,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-dark-green-gunnared-dark-grey-s59625468/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-12/beige.jpg",
      "/images/catalog/poang-armchair-12/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 169
  },
  {
    "id": "ikea-poang-armchair-13",
    "slug": "poang-armchair-13",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 87,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-dark-green-vissle-deep-green-s79618693/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-13-green",
        "colorId": "green",
        "image": "/images/catalog/poang-armchair-13/green.jpg",
        "priceOmr": 87,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-and-footstool-dark-green-vissle-deep-green-s79618693/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-13/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 170
  },
  {
    "id": "ikea-poang-armchair-14",
    "slug": "poang-armchair-14",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "POÄNG",
    "nameEn": "PoäNg Armchair",
    "nameAr": "كرسي بذراعين POÄNG",
    "descEn": "PoäNg Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 105,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-dark-green-vissle-deep-green-s79618688/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "poang-armchair-14-green",
        "colorId": "green",
        "image": "/images/catalog/poang-armchair-14/green.jpg",
        "priceOmr": 105,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-armchair-dark-green-vissle-deep-green-s79618688/"
      }
    ],
    "images": [
      "/images/catalog/poang-armchair-14/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 171
  },
  {
    "id": "ikea-nordviken-bar-stool",
    "slug": "nordviken-bar-stool",
    "category": "chairs",
    "subcategory": "bar-stool",
    "model": "NORDVIKEN",
    "nameEn": "Nordviken Bar Stool",
    "nameAr": "كرسي بار NORDVIKEN",
    "descEn": "Nordviken Bar Stool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بار NORDVIKEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 49,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nordviken-bar-stool-with-backrest-black-80369112/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 45,
      "heightCm": 75,
      "seatHeightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "nordviken-bar-stool-black",
        "colorId": "black",
        "image": "/images/catalog/nordviken-bar-stool/black.jpg",
        "priceOmr": 49,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nordviken-bar-stool-with-backrest-black-80369112/"
      }
    ],
    "images": [
      "/images/catalog/nordviken-bar-stool/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 172
  },
  {
    "id": "ikea-strandmon-armchair-4",
    "slug": "strandmon-armchair-4",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STRANDMON",
    "nameEn": "Strandmon Armchair",
    "nameAr": "كرسي بذراعين STRANDMON",
    "descEn": "Strandmon Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STRANDMON — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 100,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-grann-bomstad-dark-brown-00494638/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "strandmon-armchair-4-brown",
        "colorId": "brown",
        "image": "/images/catalog/strandmon-armchair-4/brown.jpg",
        "priceOmr": 100,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-wing-chair-grann-bomstad-dark-brown-00494638/"
      }
    ],
    "images": [
      "/images/catalog/strandmon-armchair-4/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 173
  },
  {
    "id": "ikea-tornsborg-bed-frame",
    "slug": "tornsborg-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TORNSBORG",
    "nameEn": "Tornsborg Bed Frame",
    "nameAr": "هيكل سرير TORNSBORG",
    "descEn": "Tornsborg Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TORNSBORG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-armchair-bed-naggen-beige-pine-50582411/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tornsborg-bed-frame-beige",
        "colorId": "beige",
        "image": "/images/catalog/tornsborg-bed-frame/beige.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-armchair-bed-naggen-beige-pine-50582411/"
      }
    ],
    "images": [
      "/images/catalog/tornsborg-bed-frame/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 174
  },
  {
    "id": "ikea-tonstad-chair-4",
    "slug": "tonstad-chair-4",
    "category": "chairs",
    "model": "TONSTAD",
    "nameEn": "Tonstad Chair",
    "nameAr": "كرسي TONSTAD",
    "descEn": "Tonstad Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 33,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-fridtuna-light-beige-off-white-s79596262/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "tonstad-chair-4-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-chair-4/ivory.jpg",
        "priceOmr": 33,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-chair-fridtuna-light-beige-off-white-s79596262/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-chair-4/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 175
  },
  {
    "id": "ikea-risholmen-armchair",
    "slug": "risholmen-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "RISHOLMEN",
    "nameEn": "Risholmen Armchair",
    "nameAr": "كرسي بذراعين RISHOLMEN",
    "descEn": "Risholmen Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين RISHOLMEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 139,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/risholmen-wing-chair-in-outdoor-brown-00503794/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "risholmen-armchair-brown",
        "colorId": "brown",
        "image": "/images/catalog/risholmen-armchair/brown.jpg",
        "priceOmr": 139,
        "sourceUrl": "https://www.ikea.com/om/ar/p/risholmen-wing-chair-in-outdoor-brown-00503794/"
      }
    ],
    "images": [
      "/images/catalog/risholmen-armchair/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 176
  },
  {
    "id": "ikea-ekenaset-armchair-2",
    "slug": "ekenaset-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "EKENÄSET",
    "nameEn": "EkenäSet Armchair",
    "nameAr": "كرسي بذراعين EKENÄSET",
    "descEn": "EkenäSet Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين EKENÄSET — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 79,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ekenaeset-armchair-jonsbyn-black-70539011/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "ekenaset-armchair-2-black",
        "colorId": "black",
        "image": "/images/catalog/ekenaset-armchair-2/black.jpg",
        "priceOmr": 79,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ekenaeset-armchair-jonsbyn-black-70539011/"
      }
    ],
    "images": [
      "/images/catalog/ekenaset-armchair-2/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 177
  },
  {
    "id": "ikea-brannboll-chair-2",
    "slug": "brannboll-chair-2",
    "category": "chairs",
    "model": "BRÄNNBOLL",
    "nameEn": "BräNnboll Chair",
    "nameAr": "كرسي BRÄNNBOLL",
    "descEn": "BräNnboll Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي BRÄNNBOLL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 14,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-gaming-lounge-chair-knisa-bright-blue-70586615/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "blue"
    ],
    "variants": [
      {
        "variantId": "brannboll-chair-2-blue",
        "colorId": "blue",
        "image": "/images/catalog/brannboll-chair-2/blue.jpg",
        "priceOmr": 14,
        "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-gaming-lounge-chair-knisa-bright-blue-70586615/"
      }
    ],
    "images": [
      "/images/catalog/brannboll-chair-2/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 178
  },
  {
    "id": "ikea-strandmon-armchair-5",
    "slug": "strandmon-armchair-5",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "STRANDMON",
    "nameEn": "Strandmon Armchair",
    "nameAr": "كرسي بذراعين STRANDMON",
    "descEn": "Strandmon Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين STRANDMON — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 156,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-armchair-and-footstool-grann-bomstad-dark-brown-s09483904/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "strandmon-armchair-5-brown",
        "colorId": "brown",
        "image": "/images/catalog/strandmon-armchair-5/brown.jpg",
        "priceOmr": 156,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandmon-armchair-and-footstool-grann-bomstad-dark-brown-s09483904/"
      }
    ],
    "images": [
      "/images/catalog/strandmon-armchair-5/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 179
  },
  {
    "id": "ikea-vimle-armchair",
    "slug": "vimle-armchair",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "VIMLE",
    "nameEn": "Vimle Armchair",
    "nameAr": "كرسي بذراعين VIMLE",
    "descEn": "Vimle Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 155,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-hallarp-beige-s19477158/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-armchair-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-armchair/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-armchair/beige-1.jpg"
        ],
        "priceOmr": 155,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-hallarp-beige-s19477158/"
      },
      {
        "variantId": "vimle-armchair-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-armchair/grey.jpg",
        "gallery": [
          "/images/catalog/vimle-armchair/grey-1.jpg"
        ],
        "priceOmr": 155,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-hallarp-grey-s99477159/"
      }
    ],
    "images": [
      "/images/catalog/vimle-armchair/beige.jpg",
      "/images/catalog/vimle-armchair/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 180
  },
  {
    "id": "ikea-viskafors-sofa",
    "slug": "viskafors-sofa",
    "category": "sofas",
    "model": "VISKAFORS",
    "nameEn": "Viskafors Sofa",
    "nameAr": "كنبة VISKAFORS",
    "descEn": "Viskafors Sofa — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة VISKAFORS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 384,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/viskafors-1-5-seat-armchair-lejde-light-beige-birch-s89443278/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "viskafors-sofa-beige",
        "colorId": "beige",
        "image": "/images/catalog/viskafors-sofa/beige.jpg",
        "priceOmr": 384,
        "sourceUrl": "https://www.ikea.com/om/ar/p/viskafors-1-5-seat-armchair-lejde-light-beige-birch-s89443278/"
      },
      {
        "variantId": "viskafors-sofa-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/viskafors-sofa/charcoal.jpg",
        "gallery": [
          "/images/catalog/viskafors-sofa/charcoal-1.jpg"
        ],
        "priceOmr": 384,
        "sourceUrl": "https://www.ikea.com/om/ar/p/viskafors-1-5-seat-armchair-lejde-anthracite-brown-s99443292/"
      }
    ],
    "images": [
      "/images/catalog/viskafors-sofa/beige.jpg",
      "/images/catalog/viskafors-sofa/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 181
  },
  {
    "id": "ikea-ikea-ps-2026-armchair-2",
    "slug": "ikea-ps-2026-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Armchair",
    "nameAr": "كرسي بذراعين IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 122,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-easy-chair-with-inflatable-seat-back-cushion-knaebaeck-bright-green-90623202/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-armchair-2-green",
        "colorId": "green",
        "image": "/images/catalog/ikea-ps-2026-armchair-2/green.jpg",
        "priceOmr": 122,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-easy-chair-with-inflatable-seat-back-cushion-knaebaeck-bright-green-90623202/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-armchair-2/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 182
  },
  {
    "id": "ikea-vimle-armchair-2",
    "slug": "vimle-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "VIMLE",
    "nameEn": "Vimle Armchair",
    "nameAr": "كرسي بذراعين VIMLE",
    "descEn": "Vimle Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-with-wide-armrests-gunnared-beige-s79477179/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-armchair-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-armchair-2/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-armchair-2/beige-1.jpg"
        ],
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-with-wide-armrests-gunnared-beige-s79477179/"
      },
      {
        "variantId": "vimle-armchair-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-armchair-2/grey.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-with-wide-armrests-hallarp-grey-s29477191/"
      }
    ],
    "images": [
      "/images/catalog/vimle-armchair-2/beige.jpg",
      "/images/catalog/vimle-armchair-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 183
  },
  {
    "id": "ikea-poang-rocking-chair-2",
    "slug": "poang-rocking-chair-2",
    "category": "chairs",
    "subcategory": "rocking-chair",
    "model": "POÄNG",
    "nameEn": "PoäNg Rocking Chair",
    "nameAr": "كرسي هزّاز POÄNG",
    "descEn": "PoäNg Rocking Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي هزّاز POÄNG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 92,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-rocking-chair-walnut-effect-vissle-deep-green-s99625843/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "walnut",
      "black"
    ],
    "variants": [
      {
        "variantId": "poang-rocking-chair-2-walnut",
        "colorId": "walnut",
        "materialId": "walnut",
        "image": "/images/catalog/poang-rocking-chair-2/walnut.jpg",
        "gallery": [
          "/images/catalog/poang-rocking-chair-2/walnut-1.jpg"
        ],
        "priceOmr": 92,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-rocking-chair-walnut-effect-vissle-deep-green-s99625843/"
      },
      {
        "variantId": "poang-rocking-chair-2-black",
        "colorId": "black",
        "materialId": "walnut",
        "image": "/images/catalog/poang-rocking-chair-2/black.jpg",
        "priceOmr": 92,
        "sourceUrl": "https://www.ikea.com/om/ar/p/poaeng-rocking-chair-walnut-effect-knisa-black-s79625844/"
      }
    ],
    "images": [
      "/images/catalog/poang-rocking-chair-2/walnut.jpg",
      "/images/catalog/poang-rocking-chair-2/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 184
  },
  {
    "id": "ikea-vimle-armchair-3",
    "slug": "vimle-armchair-3",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "VIMLE",
    "nameEn": "Vimle Armchair",
    "nameAr": "كرسي بذراعين VIMLE",
    "descEn": "Vimle Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 135,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-grann-bomstad-black-s19476837/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "vimle-armchair-3-black",
        "colorId": "black",
        "image": "/images/catalog/vimle-armchair-3/black.jpg",
        "priceOmr": 135,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-armchair-grann-bomstad-black-s19476837/"
      }
    ],
    "images": [
      "/images/catalog/vimle-armchair-3/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 185
  },
  {
    "id": "ikea-soderhamn-armchair-2",
    "slug": "soderhamn-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "SÖDERHAMN",
    "nameEn": "SöDerhamn Armchair",
    "nameAr": "كرسي بذراعين SÖDERHAMN",
    "descEn": "SöDerhamn Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين SÖDERHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 125,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-armchair-s69330512/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "soderhamn-armchair-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/soderhamn-armchair-2/natural.jpg",
        "priceOmr": 125,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-armchair-s69330512/"
      }
    ],
    "images": [
      "/images/catalog/soderhamn-armchair-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 186
  },
  {
    "id": "ikea-rocksjon-armchair-2",
    "slug": "rocksjon-armchair-2",
    "category": "chairs",
    "subcategory": "armchair",
    "model": "ROCKSJÖN",
    "nameEn": "RocksjöN Armchair",
    "nameAr": "كرسي بذراعين ROCKSJÖN",
    "descEn": "RocksjöN Armchair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كرسي بذراعين ROCKSJÖN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 154,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/rocksjoen-armchair-with-footstool-blekinge-white-s89508892/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 75,
      "heightCm": 90,
      "seatHeightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "beige"
    ],
    "variants": [
      {
        "variantId": "rocksjon-armchair-2-white",
        "colorId": "white",
        "image": "/images/catalog/rocksjon-armchair-2/white.jpg",
        "gallery": [
          "/images/catalog/rocksjon-armchair-2/white-1.jpg"
        ],
        "priceOmr": 154,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rocksjoen-armchair-with-footstool-blekinge-white-s89508892/"
      },
      {
        "variantId": "rocksjon-armchair-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/rocksjon-armchair-2/beige.jpg",
        "priceOmr": 154,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rocksjoen-armchair-with-footstool-kilanda-light-beige-s69508893/"
      }
    ],
    "images": [
      "/images/catalog/rocksjon-armchair-2/white.jpg",
      "/images/catalog/rocksjon-armchair-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 187
  },
  {
    "id": "ikea-ramsnas-chair",
    "slug": "ramsnas-chair",
    "category": "chairs",
    "model": "RAMSNÄS",
    "nameEn": "RamsnäS Chair",
    "nameAr": "كرسي RAMSNÄS",
    "descEn": "RamsnäS Chair — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كرسي RAMSNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 36,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ramsnaes-chair-anthracite-vissle-dark-grey-90636445/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 55,
      "heightCm": 82,
      "seatHeightCm": 46
    },
    "dimensionsKnown": false,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "ramsnas-chair-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/ramsnas-chair/charcoal.jpg",
        "priceOmr": 36,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ramsnaes-chair-anthracite-vissle-dark-grey-90636445/"
      }
    ],
    "images": [
      "/images/catalog/ramsnas-chair/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 188
  },
  {
    "id": "ikea-vihals-table",
    "slug": "vihals-table",
    "category": "dining",
    "model": "VIHALS",
    "nameEn": "Vihals Table",
    "nameAr": "طاولة VIHALS",
    "descEn": "Vihals Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 194,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-table-white-white-s59578508/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 74,
      "depthCm": 74,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-table-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-table/white.jpg",
        "priceOmr": 194,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-table-white-white-s59578508/"
      }
    ],
    "images": [
      "/images/catalog/vihals-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 189
  },
  {
    "id": "ikea-sandsberg-table",
    "slug": "sandsberg-table",
    "category": "dining",
    "model": "SANDSBERG",
    "nameEn": "Sandsberg Table",
    "nameAr": "طاولة SANDSBERG",
    "descEn": "Sandsberg Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة SANDSBERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 65,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-table-black-s59420400/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 67,
      "depthCm": 67,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "sandsberg-table-black",
        "colorId": "black",
        "image": "/images/catalog/sandsberg-table/black.jpg",
        "gallery": [
          "/images/catalog/sandsberg-table/black-1.jpg"
        ],
        "priceOmr": 65,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandsberg-table-black-s59420400/"
      }
    ],
    "images": [
      "/images/catalog/sandsberg-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 190
  },
  {
    "id": "ikea-vittsjo-nest-of-tables",
    "slug": "vittsjo-nest-of-tables",
    "category": "side-tables",
    "subcategory": "nest",
    "model": "VITTSJÖ",
    "nameEn": "Vittsjö Nest of Tables",
    "nameAr": "طاولات متداخلة VITTSJÖ",
    "descEn": "Vittsjö Nest of Tables — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولات متداخلة VITTSJÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 54,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-nest-of-tables-set-of-2-light-beige-glass-90604350/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige",
      "black"
    ],
    "variants": [
      {
        "variantId": "vittsjo-nest-of-tables-beige",
        "colorId": "beige",
        "materialId": "glass",
        "image": "/images/catalog/vittsjo-nest-of-tables/beige.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-nest-of-tables-set-of-2-light-beige-glass-90604350/"
      },
      {
        "variantId": "vittsjo-nest-of-tables-black",
        "colorId": "black",
        "materialId": "glass",
        "image": "/images/catalog/vittsjo-nest-of-tables/black.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-nest-of-tables-set-of-2-black-brown-glass-80215332/"
      }
    ],
    "images": [
      "/images/catalog/vittsjo-nest-of-tables/beige.jpg",
      "/images/catalog/vittsjo-nest-of-tables/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 191
  },
  {
    "id": "ikea-lack-side-table",
    "slug": "lack-side-table",
    "category": "side-tables",
    "model": "LACK",
    "nameEn": "Lack Side Table",
    "nameAr": "طاولة جانبية LACK",
    "descEn": "Lack Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية LACK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 63,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lack-side-table-white-30449908/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 55,
      "depthCm": 55,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "lack-side-table-white",
        "colorId": "white",
        "image": "/images/catalog/lack-side-table/white.jpg",
        "gallery": [
          "/images/catalog/lack-side-table/white-1.jpg"
        ],
        "priceOmr": 63,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-side-table-white-30449908/"
      },
      {
        "variantId": "lack-side-table-black",
        "colorId": "black",
        "image": "/images/catalog/lack-side-table/black.jpg",
        "priceOmr": 63,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-side-table-black-brown-80104268/"
      }
    ],
    "images": [
      "/images/catalog/lack-side-table/white.jpg",
      "/images/catalog/lack-side-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 192
  },
  {
    "id": "ikea-lack-coffee-table",
    "slug": "lack-coffee-table",
    "category": "coffee-tables",
    "model": "LACK",
    "nameEn": "Lack Coffee Table",
    "nameAr": "طاولة قهوة LACK",
    "descEn": "Lack Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة LACK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 101,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lack-coffee-table-white-90449905/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 55,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "lack-coffee-table-white",
        "colorId": "white",
        "image": "/images/catalog/lack-coffee-table/white.jpg",
        "gallery": [
          "/images/catalog/lack-coffee-table/white-1.jpg"
        ],
        "priceOmr": 101,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-coffee-table-white-90449905/"
      },
      {
        "variantId": "lack-coffee-table-black",
        "colorId": "black",
        "image": "/images/catalog/lack-coffee-table/black.jpg",
        "priceOmr": 101,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-coffee-table-black-brown-40104294/"
      }
    ],
    "images": [
      "/images/catalog/lack-coffee-table/white.jpg",
      "/images/catalog/lack-coffee-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 193
  },
  {
    "id": "ikea-vihals-table-2",
    "slug": "vihals-table-2",
    "category": "dining",
    "model": "VIHALS",
    "nameEn": "Vihals Table",
    "nameAr": "طاولة VIHALS",
    "descEn": "Vihals Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 140,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-table-white-white-s39578509/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 125,
      "depthCm": 74,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-table-2/white.jpg",
        "priceOmr": 140,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-table-white-white-s39578509/"
      }
    ],
    "images": [
      "/images/catalog/vihals-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 194
  },
  {
    "id": "ikea-vihals-table-3",
    "slug": "vihals-table-3",
    "category": "dining",
    "model": "VIHALS",
    "nameEn": "Vihals Table",
    "nameAr": "طاولة VIHALS",
    "descEn": "Vihals Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 61,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-table-white-white-s49589970/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 107
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-table-3-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-table-3/white.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-table-white-white-s49589970/"
      }
    ],
    "images": [
      "/images/catalog/vihals-table-3/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 195
  },
  {
    "id": "ikea-nissafors-trolley",
    "slug": "nissafors-trolley",
    "category": "storage",
    "subcategory": "trolley",
    "model": "NISSAFORS",
    "nameEn": "Nissafors Trolley",
    "nameAr": "عربة NISSAFORS",
    "descEn": "Nissafors Trolley — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 4 colour/finish options. Price is an estimate in OMR.",
    "descAr": "عربة NISSAFORS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 4 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 61,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nissafors-trolley-white-40465733/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 30,
      "depthCm": 83,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black",
      "beige",
      "green"
    ],
    "variants": [
      {
        "variantId": "nissafors-trolley-white",
        "colorId": "white",
        "image": "/images/catalog/nissafors-trolley/white.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nissafors-trolley-white-40465733/"
      },
      {
        "variantId": "nissafors-trolley-black",
        "colorId": "black",
        "image": "/images/catalog/nissafors-trolley/black.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nissafors-trolley-black-20399777/"
      },
      {
        "variantId": "nissafors-trolley-beige",
        "colorId": "beige",
        "image": "/images/catalog/nissafors-trolley/beige.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nissafors-trolley-beige-40585801/"
      },
      {
        "variantId": "nissafors-trolley-green",
        "colorId": "green",
        "image": "/images/catalog/nissafors-trolley/green.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nissafors-trolley-light-green-10606782/"
      }
    ],
    "images": [
      "/images/catalog/nissafors-trolley/white.jpg",
      "/images/catalog/nissafors-trolley/black.jpg",
      "/images/catalog/nissafors-trolley/beige.jpg",
      "/images/catalog/nissafors-trolley/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 196
  },
  {
    "id": "ikea-vittsjo-coffee-table",
    "slug": "vittsjo-coffee-table",
    "category": "coffee-tables",
    "model": "VITTSJÖ",
    "nameEn": "Vittsjö Coffee Table",
    "nameAr": "طاولة قهوة VITTSJÖ",
    "descEn": "Vittsjö Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة VITTSJÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 54,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-coffee-table-light-beige-glass-30604348/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 75
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige",
      "black"
    ],
    "variants": [
      {
        "variantId": "vittsjo-coffee-table-beige",
        "colorId": "beige",
        "materialId": "glass",
        "image": "/images/catalog/vittsjo-coffee-table/beige.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-coffee-table-light-beige-glass-30604348/"
      },
      {
        "variantId": "vittsjo-coffee-table-black",
        "colorId": "black",
        "materialId": "glass",
        "image": "/images/catalog/vittsjo-coffee-table/black.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-coffee-table-black-brown-glass-80213309/"
      }
    ],
    "images": [
      "/images/catalog/vittsjo-coffee-table/beige.jpg",
      "/images/catalog/vittsjo-coffee-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 197
  },
  {
    "id": "ikea-brannboll-table",
    "slug": "brannboll-table",
    "category": "dining",
    "model": "BRÄNNBOLL",
    "nameEn": "BräNnboll Table",
    "nameAr": "طاولة BRÄNNBOLL",
    "descEn": "BräNnboll Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة BRÄNNBOLL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 88,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-shelving-unit-on-castors-white-60586258/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 56,
      "depthCm": 62,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "brannboll-table-white",
        "colorId": "white",
        "image": "/images/catalog/brannboll-table/white.jpg",
        "priceOmr": 88,
        "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-shelving-unit-on-castors-white-60586258/"
      }
    ],
    "images": [
      "/images/catalog/brannboll-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 198
  },
  {
    "id": "ikea-norberg-dining-table",
    "slug": "norberg-dining-table",
    "category": "dining",
    "model": "NORBERG",
    "nameEn": "Norberg Dining Table",
    "nameAr": "طاولة طعام NORBERG",
    "descEn": "Norberg Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام NORBERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 230,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/norberg-wall-mounted-drop-leaf-table-white-30180504/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 74,
      "depthCm": 60,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "norberg-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/norberg-dining-table/white.jpg",
        "priceOmr": 230,
        "sourceUrl": "https://www.ikea.com/om/ar/p/norberg-wall-mounted-drop-leaf-table-white-30180504/"
      }
    ],
    "images": [
      "/images/catalog/norberg-dining-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 199
  },
  {
    "id": "ikea-bollsidan-table",
    "slug": "bollsidan-table",
    "category": "dining",
    "model": "BOLLSIDAN",
    "nameEn": "Bollsidan Table",
    "nameAr": "طاولة BOLLSIDAN",
    "descEn": "Bollsidan Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة BOLLSIDAN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 218,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bollsidan-laptop-stand-white-30574370/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 68,
      "depthCm": 36,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "bollsidan-table-white",
        "colorId": "white",
        "image": "/images/catalog/bollsidan-table/white.jpg",
        "priceOmr": 218,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bollsidan-laptop-stand-white-30574370/"
      }
    ],
    "images": [
      "/images/catalog/bollsidan-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 200
  },
  {
    "id": "ikea-vihals-dining-table",
    "slug": "vihals-dining-table",
    "category": "dining",
    "model": "VIHALS",
    "nameEn": "Vihals Dining Table",
    "nameAr": "طاولة طعام VIHALS",
    "descEn": "Vihals Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 172,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-gateleg-table-white-70593574/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 151,
      "depthCm": 90,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-dining-table/white.jpg",
        "priceOmr": 172,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-gateleg-table-white-70593574/"
      }
    ],
    "images": [
      "/images/catalog/vihals-dining-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 201
  },
  {
    "id": "ikea-burvik-side-table",
    "slug": "burvik-side-table",
    "category": "side-tables",
    "model": "BURVIK",
    "nameEn": "Burvik Side Table",
    "nameAr": "طاولة جانبية BURVIK",
    "descEn": "Burvik Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية BURVIK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 32,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/burvik-side-table-white-60340389/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 38
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "burvik-side-table-white",
        "colorId": "white",
        "image": "/images/catalog/burvik-side-table/white.jpg",
        "priceOmr": 32,
        "sourceUrl": "https://www.ikea.com/om/ar/p/burvik-side-table-white-60340389/"
      },
      {
        "variantId": "burvik-side-table-black",
        "colorId": "black",
        "image": "/images/catalog/burvik-side-table/black.jpg",
        "priceOmr": 32,
        "sourceUrl": "https://www.ikea.com/om/ar/p/burvik-side-table-black-70340384/"
      }
    ],
    "images": [
      "/images/catalog/burvik-side-table/white.jpg",
      "/images/catalog/burvik-side-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 202
  },
  {
    "id": "ikea-stockholm-2025-table",
    "slug": "stockholm-2025-table",
    "category": "dining",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Table",
    "nameAr": "طاولة STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 171,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-table-oak-veneer-oak-veneer-s49579985/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 115
    },
    "dimensionsKnown": true,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-table-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/stockholm-2025-table/oak.jpg",
        "priceOmr": 171,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-table-oak-veneer-oak-veneer-s49579985/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-table/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 203
  },
  {
    "id": "ikea-gladom-tray-table",
    "slug": "gladom-tray-table",
    "category": "side-tables",
    "subcategory": "tray",
    "model": "GLADOM",
    "nameEn": "Gladom Tray Table",
    "nameAr": "طاولة صينية GLADOM",
    "descEn": "Gladom Tray Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 4 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة صينية GLADOM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 4 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 29,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gladom-tray-table-light-blue-10534002/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 45,
      "depthCm": 53,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "blue",
      "black",
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "gladom-tray-table-blue",
        "colorId": "blue",
        "image": "/images/catalog/gladom-tray-table/blue.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gladom-tray-table-light-blue-10534002/"
      },
      {
        "variantId": "gladom-tray-table-black",
        "colorId": "black",
        "image": "/images/catalog/gladom-tray-table/black.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gladom-tray-table-black-50411990/"
      },
      {
        "variantId": "gladom-tray-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/gladom-tray-table/grey.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gladom-tray-table-dark-grey-green-70578451/"
      },
      {
        "variantId": "gladom-tray-table-white",
        "colorId": "white",
        "image": "/images/catalog/gladom-tray-table/white.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gladom-tray-table-white-70337819/"
      }
    ],
    "images": [
      "/images/catalog/gladom-tray-table/blue.jpg",
      "/images/catalog/gladom-tray-table/black.jpg",
      "/images/catalog/gladom-tray-table/grey.jpg",
      "/images/catalog/gladom-tray-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 204
  },
  {
    "id": "ikea-lack-side-table-2",
    "slug": "lack-side-table-2",
    "category": "side-tables",
    "model": "LACK",
    "nameEn": "Lack Side Table",
    "nameAr": "طاولة جانبية LACK",
    "descEn": "Lack Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية LACK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 22,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lack-side-table-white-30514791/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 35,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "lack-side-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/lack-side-table-2/white.jpg",
        "priceOmr": 22,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-side-table-white-30514791/"
      }
    ],
    "images": [
      "/images/catalog/lack-side-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 205
  },
  {
    "id": "ikea-sonhult-nest-of-tables",
    "slug": "sonhult-nest-of-tables",
    "category": "side-tables",
    "subcategory": "nest",
    "model": "SONHULT",
    "nameEn": "Sonhult Nest of Tables",
    "nameAr": "طاولات متداخلة SONHULT",
    "descEn": "Sonhult Nest of Tables — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولات متداخلة SONHULT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 37,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sonhult-nest-of-tables-set-of-2-grey-walnut-effect-30578556/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "sonhult-nest-of-tables-grey",
        "colorId": "grey",
        "materialId": "walnut",
        "image": "/images/catalog/sonhult-nest-of-tables/grey.jpg",
        "priceOmr": 37,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sonhult-nest-of-tables-set-of-2-grey-walnut-effect-30578556/"
      }
    ],
    "images": [
      "/images/catalog/sonhult-nest-of-tables/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 206
  },
  {
    "id": "ikea-skogsta-dining-table",
    "slug": "skogsta-dining-table",
    "category": "dining",
    "model": "SKOGSTA",
    "nameEn": "Skogsta Dining Table",
    "nameAr": "طاولة طعام SKOGSTA",
    "descEn": "Skogsta Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام SKOGSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 62,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-dining-table-acacia-black-20593802/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 120
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skogsta-dining-table-black",
        "colorId": "black",
        "image": "/images/catalog/skogsta-dining-table/black.jpg",
        "priceOmr": 62,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-dining-table-acacia-black-20593802/"
      }
    ],
    "images": [
      "/images/catalog/skogsta-dining-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 207
  },
  {
    "id": "ikea-norden-dining-table",
    "slug": "norden-dining-table",
    "category": "dining",
    "model": "NORDEN",
    "nameEn": "Norden Dining Table",
    "nameAr": "طاولة طعام NORDEN",
    "descEn": "Norden Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام NORDEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 159,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/norden-gateleg-table-white-10423886/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 152,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "natural"
    ],
    "variants": [
      {
        "variantId": "norden-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/norden-dining-table/white.jpg",
        "priceOmr": 159,
        "sourceUrl": "https://www.ikea.com/om/ar/p/norden-gateleg-table-white-10423886/"
      },
      {
        "variantId": "norden-dining-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/norden-dining-table/natural.jpg",
        "priceOmr": 159,
        "sourceUrl": "https://www.ikea.com/om/ar/p/norden-gateleg-table-birch-90423887/"
      }
    ],
    "images": [
      "/images/catalog/norden-dining-table/white.jpg",
      "/images/catalog/norden-dining-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 208
  },
  {
    "id": "ikea-vitteryd-coffee-table",
    "slug": "vitteryd-coffee-table",
    "category": "coffee-tables",
    "model": "VITTERYD",
    "nameEn": "Vitteryd Coffee Table",
    "nameAr": "طاولة قهوة VITTERYD",
    "descEn": "Vitteryd Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة VITTERYD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 55,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vitteryd-adjustable-coffee-table-white-20530065/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 97
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vitteryd-coffee-table-white",
        "colorId": "white",
        "image": "/images/catalog/vitteryd-coffee-table/white.jpg",
        "priceOmr": 55,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vitteryd-adjustable-coffee-table-white-20530065/"
      }
    ],
    "images": [
      "/images/catalog/vitteryd-coffee-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 209
  },
  {
    "id": "ikea-tanebro-side-table",
    "slug": "tanebro-side-table",
    "category": "side-tables",
    "model": "TÅNEBRO",
    "nameEn": "TåNebro Side Table",
    "nameAr": "طاولة جانبية TÅNEBRO",
    "descEn": "TåNebro Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية TÅNEBRO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 56,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tanebro-side-table-in-outdoor-anthracite-60578970/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 46
    },
    "dimensionsKnown": true,
    "colorIds": [
      "charcoal",
      "grey",
      "yellow"
    ],
    "variants": [
      {
        "variantId": "tanebro-side-table-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/tanebro-side-table/charcoal.jpg",
        "priceOmr": 56,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tanebro-side-table-in-outdoor-anthracite-60578970/"
      },
      {
        "variantId": "tanebro-side-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/tanebro-side-table/grey.jpg",
        "priceOmr": 56,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tanebro-side-table-in-outdoor-light-grey-beige-60554988/"
      },
      {
        "variantId": "tanebro-side-table-yellow",
        "colorId": "yellow",
        "image": "/images/catalog/tanebro-side-table/yellow.jpg",
        "priceOmr": 56,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tanebro-side-table-in-outdoor-pale-yellow-70605162/"
      }
    ],
    "images": [
      "/images/catalog/tanebro-side-table/charcoal.jpg",
      "/images/catalog/tanebro-side-table/grey.jpg",
      "/images/catalog/tanebro-side-table/yellow.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 210
  },
  {
    "id": "ikea-borgeby-side-table",
    "slug": "borgeby-side-table",
    "category": "side-tables",
    "model": "BORGEBY",
    "nameEn": "Borgeby Side Table",
    "nameAr": "طاولة جانبية BORGEBY",
    "descEn": "Borgeby Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية BORGEBY — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 43,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/borgeby-side-table-birch-veneer-80619880/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 46
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural",
      "black"
    ],
    "variants": [
      {
        "variantId": "borgeby-side-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/borgeby-side-table/natural.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/borgeby-side-table-birch-veneer-80619880/"
      },
      {
        "variantId": "borgeby-side-table-black",
        "colorId": "black",
        "image": "/images/catalog/borgeby-side-table/black.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/borgeby-side-table-black-40619882/"
      }
    ],
    "images": [
      "/images/catalog/borgeby-side-table/natural.jpg",
      "/images/catalog/borgeby-side-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 211
  },
  {
    "id": "ikea-grimsarbo-side-table",
    "slug": "grimsarbo-side-table",
    "category": "side-tables",
    "model": "GRIMSARBO",
    "nameEn": "Grimsarbo Side Table",
    "nameAr": "طاولة جانبية GRIMSARBO",
    "descEn": "Grimsarbo Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية GRIMSARBO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/grimsarbo-side-table-pine-plywood-black-00589090/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "natural"
    ],
    "variants": [
      {
        "variantId": "grimsarbo-side-table-black",
        "colorId": "black",
        "image": "/images/catalog/grimsarbo-side-table/black.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/grimsarbo-side-table-pine-plywood-black-00589090/"
      },
      {
        "variantId": "grimsarbo-side-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/grimsarbo-side-table/natural.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/grimsarbo-side-table-pine-plywood-bright-red-50606167/"
      }
    ],
    "images": [
      "/images/catalog/grimsarbo-side-table/black.jpg",
      "/images/catalog/grimsarbo-side-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 212
  },
  {
    "id": "ikea-hauga-table",
    "slug": "hauga-table",
    "category": "dining",
    "model": "HAUGA",
    "nameEn": "Hauga Table",
    "nameAr": "طاولة HAUGA",
    "descEn": "Hauga Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة HAUGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 235,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-table-grey-birch-veneer-50576716/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 118,
      "depthCm": 74,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "hauga-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/hauga-table/grey.jpg",
        "priceOmr": 235,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-table-grey-birch-veneer-50576716/"
      },
      {
        "variantId": "hauga-table-white",
        "colorId": "white",
        "image": "/images/catalog/hauga-table/white.jpg",
        "priceOmr": 235,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-table-white-birch-veneer-00576709/"
      }
    ],
    "images": [
      "/images/catalog/hauga-table/grey.jpg",
      "/images/catalog/hauga-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 213
  },
  {
    "id": "ikea-hol-table",
    "slug": "hol-table",
    "category": "dining",
    "model": "HOL",
    "nameEn": "Hol Table",
    "nameAr": "طاولة HOL",
    "descEn": "Hol Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة HOL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 162,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hol-storage-table-acacia-50161321/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 98,
      "depthCm": 50,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "hol-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/hol-table/natural.jpg",
        "priceOmr": 162,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hol-storage-table-acacia-50161321/"
      }
    ],
    "images": [
      "/images/catalog/hol-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 214
  },
  {
    "id": "ikea-alhult-table",
    "slug": "alhult-table",
    "category": "dining",
    "model": "ÅLHULT",
    "nameEn": "åLhult Table",
    "nameAr": "طاولة ÅLHULT",
    "descEn": "åLhult Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة ÅLHULT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 145,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-table-black-brown-40600793/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 120,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black",
      "beige"
    ],
    "variants": [
      {
        "variantId": "alhult-table-black",
        "colorId": "black",
        "image": "/images/catalog/alhult-table/black.jpg",
        "priceOmr": 145,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-table-black-brown-40600793/"
      },
      {
        "variantId": "alhult-table-beige",
        "colorId": "beige",
        "image": "/images/catalog/alhult-table/beige.jpg",
        "priceOmr": 145,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-table-beige-brown-00597919/"
      }
    ],
    "images": [
      "/images/catalog/alhult-table/black.jpg",
      "/images/catalog/alhult-table/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 215
  },
  {
    "id": "ikea-ugglerum-coffee-table",
    "slug": "ugglerum-coffee-table",
    "category": "coffee-tables",
    "model": "UGGLERUM",
    "nameEn": "Ugglerum Coffee Table",
    "nameAr": "طاولة قهوة UGGLERUM",
    "descEn": "Ugglerum Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة UGGLERUM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 68,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ugglerum-coffee-table-walnut-veneer-60627980/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 130,
      "depthCm": 65,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "walnut"
    ],
    "variants": [
      {
        "variantId": "ugglerum-coffee-table-walnut",
        "colorId": "walnut",
        "materialId": "walnut",
        "image": "/images/catalog/ugglerum-coffee-table/walnut.jpg",
        "priceOmr": 68,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ugglerum-coffee-table-walnut-veneer-60627980/"
      }
    ],
    "images": [
      "/images/catalog/ugglerum-coffee-table/walnut.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 216
  },
  {
    "id": "ikea-stockholm-2025-side-table",
    "slug": "stockholm-2025-side-table",
    "category": "side-tables",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Side Table",
    "nameAr": "طاولة جانبية STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 21,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-pine-veneer-natural-90586563/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 40
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-side-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/stockholm-2025-side-table/natural.jpg",
        "priceOmr": 21,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-pine-veneer-natural-90586563/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-side-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 217
  },
  {
    "id": "ikea-rosentorp-dining-table",
    "slug": "rosentorp-dining-table",
    "category": "dining",
    "model": "ROSENTORP",
    "nameEn": "Rosentorp Dining Table",
    "nameAr": "طاولة طعام ROSENTORP",
    "descEn": "Rosentorp Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام ROSENTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-extendable-table-black-60568264/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 155
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black",
      "white"
    ],
    "variants": [
      {
        "variantId": "rosentorp-dining-table-black",
        "colorId": "black",
        "image": "/images/catalog/rosentorp-dining-table/black.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-extendable-table-black-60568264/"
      },
      {
        "variantId": "rosentorp-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/rosentorp-dining-table/white.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-extendable-table-white-80568239/"
      }
    ],
    "images": [
      "/images/catalog/rosentorp-dining-table/black.jpg",
      "/images/catalog/rosentorp-dining-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 218
  },
  {
    "id": "ikea-frotorp-coffee-table",
    "slug": "frotorp-coffee-table",
    "category": "coffee-tables",
    "model": "FRÖTORP",
    "nameEn": "FröTorp Coffee Table",
    "nameAr": "طاولة قهوة FRÖTORP",
    "descEn": "FröTorp Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة FRÖTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 72,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-coffee-table-anthracite-marble-effect-black-glass-70497582/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 88
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black",
      "white"
    ],
    "variants": [
      {
        "variantId": "frotorp-coffee-table-black",
        "colorId": "black",
        "materialId": "glass",
        "image": "/images/catalog/frotorp-coffee-table/black.jpg",
        "priceOmr": 72,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-coffee-table-anthracite-marble-effect-black-glass-70497582/"
      },
      {
        "variantId": "frotorp-coffee-table-white",
        "colorId": "white",
        "materialId": "glass",
        "image": "/images/catalog/frotorp-coffee-table/white.jpg",
        "priceOmr": 72,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-coffee-table-white-chrome-plated-white-glass-70622091/"
      }
    ],
    "images": [
      "/images/catalog/frotorp-coffee-table/black.jpg",
      "/images/catalog/frotorp-coffee-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 219
  },
  {
    "id": "ikea-tranered-side-table",
    "slug": "tranered-side-table",
    "category": "side-tables",
    "model": "TRANERED",
    "nameEn": "Tranered Side Table",
    "nameAr": "طاولة جانبية TRANERED",
    "descEn": "Tranered Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية TRANERED — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 70,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tranered-side-table-black-30609001/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "tranered-side-table-black",
        "colorId": "black",
        "image": "/images/catalog/tranered-side-table/black.jpg",
        "priceOmr": 70,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tranered-side-table-black-30609001/"
      }
    ],
    "images": [
      "/images/catalog/tranered-side-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 220
  },
  {
    "id": "ikea-idanas-console-table",
    "slug": "idanas-console-table",
    "category": "side-tables",
    "subcategory": "console",
    "model": "IDANÄS",
    "nameEn": "IdanäS Console Table",
    "nameAr": "طاولة كونسول IDANÄS",
    "descEn": "IdanäS Console Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة كونسول IDANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 59,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-console-table-white-90487879/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 104,
      "depthCm": 32,
      "heightCm": 95
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "idanas-console-table-white",
        "colorId": "white",
        "image": "/images/catalog/idanas-console-table/white.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-console-table-white-90487879/"
      }
    ],
    "images": [
      "/images/catalog/idanas-console-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 221
  },
  {
    "id": "ikea-hol-side-table",
    "slug": "hol-side-table",
    "category": "side-tables",
    "model": "HOL",
    "nameEn": "Hol Side Table",
    "nameAr": "طاولة جانبية HOL",
    "descEn": "Hol Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية HOL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 13,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hol-side-table-acacia-70161320/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "hol-side-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/hol-side-table/natural.jpg",
        "priceOmr": 13,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hol-side-table-acacia-70161320/"
      }
    ],
    "images": [
      "/images/catalog/hol-side-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 222
  },
  {
    "id": "ikea-grotan-table",
    "slug": "grotan-table",
    "category": "dining",
    "model": "GRÖTÅN",
    "nameEn": "GröTåN Table",
    "nameAr": "طاولة GRÖTÅN",
    "descEn": "GröTåN Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة GRÖTÅN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 226,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/groetan-table-pine-brown-stained-40610424/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 105
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "grotan-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/grotan-table/brown.jpg",
        "priceOmr": 226,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groetan-table-pine-brown-stained-40610424/"
      }
    ],
    "images": [
      "/images/catalog/grotan-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 223
  },
  {
    "id": "ikea-tonstad-coffee-table",
    "slug": "tonstad-coffee-table",
    "category": "coffee-tables",
    "model": "TONSTAD",
    "nameEn": "Tonstad Coffee Table",
    "nameAr": "طاولة قهوة TONSTAD",
    "descEn": "Tonstad Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 95,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-coffee-table-off-white-90491560/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 84,
      "depthCm": 82,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "tonstad-coffee-table-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-coffee-table/ivory.jpg",
        "priceOmr": 95,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-coffee-table-off-white-90491560/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-coffee-table/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 224
  },
  {
    "id": "ikea-frotorp-side-table",
    "slug": "frotorp-side-table",
    "category": "side-tables",
    "model": "FRÖTORP",
    "nameEn": "FröTorp Side Table",
    "nameAr": "طاولة جانبية FRÖTORP",
    "descEn": "FröTorp Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية FRÖTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 62,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-side-table-white-chrome-plated-white-glass-30622093/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 48
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "frotorp-side-table-white",
        "colorId": "white",
        "materialId": "glass",
        "image": "/images/catalog/frotorp-side-table/white.jpg",
        "priceOmr": 62,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-side-table-white-chrome-plated-white-glass-30622093/"
      },
      {
        "variantId": "frotorp-side-table-black",
        "colorId": "black",
        "materialId": "glass",
        "image": "/images/catalog/frotorp-side-table/black.jpg",
        "priceOmr": 62,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-side-table-anthracite-marble-effect-black-glass-10492276/"
      }
    ],
    "images": [
      "/images/catalog/frotorp-side-table/white.jpg",
      "/images/catalog/frotorp-side-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 225
  },
  {
    "id": "ikea-ikea-ps-2026-table",
    "slug": "ikea-ps-2026-table",
    "category": "dining",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Table",
    "nameAr": "طاولة IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 61,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-table-folding-pine-clear-lacquered-00617861/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 156,
      "depthCm": 75,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/ikea-ps-2026-table/natural.jpg",
        "priceOmr": 61,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-table-folding-pine-clear-lacquered-00617861/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 226
  },
  {
    "id": "ikea-lack-nest-of-tables",
    "slug": "lack-nest-of-tables",
    "category": "side-tables",
    "subcategory": "nest",
    "model": "LACK",
    "nameEn": "Lack Nest of Tables",
    "nameAr": "طاولات متداخلة LACK",
    "descEn": "Lack Nest of Tables — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولات متداخلة LACK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 34,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lack-nest-of-tables-set-of-2-white-s59442727/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "lack-nest-of-tables-white",
        "colorId": "white",
        "image": "/images/catalog/lack-nest-of-tables/white.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-nest-of-tables-set-of-2-white-s59442727/"
      }
    ],
    "images": [
      "/images/catalog/lack-nest-of-tables/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 227
  },
  {
    "id": "ikea-tonstad-dining-table",
    "slug": "tonstad-dining-table",
    "category": "dining",
    "model": "TONSTAD",
    "nameEn": "Tonstad Dining Table",
    "nameAr": "طاولة طعام TONSTAD",
    "descEn": "Tonstad Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 222,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-extendable-table-off-white-40600731/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 196,
      "depthCm": 85,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory",
      "brown"
    ],
    "variants": [
      {
        "variantId": "tonstad-dining-table-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-dining-table/ivory.jpg",
        "priceOmr": 222,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-extendable-table-off-white-40600731/"
      },
      {
        "variantId": "tonstad-dining-table-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/tonstad-dining-table/brown.jpg",
        "priceOmr": 222,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-extendable-table-brown-stained-oak-veneer-20600732/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-dining-table/ivory.jpg",
      "/images/catalog/tonstad-dining-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 228
  },
  {
    "id": "ikea-vihals-dining-table-2",
    "slug": "vihals-dining-table-2",
    "category": "dining",
    "model": "VIHALS",
    "nameEn": "Vihals Dining Table",
    "nameAr": "طاولة طعام VIHALS",
    "descEn": "Vihals Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 171,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-extendable-table-green-30592755/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 74,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "green",
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-dining-table-2-green",
        "colorId": "green",
        "image": "/images/catalog/vihals-dining-table-2/green.jpg",
        "priceOmr": 171,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-extendable-table-green-30592755/"
      },
      {
        "variantId": "vihals-dining-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-dining-table-2/white.jpg",
        "priceOmr": 171,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-extendable-table-white-20589777/"
      }
    ],
    "images": [
      "/images/catalog/vihals-dining-table-2/green.jpg",
      "/images/catalog/vihals-dining-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 229
  },
  {
    "id": "ikea-ammaryd-coffee-table",
    "slug": "ammaryd-coffee-table",
    "category": "coffee-tables",
    "model": "ÄMMARYD",
    "nameEn": "äMmaryd Coffee Table",
    "nameAr": "طاولة قهوة ÄMMARYD",
    "descEn": "äMmaryd Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة ÄMMARYD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 91,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/aemmaryd-coffee-table-grey-40609128/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 98,
      "depthCm": 59,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "ammaryd-coffee-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/ammaryd-coffee-table/grey.jpg",
        "priceOmr": 91,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aemmaryd-coffee-table-grey-40609128/"
      },
      {
        "variantId": "ammaryd-coffee-table-white",
        "colorId": "white",
        "image": "/images/catalog/ammaryd-coffee-table/white.jpg",
        "priceOmr": 91,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aemmaryd-coffee-table-white-00609125/"
      }
    ],
    "images": [
      "/images/catalog/ammaryd-coffee-table/grey.jpg",
      "/images/catalog/ammaryd-coffee-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 230
  },
  {
    "id": "ikea-listerby-coffee-table",
    "slug": "listerby-coffee-table",
    "category": "coffee-tables",
    "model": "LISTERBY",
    "nameEn": "Listerby Coffee Table",
    "nameAr": "طاولة قهوة LISTERBY",
    "descEn": "Listerby Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة LISTERBY — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 110,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/listerby-coffee-table-dark-brown-beech-veneer-90562246/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 60,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "listerby-coffee-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/listerby-coffee-table/brown.jpg",
        "priceOmr": 110,
        "sourceUrl": "https://www.ikea.com/om/ar/p/listerby-coffee-table-dark-brown-beech-veneer-90562246/"
      }
    ],
    "images": [
      "/images/catalog/listerby-coffee-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 231
  },
  {
    "id": "ikea-jattesta-coffee-table",
    "slug": "jattesta-coffee-table",
    "category": "coffee-tables",
    "model": "JÄTTESTA",
    "nameEn": "JäTtesta Coffee Table",
    "nameAr": "طاولة قهوة JÄTTESTA",
    "descEn": "JäTtesta Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة JÄTTESTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 111,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/jaettesta-coffee-table-black-80521911/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 80,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "jattesta-coffee-table-black",
        "colorId": "black",
        "image": "/images/catalog/jattesta-coffee-table/black.jpg",
        "priceOmr": 111,
        "sourceUrl": "https://www.ikea.com/om/ar/p/jaettesta-coffee-table-black-80521911/"
      }
    ],
    "images": [
      "/images/catalog/jattesta-coffee-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 232
  },
  {
    "id": "ikea-gillersberg-bedside-table",
    "slug": "gillersberg-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "GILLERSBERG",
    "nameEn": "Gillersberg Bedside Table",
    "nameAr": "طاولة سرير GILLERSBERG",
    "descEn": "Gillersberg Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير GILLERSBERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 70,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gillersberg-bedside-table-bamboo-white-30608983/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 39,
      "depthCm": 39,
      "heightCm": 56
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "gillersberg-bedside-table-white",
        "colorId": "white",
        "materialId": "rattan",
        "image": "/images/catalog/gillersberg-bedside-table/white.jpg",
        "priceOmr": 70,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gillersberg-bedside-table-bamboo-white-30608983/"
      }
    ],
    "images": [
      "/images/catalog/gillersberg-bedside-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 233
  },
  {
    "id": "ikea-stockholm-2025-coffee-table",
    "slug": "stockholm-2025-coffee-table",
    "category": "coffee-tables",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Coffee Table",
    "nameAr": "طاولة قهوة STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 43,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-coffee-table-oak-veneer-glass-20586552/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-coffee-table-oak",
        "colorId": "oak",
        "materialId": "glass",
        "image": "/images/catalog/stockholm-2025-coffee-table/oak.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-coffee-table-oak-veneer-glass-20586552/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-coffee-table/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 234
  },
  {
    "id": "ikea-idanas-coffee-table",
    "slug": "idanas-coffee-table",
    "category": "coffee-tables",
    "model": "IDANÄS",
    "nameEn": "IdanäS Coffee Table",
    "nameAr": "طاولة قهوة IDANÄS",
    "descEn": "IdanäS Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة IDANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 38,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-coffee-table-dark-brown-stained-80487870/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 107,
      "depthCm": 55,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown",
      "white"
    ],
    "variants": [
      {
        "variantId": "idanas-coffee-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/idanas-coffee-table/brown.jpg",
        "priceOmr": 38,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-coffee-table-dark-brown-stained-80487870/"
      },
      {
        "variantId": "idanas-coffee-table-white",
        "colorId": "white",
        "image": "/images/catalog/idanas-coffee-table/white.jpg",
        "priceOmr": 38,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-coffee-table-white-20487873/"
      }
    ],
    "images": [
      "/images/catalog/idanas-coffee-table/brown.jpg",
      "/images/catalog/idanas-coffee-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 235
  },
  {
    "id": "ikea-lisabo-table",
    "slug": "lisabo-table",
    "category": "dining",
    "model": "LISABO",
    "nameEn": "Lisabo Table",
    "nameAr": "طاولة LISABO",
    "descEn": "Lisabo Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة LISABO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 59,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-table-ash-veneer-70294339/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "ash"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 78,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural",
      "black"
    ],
    "variants": [
      {
        "variantId": "lisabo-table-natural",
        "colorId": "natural",
        "materialId": "ash",
        "image": "/images/catalog/lisabo-table/natural.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-table-ash-veneer-70294339/"
      },
      {
        "variantId": "lisabo-table-black",
        "colorId": "black",
        "materialId": "ash",
        "image": "/images/catalog/lisabo-table/black.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-table-black-ash-veneer-80382439/"
      }
    ],
    "images": [
      "/images/catalog/lisabo-table/natural.jpg",
      "/images/catalog/lisabo-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 236
  },
  {
    "id": "ikea-stockholm-2025-coffee-table-2",
    "slug": "stockholm-2025-coffee-table-2",
    "category": "coffee-tables",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Coffee Table",
    "nameAr": "طاولة قهوة STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 68,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-coffee-table-pine-natural-50594763/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 45,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-coffee-table-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/stockholm-2025-coffee-table-2/natural.jpg",
        "priceOmr": 68,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-coffee-table-pine-natural-50594763/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-coffee-table-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 237
  },
  {
    "id": "ikea-pinntorp-dining-table",
    "slug": "pinntorp-dining-table",
    "category": "dining",
    "model": "PINNTORP",
    "nameEn": "Pinntorp Dining Table",
    "nameAr": "طاولة طعام PINNTORP",
    "descEn": "Pinntorp Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام PINNTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 99,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-gateleg-table-light-brown-stained-white-stained-pine-70529465/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 124,
      "depthCm": 75,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "pinntorp-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/pinntorp-dining-table/white.jpg",
        "priceOmr": 99,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-gateleg-table-light-brown-stained-white-stained-pine-70529465/"
      }
    ],
    "images": [
      "/images/catalog/pinntorp-dining-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 238
  },
  {
    "id": "ikea-torsjo-side-table",
    "slug": "torsjo-side-table",
    "category": "side-tables",
    "model": "TORSJÖ",
    "nameEn": "Torsjö Side Table",
    "nameAr": "طاولة جانبية TORSJÖ",
    "descEn": "Torsjö Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية TORSJÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 47,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/torsjoe-side-table-gold-effect-glass-60590415/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brass"
    ],
    "variants": [
      {
        "variantId": "torsjo-side-table-brass",
        "colorId": "brass",
        "materialId": "glass",
        "image": "/images/catalog/torsjo-side-table/brass.jpg",
        "priceOmr": 47,
        "sourceUrl": "https://www.ikea.com/om/ar/p/torsjoe-side-table-gold-effect-glass-60590415/"
      }
    ],
    "images": [
      "/images/catalog/torsjo-side-table/brass.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 239
  },
  {
    "id": "ikea-idanas-coffee-table-2",
    "slug": "idanas-coffee-table-2",
    "category": "coffee-tables",
    "model": "IDANÄS",
    "nameEn": "IdanäS Coffee Table",
    "nameAr": "طاولة قهوة IDANÄS",
    "descEn": "IdanäS Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة IDANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 74,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-coffee-table-white-40500005/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 80,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "brown"
    ],
    "variants": [
      {
        "variantId": "idanas-coffee-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/idanas-coffee-table-2/white.jpg",
        "priceOmr": 74,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-coffee-table-white-40500005/"
      },
      {
        "variantId": "idanas-coffee-table-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/idanas-coffee-table-2/brown.jpg",
        "priceOmr": 74,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-coffee-table-dark-brown-stained-10500002/"
      }
    ],
    "images": [
      "/images/catalog/idanas-coffee-table-2/white.jpg",
      "/images/catalog/idanas-coffee-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 240
  },
  {
    "id": "ikea-ikea-ps-2026-table-2",
    "slug": "ikea-ps-2026-table-2",
    "category": "dining",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Table",
    "nameAr": "طاولة IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-table-with-drawer-pine-clear-lacquered-40617878/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 70,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-table-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/ikea-ps-2026-table-2/natural.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-table-with-drawer-pine-clear-lacquered-40617878/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-table-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 241
  },
  {
    "id": "ikea-tingby-side-table",
    "slug": "tingby-side-table",
    "category": "side-tables",
    "model": "TINGBY",
    "nameEn": "Tingby Side Table",
    "nameAr": "طاولة جانبية TINGBY",
    "descEn": "Tingby Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية TINGBY — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 55,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tingby-side-table-on-castors-white-20295930/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "grey"
    ],
    "variants": [
      {
        "variantId": "tingby-side-table-white",
        "colorId": "white",
        "image": "/images/catalog/tingby-side-table/white.jpg",
        "priceOmr": 55,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tingby-side-table-on-castors-white-20295930/"
      },
      {
        "variantId": "tingby-side-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/tingby-side-table/grey.jpg",
        "priceOmr": 55,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tingby-side-table-on-castors-grey-00349444/"
      }
    ],
    "images": [
      "/images/catalog/tingby-side-table/white.jpg",
      "/images/catalog/tingby-side-table/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 242
  },
  {
    "id": "ikea-skansnas-dining-table",
    "slug": "skansnas-dining-table",
    "category": "dining",
    "model": "SKANSNÄS",
    "nameEn": "SkansnäS Dining Table",
    "nameAr": "طاولة طعام SKANSNÄS",
    "descEn": "SkansnäS Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام SKANSNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 188,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skansnaes-extendable-table-brown-beech-veneer-70563237/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 170
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "skansnas-dining-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/skansnas-dining-table/brown.jpg",
        "priceOmr": 188,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skansnaes-extendable-table-brown-beech-veneer-70563237/"
      }
    ],
    "images": [
      "/images/catalog/skansnas-dining-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 243
  },
  {
    "id": "ikea-morbylanga-table",
    "slug": "morbylanga-table",
    "category": "dining",
    "model": "MÖRBYLÅNGA",
    "nameEn": "MöRbylåNga Table",
    "nameAr": "طاولة MÖRBYLÅNGA",
    "descEn": "MöRbylåNga Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة MÖRBYLÅNGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 141,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/moerbylanga-table-oak-veneer-brown-stained-20293766/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 100,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "morbylanga-table-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/morbylanga-table/brown.jpg",
        "priceOmr": 141,
        "sourceUrl": "https://www.ikea.com/om/ar/p/moerbylanga-table-oak-veneer-brown-stained-20293766/"
      }
    ],
    "images": [
      "/images/catalog/morbylanga-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 244
  },
  {
    "id": "ikea-strandtorp-dining-table",
    "slug": "strandtorp-dining-table",
    "category": "dining",
    "model": "STRANDTORP",
    "nameEn": "Strandtorp Dining Table",
    "nameAr": "طاولة طعام STRANDTORP",
    "descEn": "Strandtorp Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام STRANDTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 308,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/strandtorp-extendable-table-brown-80388587/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 260,
      "depthCm": 95,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "strandtorp-dining-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/strandtorp-dining-table/brown.jpg",
        "priceOmr": 308,
        "sourceUrl": "https://www.ikea.com/om/ar/p/strandtorp-extendable-table-brown-80388587/"
      }
    ],
    "images": [
      "/images/catalog/strandtorp-dining-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 245
  },
  {
    "id": "ikea-bergshyttan-table",
    "slug": "bergshyttan-table",
    "category": "dining",
    "model": "BERGSHYTTAN",
    "nameEn": "Bergshyttan Table",
    "nameAr": "طاولة BERGSHYTTAN",
    "descEn": "Bergshyttan Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة BERGSHYTTAN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 68,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bergshyttan-table-dark-brown-ash-veneer-40608242/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "ash"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 240,
      "depthCm": 93,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "bergshyttan-table-brown",
        "colorId": "brown",
        "materialId": "ash",
        "image": "/images/catalog/bergshyttan-table/brown.jpg",
        "priceOmr": 68,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bergshyttan-table-dark-brown-ash-veneer-40608242/"
      }
    ],
    "images": [
      "/images/catalog/bergshyttan-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 246
  },
  {
    "id": "ikea-rosentorp-dining-table-2",
    "slug": "rosentorp-dining-table-2",
    "category": "dining",
    "model": "ROSENTORP",
    "nameEn": "Rosentorp Dining Table",
    "nameAr": "طاولة طعام ROSENTORP",
    "descEn": "Rosentorp Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام ROSENTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 93,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-extendable-table-white-60589902/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 215,
      "depthCm": 87,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "rosentorp-dining-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/rosentorp-dining-table-2/white.jpg",
        "priceOmr": 93,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-extendable-table-white-60589902/"
      },
      {
        "variantId": "rosentorp-dining-table-2-black",
        "colorId": "black",
        "image": "/images/catalog/rosentorp-dining-table-2/black.jpg",
        "priceOmr": 93,
        "sourceUrl": "https://www.ikea.com/om/ar/p/rosentorp-extendable-table-black-80589901/"
      }
    ],
    "images": [
      "/images/catalog/rosentorp-dining-table-2/white.jpg",
      "/images/catalog/rosentorp-dining-table-2/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 247
  },
  {
    "id": "ikea-ostavall-coffee-table",
    "slug": "ostavall-coffee-table",
    "category": "coffee-tables",
    "model": "ÖSTAVALL",
    "nameEn": "öStavall Coffee Table",
    "nameAr": "طاولة قهوة ÖSTAVALL",
    "descEn": "öStavall Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة ÖSTAVALL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 33,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/oestavall-adjustable-coffee-table-black-40534152/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 90
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black",
      "white"
    ],
    "variants": [
      {
        "variantId": "ostavall-coffee-table-black",
        "colorId": "black",
        "image": "/images/catalog/ostavall-coffee-table/black.jpg",
        "priceOmr": 33,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oestavall-adjustable-coffee-table-black-40534152/"
      },
      {
        "variantId": "ostavall-coffee-table-white",
        "colorId": "white",
        "image": "/images/catalog/ostavall-coffee-table/white.jpg",
        "priceOmr": 33,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oestavall-adjustable-coffee-table-white-00530066/"
      }
    ],
    "images": [
      "/images/catalog/ostavall-coffee-table/black.jpg",
      "/images/catalog/ostavall-coffee-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 248
  },
  {
    "id": "ikea-kragsta-coffee-table",
    "slug": "kragsta-coffee-table",
    "category": "coffee-tables",
    "model": "KRAGSTA",
    "nameEn": "Kragsta Coffee Table",
    "nameAr": "طاولة قهوة KRAGSTA",
    "descEn": "Kragsta Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة KRAGSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kragsta-coffee-table-black-80262253/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 90
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black",
      "white"
    ],
    "variants": [
      {
        "variantId": "kragsta-coffee-table-black",
        "colorId": "black",
        "image": "/images/catalog/kragsta-coffee-table/black.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kragsta-coffee-table-black-80262253/"
      },
      {
        "variantId": "kragsta-coffee-table-white",
        "colorId": "white",
        "image": "/images/catalog/kragsta-coffee-table/white.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kragsta-coffee-table-white-20286638/"
      }
    ],
    "images": [
      "/images/catalog/kragsta-coffee-table/black.jpg",
      "/images/catalog/kragsta-coffee-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 249
  },
  {
    "id": "ikea-orskar-nest-of-tables",
    "slug": "orskar-nest-of-tables",
    "category": "side-tables",
    "subcategory": "nest",
    "model": "ÖRSKÄR",
    "nameEn": "öRskäR Nest of Tables",
    "nameAr": "طاولات متداخلة ÖRSKÄR",
    "descEn": "öRskäR Nest of Tables — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولات متداخلة ÖRSKÄR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/oerskaer-nest-of-tables-set-of-2-in-outdoor-dark-grey-30533737/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "orskar-nest-of-tables-grey",
        "colorId": "grey",
        "image": "/images/catalog/orskar-nest-of-tables/grey.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/oerskaer-nest-of-tables-set-of-2-in-outdoor-dark-grey-30533737/"
      }
    ],
    "images": [
      "/images/catalog/orskar-nest-of-tables/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 250
  },
  {
    "id": "ikea-ikea-ps-2026-table-3",
    "slug": "ikea-ps-2026-table-3",
    "category": "dining",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Table",
    "nameAr": "طاولة IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 182,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-table-green-80617895/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 96
    },
    "dimensionsKnown": true,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-table-3-green",
        "colorId": "green",
        "image": "/images/catalog/ikea-ps-2026-table-3/green.jpg",
        "priceOmr": 182,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-table-green-80617895/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-table-3/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 251
  },
  {
    "id": "ikea-kvistbro-table",
    "slug": "kvistbro-table",
    "category": "dining",
    "model": "KVISTBRO",
    "nameEn": "Kvistbro Table",
    "nameAr": "طاولة KVISTBRO",
    "descEn": "Kvistbro Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة KVISTBRO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 93,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kvistbro-storage-table-white-30349452/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 44
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "kvistbro-table-white",
        "colorId": "white",
        "image": "/images/catalog/kvistbro-table/white.jpg",
        "priceOmr": 93,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kvistbro-storage-table-white-30349452/"
      },
      {
        "variantId": "kvistbro-table-black",
        "colorId": "black",
        "image": "/images/catalog/kvistbro-table/black.jpg",
        "priceOmr": 93,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kvistbro-storage-table-black-90480401/"
      }
    ],
    "images": [
      "/images/catalog/kvistbro-table/white.jpg",
      "/images/catalog/kvistbro-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 252
  },
  {
    "id": "ikea-ammaryd-side-table",
    "slug": "ammaryd-side-table",
    "category": "side-tables",
    "model": "ÄMMARYD",
    "nameEn": "äMmaryd Side Table",
    "nameAr": "طاولة جانبية ÄMMARYD",
    "descEn": "äMmaryd Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية ÄMMARYD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 46,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/aemmaryd-side-table-white-80609126/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 59,
      "depthCm": 40,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "grey"
    ],
    "variants": [
      {
        "variantId": "ammaryd-side-table-white",
        "colorId": "white",
        "image": "/images/catalog/ammaryd-side-table/white.jpg",
        "priceOmr": 46,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aemmaryd-side-table-white-80609126/"
      },
      {
        "variantId": "ammaryd-side-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/ammaryd-side-table/grey.jpg",
        "priceOmr": 46,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aemmaryd-side-table-grey-70609122/"
      }
    ],
    "images": [
      "/images/catalog/ammaryd-side-table/white.jpg",
      "/images/catalog/ammaryd-side-table/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 253
  },
  {
    "id": "ikea-kragsta-nest-of-tables",
    "slug": "kragsta-nest-of-tables",
    "category": "side-tables",
    "subcategory": "nest",
    "model": "KRAGSTA",
    "nameEn": "Kragsta Nest of Tables",
    "nameAr": "طاولات متداخلة KRAGSTA",
    "descEn": "Kragsta Nest of Tables — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولات متداخلة KRAGSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 27,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kragsta-nest-of-tables-set-of-2-white-20299829/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "kragsta-nest-of-tables-white",
        "colorId": "white",
        "image": "/images/catalog/kragsta-nest-of-tables/white.jpg",
        "priceOmr": 27,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kragsta-nest-of-tables-set-of-2-white-20299829/"
      },
      {
        "variantId": "kragsta-nest-of-tables-black",
        "colorId": "black",
        "image": "/images/catalog/kragsta-nest-of-tables/black.jpg",
        "priceOmr": 27,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kragsta-nest-of-tables-set-of-2-black-00299825/"
      }
    ],
    "images": [
      "/images/catalog/kragsta-nest-of-tables/white.jpg",
      "/images/catalog/kragsta-nest-of-tables/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 254
  },
  {
    "id": "ikea-morbylanga-table-2",
    "slug": "morbylanga-table-2",
    "category": "dining",
    "model": "MÖRBYLÅNGA",
    "nameEn": "MöRbylåNga Table",
    "nameAr": "طاولة MÖRBYLÅNGA",
    "descEn": "MöRbylåNga Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة MÖRBYLÅNGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 165,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/moerbylanga-table-oak-veneer-brown-stained-60412885/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 145
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "morbylanga-table-2-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/morbylanga-table-2/brown.jpg",
        "priceOmr": 165,
        "sourceUrl": "https://www.ikea.com/om/ar/p/moerbylanga-table-oak-veneer-brown-stained-60412885/"
      }
    ],
    "images": [
      "/images/catalog/morbylanga-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 255
  },
  {
    "id": "ikea-skogsta-dining-table-2",
    "slug": "skogsta-dining-table-2",
    "category": "dining",
    "model": "SKOGSTA",
    "nameEn": "Skogsta Dining Table",
    "nameAr": "طاولة طعام SKOGSTA",
    "descEn": "Skogsta Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام SKOGSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 185,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-dining-table-acacia-black-70419264/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 235,
      "depthCm": 100,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skogsta-dining-table-2-black",
        "colorId": "black",
        "image": "/images/catalog/skogsta-dining-table-2/black.jpg",
        "priceOmr": 185,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-dining-table-acacia-black-70419264/"
      }
    ],
    "images": [
      "/images/catalog/skogsta-dining-table-2/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 256
  },
  {
    "id": "ikea-tonstad-side-table",
    "slug": "tonstad-side-table",
    "category": "side-tables",
    "model": "TONSTAD",
    "nameEn": "Tonstad Side Table",
    "nameAr": "طاولة جانبية TONSTAD",
    "descEn": "Tonstad Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 34,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-side-table-off-white-20528473/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 64,
      "depthCm": 40,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "tonstad-side-table-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-side-table/ivory.jpg",
        "priceOmr": 34,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-side-table-off-white-20528473/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-side-table/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 257
  },
  {
    "id": "ikea-bjorksnas-bedside-table",
    "slug": "bjorksnas-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "BJÖRKSNÄS",
    "nameEn": "BjöRksnäS Bedside Table",
    "nameAr": "طاولة سرير BJÖRKSNÄS",
    "descEn": "BjöRksnäS Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير BJÖRKSNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bjoerksnaes-bedside-table-birch-70407360/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 48,
      "depthCm": 38,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "bjorksnas-bedside-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/bjorksnas-bedside-table/natural.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bjoerksnaes-bedside-table-birch-70407360/"
      }
    ],
    "images": [
      "/images/catalog/bjorksnas-bedside-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 258
  },
  {
    "id": "ikea-morbylanga-table-3",
    "slug": "morbylanga-table-3",
    "category": "dining",
    "model": "MÖRBYLÅNGA",
    "nameEn": "MöRbylåNga Table",
    "nameAr": "طاولة MÖRBYLÅNGA",
    "descEn": "MöRbylåNga Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة MÖRBYLÅNGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/moerbylanga-table-oak-veneer-brown-stained-50386245/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 85,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "morbylanga-table-3-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/morbylanga-table-3/brown.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/moerbylanga-table-oak-veneer-brown-stained-50386245/"
      }
    ],
    "images": [
      "/images/catalog/morbylanga-table-3/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 259
  },
  {
    "id": "ikea-idanas-side-table",
    "slug": "idanas-side-table",
    "category": "side-tables",
    "model": "IDANÄS",
    "nameEn": "IdanäS Side Table",
    "nameAr": "طاولة جانبية IDANÄS",
    "descEn": "IdanäS Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية IDANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 70,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-side-table-white-00496048/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 46,
      "depthCm": 36,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "brown"
    ],
    "variants": [
      {
        "variantId": "idanas-side-table-white",
        "colorId": "white",
        "image": "/images/catalog/idanas-side-table/white.jpg",
        "priceOmr": 70,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-side-table-white-00496048/"
      },
      {
        "variantId": "idanas-side-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/idanas-side-table/brown.jpg",
        "priceOmr": 70,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-side-table-dark-brown-stained-60496045/"
      }
    ],
    "images": [
      "/images/catalog/idanas-side-table/white.jpg",
      "/images/catalog/idanas-side-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 260
  },
  {
    "id": "ikea-danderyd-dining-table",
    "slug": "danderyd-dining-table",
    "category": "dining",
    "model": "DANDERYD",
    "nameEn": "Danderyd Dining Table",
    "nameAr": "طاولة طعام DANDERYD",
    "descEn": "Danderyd Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام DANDERYD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 148,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/danderyd-dining-table-white-40568726/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 130,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "danderyd-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/danderyd-dining-table/white.jpg",
        "priceOmr": 148,
        "sourceUrl": "https://www.ikea.com/om/ar/p/danderyd-dining-table-white-40568726/"
      }
    ],
    "images": [
      "/images/catalog/danderyd-dining-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 261
  },
  {
    "id": "ikea-resaro-dining-table",
    "slug": "resaro-dining-table",
    "category": "dining",
    "model": "RESARÖ",
    "nameEn": "Resarö Dining Table",
    "nameAr": "طاولة طعام RESARÖ",
    "descEn": "Resarö Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام RESARÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 67,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/resaroe-mobile-drop-leaf-table-w-storage-pine-20533337/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "resaro-dining-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/resaro-dining-table/natural.jpg",
        "priceOmr": 67,
        "sourceUrl": "https://www.ikea.com/om/ar/p/resaroe-mobile-drop-leaf-table-w-storage-pine-20533337/"
      }
    ],
    "images": [
      "/images/catalog/resaro-dining-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 262
  },
  {
    "id": "ikea-ikea-ps-2026-side-table",
    "slug": "ikea-ps-2026-side-table",
    "category": "side-tables",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Side Table",
    "nameAr": "طاولة جانبية IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 49,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-side-table-dark-red-80621067/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 40,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "red"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-side-table-red",
        "colorId": "red",
        "image": "/images/catalog/ikea-ps-2026-side-table/red.jpg",
        "priceOmr": 49,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-side-table-dark-red-80621067/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-side-table/red.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 263
  },
  {
    "id": "ikea-smussla-bedside-table",
    "slug": "smussla-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "SMUSSLA",
    "nameEn": "Smussla Bedside Table",
    "nameAr": "طاولة سرير SMUSSLA",
    "descEn": "Smussla Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير SMUSSLA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 38,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/smussla-bedside-table-shelf-unit-white-90469489/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "smussla-bedside-table-white",
        "colorId": "white",
        "image": "/images/catalog/smussla-bedside-table/white.jpg",
        "priceOmr": 38,
        "sourceUrl": "https://www.ikea.com/om/ar/p/smussla-bedside-table-shelf-unit-white-90469489/"
      }
    ],
    "images": [
      "/images/catalog/smussla-bedside-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 264
  },
  {
    "id": "ikea-valnas-trolley",
    "slug": "valnas-trolley",
    "category": "storage",
    "subcategory": "trolley",
    "model": "VALNÄS",
    "nameEn": "ValnäS Trolley",
    "nameAr": "عربة VALNÄS",
    "descEn": "ValnäS Trolley — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "عربة VALNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-trolley-table-with-storage-oak-veneer-60628036/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 40,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "valnas-trolley-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/valnas-trolley/oak.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-trolley-table-with-storage-oak-veneer-60628036/"
      }
    ],
    "images": [
      "/images/catalog/valnas-trolley/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 265
  },
  {
    "id": "ikea-skruvby-side-table",
    "slug": "skruvby-side-table",
    "category": "side-tables",
    "model": "SKRUVBY",
    "nameEn": "Skruvby Side Table",
    "nameAr": "طاولة جانبية SKRUVBY",
    "descEn": "Skruvby Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية SKRUVBY — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 28,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skruvby-side-table-white-80532009/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 32,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "black"
    ],
    "variants": [
      {
        "variantId": "skruvby-side-table-white",
        "colorId": "white",
        "image": "/images/catalog/skruvby-side-table/white.jpg",
        "priceOmr": 28,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skruvby-side-table-white-80532009/"
      },
      {
        "variantId": "skruvby-side-table-black",
        "colorId": "black",
        "image": "/images/catalog/skruvby-side-table/black.jpg",
        "priceOmr": 28,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skruvby-side-table-black-blue-50531983/"
      }
    ],
    "images": [
      "/images/catalog/skruvby-side-table/white.jpg",
      "/images/catalog/skruvby-side-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 266
  },
  {
    "id": "ikea-hauga-table-2",
    "slug": "hauga-table-2",
    "category": "dining",
    "model": "HAUGA",
    "nameEn": "Hauga Table",
    "nameAr": "طاولة HAUGA",
    "descEn": "Hauga Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة HAUGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 51,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-table-grey-birch-veneer-70576720/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 74,
      "depthCm": 74,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "hauga-table-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/hauga-table-2/grey.jpg",
        "priceOmr": 51,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-table-grey-birch-veneer-70576720/"
      },
      {
        "variantId": "hauga-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/hauga-table-2/white.jpg",
        "priceOmr": 51,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-table-white-birch-veneer-90576719/"
      }
    ],
    "images": [
      "/images/catalog/hauga-table-2/grey.jpg",
      "/images/catalog/hauga-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 267
  },
  {
    "id": "ikea-sandared-footstool",
    "slug": "sandared-footstool",
    "category": "chairs",
    "subcategory": "footstool",
    "model": "SANDARED",
    "nameEn": "Sandared Footstool",
    "nameAr": "مسند قدمين SANDARED",
    "descEn": "Sandared Footstool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مسند قدمين SANDARED — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 28,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sandared-pouffe-dark-blue-50363970/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 50,
      "heightCm": 71
    },
    "dimensionsKnown": true,
    "colorIds": [
      "blue"
    ],
    "variants": [
      {
        "variantId": "sandared-footstool-blue",
        "colorId": "blue",
        "image": "/images/catalog/sandared-footstool/blue.jpg",
        "priceOmr": 28,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandared-pouffe-dark-blue-50363970/"
      }
    ],
    "images": [
      "/images/catalog/sandared-footstool/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 268
  },
  {
    "id": "ikea-gamlehult-footstool",
    "slug": "gamlehult-footstool",
    "category": "chairs",
    "subcategory": "footstool",
    "model": "GAMLEHULT",
    "nameEn": "Gamlehult Footstool",
    "nameAr": "مسند قدمين GAMLEHULT",
    "descEn": "Gamlehult Footstool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مسند قدمين GAMLEHULT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 31,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gamlehult-footstool-with-storage-rattan-anthracite-10434309/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 50,
      "heightCm": 44
    },
    "dimensionsKnown": false,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "gamlehult-footstool-charcoal",
        "colorId": "charcoal",
        "materialId": "rattan",
        "image": "/images/catalog/gamlehult-footstool/charcoal.jpg",
        "priceOmr": 31,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gamlehult-footstool-with-storage-rattan-anthracite-10434309/"
      }
    ],
    "images": [
      "/images/catalog/gamlehult-footstool/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 269
  },
  {
    "id": "ikea-stensele-dining-table",
    "slug": "stensele-dining-table",
    "category": "dining",
    "model": "STENSELE",
    "nameEn": "Stensele Dining Table",
    "nameAr": "طاولة طعام STENSELE",
    "descEn": "Stensele Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام STENSELE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 124,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stensele-bar-table-anthracite-anthracite-s09288224/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 70
    },
    "dimensionsKnown": true,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "stensele-dining-table-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/stensele-dining-table/charcoal.jpg",
        "priceOmr": 124,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stensele-bar-table-anthracite-anthracite-s09288224/"
      }
    ],
    "images": [
      "/images/catalog/stensele-dining-table/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 270
  },
  {
    "id": "ikea-voxlov-dining-table",
    "slug": "voxlov-dining-table",
    "category": "dining",
    "model": "VOXLÖV",
    "nameEn": "VoxlöV Dining Table",
    "nameAr": "طاولة طعام VOXLÖV",
    "descEn": "VoxlöV Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام VOXLÖV — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 215,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/voxloev-dining-table-light-bamboo-40434322/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 90,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "voxlov-dining-table-natural",
        "colorId": "natural",
        "materialId": "rattan",
        "image": "/images/catalog/voxlov-dining-table/natural.jpg",
        "priceOmr": 215,
        "sourceUrl": "https://www.ikea.com/om/ar/p/voxloev-dining-table-light-bamboo-40434322/"
      }
    ],
    "images": [
      "/images/catalog/voxlov-dining-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 271
  },
  {
    "id": "ikea-tonstad-table",
    "slug": "tonstad-table",
    "category": "dining",
    "model": "TONSTAD",
    "nameEn": "Tonstad Table",
    "nameAr": "طاولة TONSTAD",
    "descEn": "Tonstad Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 128,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-table-brown-stained-oak-veneer-40599940/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 150,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown",
      "ivory"
    ],
    "variants": [
      {
        "variantId": "tonstad-table-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/tonstad-table/brown.jpg",
        "priceOmr": 128,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-table-brown-stained-oak-veneer-40599940/"
      },
      {
        "variantId": "tonstad-table-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-table/ivory.jpg",
        "priceOmr": 128,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-table-off-white-60599939/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-table/brown.jpg",
      "/images/catalog/tonstad-table/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 272
  },
  {
    "id": "ikea-dubbla-table",
    "slug": "dubbla-table",
    "category": "dining",
    "model": "DUBBLA",
    "nameEn": "Dubbla Table",
    "nameAr": "طاولة DUBBLA",
    "descEn": "Dubbla Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة DUBBLA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 157,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/dubbla-laptop-stand-white-80534701/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 40,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "dubbla-table-white",
        "colorId": "white",
        "image": "/images/catalog/dubbla-table/white.jpg",
        "priceOmr": 157,
        "sourceUrl": "https://www.ikea.com/om/ar/p/dubbla-laptop-stand-white-80534701/"
      }
    ],
    "images": [
      "/images/catalog/dubbla-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 273
  },
  {
    "id": "ikea-ommjange-dining-table",
    "slug": "ommjange-dining-table",
    "category": "dining",
    "model": "OMMJÄNGE",
    "nameEn": "OmmjäNge Dining Table",
    "nameAr": "طاولة طعام OMMJÄNGE",
    "descEn": "OmmjäNge Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام OMMJÄNGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 150,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ommjaenge-drop-leaf-table-pine-stained-blue-90594676/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 134,
      "depthCm": 82,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "ommjange-dining-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/ommjange-dining-table/natural.jpg",
        "priceOmr": 150,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ommjaenge-drop-leaf-table-pine-stained-blue-90594676/"
      }
    ],
    "images": [
      "/images/catalog/ommjange-dining-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 274
  },
  {
    "id": "ikea-garnanas-coffee-table",
    "slug": "garnanas-coffee-table",
    "category": "coffee-tables",
    "model": "GARNANÄS",
    "nameEn": "GarnanäS Coffee Table",
    "nameAr": "طاولة قهوة GARNANÄS",
    "descEn": "GarnanäS Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة GARNANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 49,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/garnanaes-coffee-table-green-00556508/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 65,
      "depthCm": 65,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "garnanas-coffee-table-green",
        "colorId": "green",
        "image": "/images/catalog/garnanas-coffee-table/green.jpg",
        "priceOmr": 49,
        "sourceUrl": "https://www.ikea.com/om/ar/p/garnanaes-coffee-table-green-00556508/"
      }
    ],
    "images": [
      "/images/catalog/garnanas-coffee-table/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 275
  },
  {
    "id": "ikea-tonstad-table-2",
    "slug": "tonstad-table-2",
    "category": "dining",
    "model": "TONSTAD",
    "nameEn": "Tonstad Table",
    "nameAr": "طاولة TONSTAD",
    "descEn": "Tonstad Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 108,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-drawer-unit-on-castors-off-white-50538201/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 60,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory",
      "brown"
    ],
    "variants": [
      {
        "variantId": "tonstad-table-2-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-table-2/ivory.jpg",
        "priceOmr": 108,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-drawer-unit-on-castors-off-white-50538201/"
      },
      {
        "variantId": "tonstad-table-2-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/tonstad-table-2/brown.jpg",
        "priceOmr": 108,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-drawer-unit-on-castors-brown-stained-oak-veneer-00538208/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-table-2/ivory.jpg",
      "/images/catalog/tonstad-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 276
  },
  {
    "id": "ikea-skansnas-dining-table-2",
    "slug": "skansnas-dining-table-2",
    "category": "dining",
    "model": "SKANSNÄS",
    "nameEn": "SkansnäS Dining Table",
    "nameAr": "طاولة طعام SKANSNÄS",
    "descEn": "SkansnäS Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام SKANSNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 169,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skansnaes-extendable-table-brown-beech-veneer-00565758/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 205,
      "depthCm": 90,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "skansnas-dining-table-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/skansnas-dining-table-2/brown.jpg",
        "priceOmr": 169,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skansnaes-extendable-table-brown-beech-veneer-00565758/"
      }
    ],
    "images": [
      "/images/catalog/skansnas-dining-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 277
  },
  {
    "id": "ikea-stockholm-2025-side-table-2",
    "slug": "stockholm-2025-side-table-2",
    "category": "side-tables",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Side Table",
    "nameAr": "طاولة جانبية STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 31,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-oak-veneer-dark-brown-90586558/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-side-table-2-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/stockholm-2025-side-table-2/brown.jpg",
        "priceOmr": 31,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-oak-veneer-dark-brown-90586558/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-side-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 278
  },
  {
    "id": "ikea-guttane-side-table",
    "slug": "guttane-side-table",
    "category": "side-tables",
    "model": "GUTTANE",
    "nameEn": "Guttane Side Table",
    "nameAr": "طاولة جانبية GUTTANE",
    "descEn": "Guttane Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية GUTTANE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/guttane-side-table-oak-80587718/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 58,
      "depthCm": 39,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "guttane-side-table-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/guttane-side-table/oak.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/guttane-side-table-oak-80587718/"
      }
    ],
    "images": [
      "/images/catalog/guttane-side-table/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 279
  },
  {
    "id": "ikea-stockholm-2025-table-2",
    "slug": "stockholm-2025-table-2",
    "category": "dining",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Table",
    "nameAr": "طاولة STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 250,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-table-oak-veneer-oak-veneer-s79579984/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 230,
      "depthCm": 90,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-table-2-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/stockholm-2025-table-2/oak.jpg",
        "priceOmr": 250,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-table-oak-veneer-oak-veneer-s79579984/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-table-2/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 280
  },
  {
    "id": "ikea-nasinge-dining-table",
    "slug": "nasinge-dining-table",
    "category": "dining",
    "model": "NÄSINGE",
    "nameEn": "NäSinge Dining Table",
    "nameAr": "طاولة طعام NÄSINGE",
    "descEn": "NäSinge Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام NÄSINGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 231,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-gateleg-table-with-storage-dark-brown-stained-beech-veneer-60587540/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 159,
      "depthCm": 85,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown",
      "white"
    ],
    "variants": [
      {
        "variantId": "nasinge-dining-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/nasinge-dining-table/brown.jpg",
        "priceOmr": 231,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-gateleg-table-with-storage-dark-brown-stained-beech-veneer-60587540/"
      },
      {
        "variantId": "nasinge-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/nasinge-dining-table/white.jpg",
        "priceOmr": 231,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-gateleg-table-with-storage-white-20587537/"
      }
    ],
    "images": [
      "/images/catalog/nasinge-dining-table/brown.jpg",
      "/images/catalog/nasinge-dining-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 281
  },
  {
    "id": "ikea-vihals-bedside-table",
    "slug": "vihals-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "VIHALS",
    "nameEn": "Vihals Bedside Table",
    "nameAr": "طاولة سرير VIHALS",
    "descEn": "Vihals Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 30,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bedside-table-white-80488737/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 37,
      "depthCm": 37,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bedside-table-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bedside-table/white.jpg",
        "priceOmr": 30,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bedside-table-white-80488737/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bedside-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 282
  },
  {
    "id": "ikea-danderyd-dining-table-2",
    "slug": "danderyd-dining-table-2",
    "category": "dining",
    "model": "DANDERYD",
    "nameEn": "Danderyd Dining Table",
    "nameAr": "طاولة طعام DANDERYD",
    "descEn": "Danderyd Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام DANDERYD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 67,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/danderyd-drop-leaf-table-oak-veneer-white-10516121/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 134,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "danderyd-dining-table-2-white",
        "colorId": "white",
        "materialId": "oak",
        "image": "/images/catalog/danderyd-dining-table-2/white.jpg",
        "priceOmr": 67,
        "sourceUrl": "https://www.ikea.com/om/ar/p/danderyd-drop-leaf-table-oak-veneer-white-10516121/"
      }
    ],
    "images": [
      "/images/catalog/danderyd-dining-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 283
  },
  {
    "id": "ikea-alhult-dining-table",
    "slug": "alhult-dining-table",
    "category": "dining",
    "model": "ÅLHULT",
    "nameEn": "åLhult Dining Table",
    "nameAr": "طاولة طعام ÅLHULT",
    "descEn": "åLhult Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام ÅLHULT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 224,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-extendable-table-beige-brown-40597922/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige",
      "black"
    ],
    "variants": [
      {
        "variantId": "alhult-dining-table-beige",
        "colorId": "beige",
        "image": "/images/catalog/alhult-dining-table/beige.jpg",
        "priceOmr": 224,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-extendable-table-beige-brown-40597922/"
      },
      {
        "variantId": "alhult-dining-table-black",
        "colorId": "black",
        "image": "/images/catalog/alhult-dining-table/black.jpg",
        "priceOmr": 224,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-extendable-table-black-brown-50600783/"
      }
    ],
    "images": [
      "/images/catalog/alhult-dining-table/beige.jpg",
      "/images/catalog/alhult-dining-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 284
  },
  {
    "id": "ikea-tonstad-table-3",
    "slug": "tonstad-table-3",
    "category": "dining",
    "model": "TONSTAD",
    "nameEn": "Tonstad Table",
    "nameAr": "طاولة TONSTAD",
    "descEn": "Tonstad Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 300,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-table-brown-stained-oak-veneer-00599937/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 200,
      "depthCm": 85,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "tonstad-table-3-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/tonstad-table-3/brown.jpg",
        "priceOmr": 300,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-table-brown-stained-oak-veneer-00599937/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-table-3/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 285
  },
  {
    "id": "ikea-hauga-dining-table",
    "slug": "hauga-dining-table",
    "category": "dining",
    "model": "HAUGA",
    "nameEn": "Hauga Dining Table",
    "nameAr": "طاولة طعام HAUGA",
    "descEn": "Hauga Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام HAUGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 232,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-drop-leaf-table-grey-birch-veneer-80586002/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 109,
      "depthCm": 74,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "hauga-dining-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/hauga-dining-table/grey.jpg",
        "priceOmr": 232,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-drop-leaf-table-grey-birch-veneer-80586002/"
      },
      {
        "variantId": "hauga-dining-table-white",
        "colorId": "white",
        "image": "/images/catalog/hauga-dining-table/white.jpg",
        "priceOmr": 232,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hauga-drop-leaf-table-white-birch-veneer-20586000/"
      }
    ],
    "images": [
      "/images/catalog/hauga-dining-table/grey.jpg",
      "/images/catalog/hauga-dining-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 286
  },
  {
    "id": "ikea-pinntorp-table",
    "slug": "pinntorp-table",
    "category": "dining",
    "model": "PINNTORP",
    "nameEn": "Pinntorp Table",
    "nameAr": "طاولة PINNTORP",
    "descEn": "Pinntorp Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة PINNTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 222,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-table-light-brown-stained-white-stained-pine-30637834/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 85
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "pinntorp-table-white",
        "colorId": "white",
        "image": "/images/catalog/pinntorp-table/white.jpg",
        "priceOmr": 222,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-table-light-brown-stained-white-stained-pine-30637834/"
      }
    ],
    "images": [
      "/images/catalog/pinntorp-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 287
  },
  {
    "id": "ikea-tonstad-dining-table-2",
    "slug": "tonstad-dining-table-2",
    "category": "dining",
    "model": "TONSTAD",
    "nameEn": "Tonstad Dining Table",
    "nameAr": "طاولة طعام TONSTAD",
    "descEn": "Tonstad Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 120,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-extendable-table-off-white-60600725/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 120,
      "depthCm": 70,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory",
      "brown"
    ],
    "variants": [
      {
        "variantId": "tonstad-dining-table-2-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-dining-table-2/ivory.jpg",
        "priceOmr": 120,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-extendable-table-off-white-60600725/"
      },
      {
        "variantId": "tonstad-dining-table-2-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/tonstad-dining-table-2/brown.jpg",
        "priceOmr": 120,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-extendable-table-brown-stained-oak-veneer-40600726/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-dining-table-2/ivory.jpg",
      "/images/catalog/tonstad-dining-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 288
  },
  {
    "id": "ikea-stockholm-2025-side-table-3",
    "slug": "stockholm-2025-side-table-3",
    "category": "side-tables",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Side Table",
    "nameAr": "طاولة جانبية STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 65,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-on-castors-oak-veneer-70586559/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-side-table-3-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/stockholm-2025-side-table-3/oak.jpg",
        "priceOmr": 65,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-on-castors-oak-veneer-70586559/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-side-table-3/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 289
  },
  {
    "id": "ikea-livelycke-tray-table",
    "slug": "livelycke-tray-table",
    "category": "side-tables",
    "subcategory": "tray",
    "model": "LIVELYCKE",
    "nameEn": "Livelycke Tray Table",
    "nameAr": "طاولة صينية LIVELYCKE",
    "descEn": "Livelycke Tray Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة صينية LIVELYCKE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 35,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/livelycke-tray-table-black-90564009/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 50
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "livelycke-tray-table-black",
        "colorId": "black",
        "image": "/images/catalog/livelycke-tray-table/black.jpg",
        "priceOmr": 35,
        "sourceUrl": "https://www.ikea.com/om/ar/p/livelycke-tray-table-black-90564009/"
      }
    ],
    "images": [
      "/images/catalog/livelycke-tray-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 290
  },
  {
    "id": "ikea-frotorp-coffee-table-2",
    "slug": "frotorp-coffee-table-2",
    "category": "coffee-tables",
    "model": "FRÖTORP",
    "nameEn": "FröTorp Coffee Table",
    "nameAr": "طاولة قهوة FRÖTORP",
    "descEn": "FröTorp Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة FRÖTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 59,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-coffee-table-side-table-set-of-2-anthracite-marble-effect-black-glass-s59621408/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "white"
    ],
    "variants": [
      {
        "variantId": "frotorp-coffee-table-2-black",
        "colorId": "black",
        "materialId": "glass",
        "image": "/images/catalog/frotorp-coffee-table-2/black.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-coffee-table-side-table-set-of-2-anthracite-marble-effect-black-glass-s59621408/"
      },
      {
        "variantId": "frotorp-coffee-table-2-white",
        "colorId": "white",
        "materialId": "glass",
        "image": "/images/catalog/frotorp-coffee-table-2/white.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/froetorp-coffee-table-side-table-set-of-2-white-chrome-plated-white-glass-s89618188/"
      }
    ],
    "images": [
      "/images/catalog/frotorp-coffee-table-2/black.jpg",
      "/images/catalog/frotorp-coffee-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 291
  },
  {
    "id": "ikea-valnas-side-table",
    "slug": "valnas-side-table",
    "category": "side-tables",
    "model": "VALNÄS",
    "nameEn": "ValnäS Side Table",
    "nameAr": "طاولة جانبية VALNÄS",
    "descEn": "ValnäS Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية VALNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 65,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-side-table-oak-veneer-80628035/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "valnas-side-table-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/valnas-side-table/oak.jpg",
        "priceOmr": 65,
        "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-side-table-oak-veneer-80628035/"
      }
    ],
    "images": [
      "/images/catalog/valnas-side-table/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 292
  },
  {
    "id": "ikea-stensele-table",
    "slug": "stensele-table",
    "category": "dining",
    "model": "STENSELE",
    "nameEn": "Stensele Table",
    "nameAr": "طاولة STENSELE",
    "descEn": "Stensele Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة STENSELE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 170,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stensele-table-top-anthracite-90412898/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 70
    },
    "dimensionsKnown": true,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "stensele-table-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/stensele-table/charcoal.jpg",
        "priceOmr": 170,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stensele-table-top-anthracite-90412898/"
      }
    ],
    "images": [
      "/images/catalog/stensele-table/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 293
  },
  {
    "id": "ikea-tonstad-bedside-table",
    "slug": "tonstad-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "TONSTAD",
    "nameEn": "Tonstad Bedside Table",
    "nameAr": "طاولة سرير TONSTAD",
    "descEn": "Tonstad Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 43,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-bedside-table-off-white-80510007/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 40,
      "heightCm": 59
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "tonstad-bedside-table-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-bedside-table/ivory.jpg",
        "priceOmr": 43,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-bedside-table-off-white-80510007/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-bedside-table/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 294
  },
  {
    "id": "ikea-lack-coffee-table-2",
    "slug": "lack-coffee-table-2",
    "category": "coffee-tables",
    "model": "LACK",
    "nameEn": "Lack Coffee Table",
    "nameAr": "طاولة قهوة LACK",
    "descEn": "Lack Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة LACK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 106,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lack-coffee-table-black-brown-00104291/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 118,
      "depthCm": 78,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black",
      "white"
    ],
    "variants": [
      {
        "variantId": "lack-coffee-table-2-black",
        "colorId": "black",
        "image": "/images/catalog/lack-coffee-table-2/black.jpg",
        "priceOmr": 106,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-coffee-table-black-brown-00104291/"
      },
      {
        "variantId": "lack-coffee-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/lack-coffee-table-2/white.jpg",
        "gallery": [
          "/images/catalog/lack-coffee-table-2/white-1.jpg"
        ],
        "priceOmr": 106,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lack-coffee-table-white-80449901/"
      }
    ],
    "images": [
      "/images/catalog/lack-coffee-table-2/black.jpg",
      "/images/catalog/lack-coffee-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 295
  },
  {
    "id": "ikea-vittsjo-table",
    "slug": "vittsjo-table",
    "category": "dining",
    "model": "VITTSJÖ",
    "nameEn": "Vittsjö Table",
    "nameAr": "طاولة VITTSJÖ",
    "descEn": "Vittsjö Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة VITTSJÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 133,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-laptop-stand-black-brown-glass-00250249/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 35,
      "depthCm": 65,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "vittsjo-table-black",
        "colorId": "black",
        "materialId": "glass",
        "image": "/images/catalog/vittsjo-table/black.jpg",
        "priceOmr": 133,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vittsjoe-laptop-stand-black-brown-glass-00250249/"
      }
    ],
    "images": [
      "/images/catalog/vittsjo-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 296
  },
  {
    "id": "ikea-knarrevik-bedside-table",
    "slug": "knarrevik-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "KNARREVIK",
    "nameEn": "Knarrevik Bedside Table",
    "nameAr": "طاولة سرير KNARREVIK",
    "descEn": "Knarrevik Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير KNARREVIK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 44,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/knarrevik-bedside-table-black-20569977/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 42,
      "depthCm": 34,
      "heightCm": 52
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "knarrevik-bedside-table-black",
        "colorId": "black",
        "image": "/images/catalog/knarrevik-bedside-table/black.jpg",
        "priceOmr": 44,
        "sourceUrl": "https://www.ikea.com/om/ar/p/knarrevik-bedside-table-black-20569977/"
      }
    ],
    "images": [
      "/images/catalog/knarrevik-bedside-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 297
  },
  {
    "id": "ikea-olserod-side-table",
    "slug": "olserod-side-table",
    "category": "side-tables",
    "model": "OLSERÖD",
    "nameEn": "OlseröD Side Table",
    "nameAr": "طاولة جانبية OLSERÖD",
    "descEn": "OlseröD Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية OLSERÖD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 46,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/olseroed-side-table-anthracite-dark-grey-40530917/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 53,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "olserod-side-table-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/olserod-side-table/charcoal.jpg",
        "gallery": [
          "/images/catalog/olserod-side-table/charcoal-1.jpg"
        ],
        "priceOmr": 46,
        "sourceUrl": "https://www.ikea.com/om/ar/p/olseroed-side-table-anthracite-dark-grey-40530917/"
      }
    ],
    "images": [
      "/images/catalog/olserod-side-table/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 298
  },
  {
    "id": "ikea-hattasen-bedside-table",
    "slug": "hattasen-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "HATTÅSEN",
    "nameEn": "HattåSen Bedside Table",
    "nameAr": "طاولة سرير HATTÅSEN",
    "descEn": "HattåSen Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير HATTÅSEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 54,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hattasen-bedside-table-shelf-unit-white-80569234/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "hattasen-bedside-table-white",
        "colorId": "white",
        "image": "/images/catalog/hattasen-bedside-table/white.jpg",
        "priceOmr": 54,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hattasen-bedside-table-shelf-unit-white-80569234/"
      }
    ],
    "images": [
      "/images/catalog/hattasen-bedside-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 299
  },
  {
    "id": "ikea-nasinge-dining-table-2",
    "slug": "nasinge-dining-table-2",
    "category": "dining",
    "model": "NÄSINGE",
    "nameEn": "NäSinge Dining Table",
    "nameAr": "طاولة طعام NÄSINGE",
    "descEn": "NäSinge Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام NÄSINGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 261,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-extendable-table-white-00587492/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 190,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "brown"
    ],
    "variants": [
      {
        "variantId": "nasinge-dining-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/nasinge-dining-table-2/white.jpg",
        "priceOmr": 261,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-extendable-table-white-00587492/"
      },
      {
        "variantId": "nasinge-dining-table-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/nasinge-dining-table-2/brown.jpg",
        "priceOmr": 261,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-extendable-table-dark-brown-stained-beech-veneer-70587498/"
      }
    ],
    "images": [
      "/images/catalog/nasinge-dining-table-2/white.jpg",
      "/images/catalog/nasinge-dining-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 300
  },
  {
    "id": "ikea-tranered-coffee-table",
    "slug": "tranered-coffee-table",
    "category": "coffee-tables",
    "model": "TRANERED",
    "nameEn": "Tranered Coffee Table",
    "nameAr": "طاولة قهوة TRANERED",
    "descEn": "Tranered Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة TRANERED — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 51,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tranered-coffee-table-dark-brown-10608998/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 90,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "tranered-coffee-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/tranered-coffee-table/brown.jpg",
        "priceOmr": 51,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tranered-coffee-table-dark-brown-10608998/"
      }
    ],
    "images": [
      "/images/catalog/tranered-coffee-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 301
  },
  {
    "id": "ikea-nasinge-table",
    "slug": "nasinge-table",
    "category": "dining",
    "model": "NÄSINGE",
    "nameEn": "NäSinge Table",
    "nameAr": "طاولة NÄSINGE",
    "descEn": "NäSinge Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة NÄSINGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 211,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-table-dark-brown-stained-beech-veneer-10587533/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 60,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown",
      "white"
    ],
    "variants": [
      {
        "variantId": "nasinge-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/nasinge-table/brown.jpg",
        "priceOmr": 211,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-table-dark-brown-stained-beech-veneer-10587533/"
      },
      {
        "variantId": "nasinge-table-white",
        "colorId": "white",
        "image": "/images/catalog/nasinge-table/white.jpg",
        "priceOmr": 211,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-table-white-60587535/"
      }
    ],
    "images": [
      "/images/catalog/nasinge-table/brown.jpg",
      "/images/catalog/nasinge-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 302
  },
  {
    "id": "ikea-sandared-footstool-2",
    "slug": "sandared-footstool-2",
    "category": "chairs",
    "subcategory": "footstool",
    "model": "SANDARED",
    "nameEn": "Sandared Footstool",
    "nameAr": "مسند قدمين SANDARED",
    "descEn": "Sandared Footstool — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مسند قدمين SANDARED — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 31,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sandared-pouffe-grey-00385309/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 50,
      "heightCm": 56
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "sandared-footstool-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/sandared-footstool-2/grey.jpg",
        "priceOmr": 31,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sandared-pouffe-grey-00385309/"
      }
    ],
    "images": [
      "/images/catalog/sandared-footstool-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 303
  },
  {
    "id": "ikea-guttane-coffee-table",
    "slug": "guttane-coffee-table",
    "category": "coffee-tables",
    "model": "GUTTANE",
    "nameEn": "Guttane Coffee Table",
    "nameAr": "طاولة قهوة GUTTANE",
    "descEn": "Guttane Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة GUTTANE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 86,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/guttane-coffee-table-oak-10587712/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 116,
      "depthCm": 39,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "guttane-coffee-table-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/guttane-coffee-table/oak.jpg",
        "priceOmr": 86,
        "sourceUrl": "https://www.ikea.com/om/ar/p/guttane-coffee-table-oak-10587712/"
      }
    ],
    "images": [
      "/images/catalog/guttane-coffee-table/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 304
  },
  {
    "id": "ikea-gunde-table",
    "slug": "gunde-table",
    "category": "dining",
    "model": "GUNDE",
    "nameEn": "Gunde Table",
    "nameAr": "طاولة GUNDE",
    "descEn": "Gunde Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة GUNDE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 150,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gunde-folding-table-black-00546897/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 67,
      "depthCm": 67,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "gunde-table-black",
        "colorId": "black",
        "image": "/images/catalog/gunde-table/black.jpg",
        "priceOmr": 150,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gunde-folding-table-black-00546897/"
      }
    ],
    "images": [
      "/images/catalog/gunde-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 305
  },
  {
    "id": "ikea-stockholm-2025-side-table-4",
    "slug": "stockholm-2025-side-table-4",
    "category": "side-tables",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Side Table",
    "nameAr": "طاولة جانبية STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 58,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-pine-veneer-black-30586561/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 40
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-side-table-4-black",
        "colorId": "black",
        "image": "/images/catalog/stockholm-2025-side-table-4/black.jpg",
        "priceOmr": 58,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-side-table-pine-veneer-black-30586561/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-side-table-4/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 306
  },
  {
    "id": "ikea-docksta-table",
    "slug": "docksta-table",
    "category": "dining",
    "model": "DOCKSTA",
    "nameEn": "Docksta Table",
    "nameAr": "طاولة DOCKSTA",
    "descEn": "Docksta Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة DOCKSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 199,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/docksta-table-white-white-s19324995/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 103
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "docksta-table-white",
        "colorId": "white",
        "image": "/images/catalog/docksta-table/white.jpg",
        "priceOmr": 199,
        "sourceUrl": "https://www.ikea.com/om/ar/p/docksta-table-white-white-s19324995/"
      }
    ],
    "images": [
      "/images/catalog/docksta-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 307
  },
  {
    "id": "ikea-borgeby-coffee-table",
    "slug": "borgeby-coffee-table",
    "category": "coffee-tables",
    "model": "BORGEBY",
    "nameEn": "Borgeby Coffee Table",
    "nameAr": "طاولة قهوة BORGEBY",
    "descEn": "Borgeby Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة BORGEBY — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 103,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/borgeby-coffee-table-birch-veneer-70389356/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 70
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural",
      "black"
    ],
    "variants": [
      {
        "variantId": "borgeby-coffee-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/borgeby-coffee-table/natural.jpg",
        "priceOmr": 103,
        "sourceUrl": "https://www.ikea.com/om/ar/p/borgeby-coffee-table-birch-veneer-70389356/"
      },
      {
        "variantId": "borgeby-coffee-table-black",
        "colorId": "black",
        "image": "/images/catalog/borgeby-coffee-table/black.jpg",
        "priceOmr": 103,
        "sourceUrl": "https://www.ikea.com/om/ar/p/borgeby-coffee-table-black-30500355/"
      }
    ],
    "images": [
      "/images/catalog/borgeby-coffee-table/natural.jpg",
      "/images/catalog/borgeby-coffee-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 308
  },
  {
    "id": "ikea-stockholm-2025-coffee-table-3",
    "slug": "stockholm-2025-coffee-table-3",
    "category": "coffee-tables",
    "model": "STOCKHOLM 2025",
    "nameEn": "Stockholm 2025 Coffee Table",
    "nameAr": "طاولة قهوة STOCKHOLM 2025",
    "descEn": "Stockholm 2025 Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة STOCKHOLM 2025 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 58,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-coffee-table-oak-veneer-dark-brown-50586555/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "stockholm-2025-coffee-table-3-brown",
        "colorId": "brown",
        "materialId": "oak",
        "image": "/images/catalog/stockholm-2025-coffee-table-3/brown.jpg",
        "priceOmr": 58,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stockholm-2025-coffee-table-oak-veneer-dark-brown-50586555/"
      }
    ],
    "images": [
      "/images/catalog/stockholm-2025-coffee-table-3/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 309
  },
  {
    "id": "ikea-stensele-table-2",
    "slug": "stensele-table-2",
    "category": "dining",
    "model": "STENSELE",
    "nameEn": "Stensele Table",
    "nameAr": "طاولة STENSELE",
    "descEn": "Stensele Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة STENSELE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 96,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stensele-table-anthracite-anthracite-s79288230/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 70
    },
    "dimensionsKnown": true,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "stensele-table-2-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/stensele-table-2/charcoal.jpg",
        "priceOmr": 96,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stensele-table-anthracite-anthracite-s79288230/"
      }
    ],
    "images": [
      "/images/catalog/stensele-table-2/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 310
  },
  {
    "id": "ikea-vikhammer-bedside-table",
    "slug": "vikhammer-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "VIKHAMMER",
    "nameEn": "Vikhammer Bedside Table",
    "nameAr": "طاولة سرير VIKHAMMER",
    "descEn": "Vikhammer Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير VIKHAMMER — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 37,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vikhammer-bedside-table-white-00381764/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 39,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vikhammer-bedside-table-white",
        "colorId": "white",
        "image": "/images/catalog/vikhammer-bedside-table/white.jpg",
        "priceOmr": 37,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vikhammer-bedside-table-white-00381764/"
      }
    ],
    "images": [
      "/images/catalog/vikhammer-bedside-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 311
  },
  {
    "id": "ikea-brannboll-side-table",
    "slug": "brannboll-side-table",
    "category": "side-tables",
    "model": "BRÄNNBOLL",
    "nameEn": "BräNnboll Side Table",
    "nameAr": "طاولة جانبية BRÄNNBOLL",
    "descEn": "BräNnboll Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية BRÄNNBOLL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 20,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-side-table-on-castors-light-ash-effect-white-00586360/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "ash"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 69,
      "depthCm": 39,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "brannboll-side-table-white",
        "colorId": "white",
        "materialId": "ash",
        "image": "/images/catalog/brannboll-side-table/white.jpg",
        "priceOmr": 20,
        "sourceUrl": "https://www.ikea.com/om/ar/p/braennboll-side-table-on-castors-light-ash-effect-white-00586360/"
      }
    ],
    "images": [
      "/images/catalog/brannboll-side-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 312
  },
  {
    "id": "ikea-grotan-table-2",
    "slug": "grotan-table-2",
    "category": "dining",
    "model": "GRÖTÅN",
    "nameEn": "GröTåN Table",
    "nameAr": "طاولة GRÖTÅN",
    "descEn": "GröTåN Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة GRÖTÅN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 139,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/groetan-table-pine-brown-stained-80610422/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 80
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "grotan-table-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/grotan-table-2/brown.jpg",
        "priceOmr": 139,
        "sourceUrl": "https://www.ikea.com/om/ar/p/groetan-table-pine-brown-stained-80610422/"
      }
    ],
    "images": [
      "/images/catalog/grotan-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 313
  },
  {
    "id": "ikea-skogsta-table",
    "slug": "skogsta-table",
    "category": "dining",
    "model": "SKOGSTA",
    "nameEn": "Skogsta Table",
    "nameAr": "طاولة SKOGSTA",
    "descEn": "Skogsta Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة SKOGSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 115,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-table-acacia-black-00452643/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 81,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "skogsta-table-black",
        "colorId": "black",
        "image": "/images/catalog/skogsta-table/black.jpg",
        "priceOmr": 115,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skogsta-table-acacia-black-00452643/"
      }
    ],
    "images": [
      "/images/catalog/skogsta-table/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 314
  },
  {
    "id": "ikea-lisabo-table-2",
    "slug": "lisabo-table-2",
    "category": "dining",
    "model": "LISABO",
    "nameEn": "Lisabo Table",
    "nameAr": "طاولة LISABO",
    "descEn": "Lisabo Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة LISABO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 197,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-table-ash-veneer-40416498/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "ash"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 80,
      "heightCm": 105
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "lisabo-table-2-natural",
        "colorId": "natural",
        "materialId": "ash",
        "image": "/images/catalog/lisabo-table-2/natural.jpg",
        "priceOmr": 197,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-table-ash-veneer-40416498/"
      }
    ],
    "images": [
      "/images/catalog/lisabo-table-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 315
  },
  {
    "id": "ikea-ugglerum-side-table",
    "slug": "ugglerum-side-table",
    "category": "side-tables",
    "model": "UGGLERUM",
    "nameEn": "Ugglerum Side Table",
    "nameAr": "طاولة جانبية UGGLERUM",
    "descEn": "Ugglerum Side Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة جانبية UGGLERUM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ugglerum-side-table-brown-00627983/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 46,
      "depthCm": 40,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "ugglerum-side-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/ugglerum-side-table/brown.jpg",
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ugglerum-side-table-brown-00627983/"
      }
    ],
    "images": [
      "/images/catalog/ugglerum-side-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 316
  },
  {
    "id": "ikea-nasinge-table-2",
    "slug": "nasinge-table-2",
    "category": "dining",
    "model": "NÄSINGE",
    "nameEn": "NäSinge Table",
    "nameAr": "طاولة NÄSINGE",
    "descEn": "NäSinge Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة NÄSINGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 59,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-table-white-70587506/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 130,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white",
      "brown"
    ],
    "variants": [
      {
        "variantId": "nasinge-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/nasinge-table-2/white.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-table-white-70587506/"
      },
      {
        "variantId": "nasinge-table-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/nasinge-table-2/brown.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/naesinge-table-dark-brown-stained-beech-veneer-30587508/"
      }
    ],
    "images": [
      "/images/catalog/nasinge-table-2/white.jpg",
      "/images/catalog/nasinge-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 317
  },
  {
    "id": "ikea-grytsholm-nest-of-tables",
    "slug": "grytsholm-nest-of-tables",
    "category": "side-tables",
    "subcategory": "nest",
    "model": "GRYTSHOLM",
    "nameEn": "Grytsholm Nest of Tables",
    "nameAr": "طاولات متداخلة GRYTSHOLM",
    "descEn": "Grytsholm Nest of Tables — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولات متداخلة GRYTSHOLM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 23,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/grytsholm-nest-of-tables-set-of-2-outdoor-black-blue-90597161/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 50,
      "depthCm": 50,
      "heightCm": 55
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "grytsholm-nest-of-tables-black",
        "colorId": "black",
        "image": "/images/catalog/grytsholm-nest-of-tables/black.jpg",
        "priceOmr": 23,
        "sourceUrl": "https://www.ikea.com/om/ar/p/grytsholm-nest-of-tables-set-of-2-outdoor-black-blue-90597161/"
      }
    ],
    "images": [
      "/images/catalog/grytsholm-nest-of-tables/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 318
  },
  {
    "id": "ikea-valnas-coffee-table",
    "slug": "valnas-coffee-table",
    "category": "coffee-tables",
    "model": "VALNÄS",
    "nameEn": "ValnäS Coffee Table",
    "nameAr": "طاولة قهوة VALNÄS",
    "descEn": "ValnäS Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة VALNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 75,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-coffee-table-side-table-set-of-2-oak-veneer-s09622429/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "valnas-coffee-table-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/valnas-coffee-table/oak.jpg",
        "priceOmr": 75,
        "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-coffee-table-side-table-set-of-2-oak-veneer-s09622429/"
      }
    ],
    "images": [
      "/images/catalog/valnas-coffee-table/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 319
  },
  {
    "id": "ikea-nackanas-table",
    "slug": "nackanas-table",
    "category": "dining",
    "model": "NACKANÄS",
    "nameEn": "NackanäS Table",
    "nameAr": "طاولة NACKANÄS",
    "descEn": "NackanäS Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة NACKANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 72,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nackanaes-table-acacia-40511056/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 76,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "nackanas-table-natural",
        "colorId": "natural",
        "image": "/images/catalog/nackanas-table/natural.jpg",
        "priceOmr": 72,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nackanaes-table-acacia-40511056/"
      }
    ],
    "images": [
      "/images/catalog/nackanas-table/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 320
  },
  {
    "id": "ikea-torsjo-coffee-table",
    "slug": "torsjo-coffee-table",
    "category": "coffee-tables",
    "model": "TORSJÖ",
    "nameEn": "Torsjö Coffee Table",
    "nameAr": "طاولة قهوة TORSJÖ",
    "descEn": "Torsjö Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة TORSJÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 82,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/torsjoe-coffee-table-gold-effect-glass-50590406/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "glass"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 88
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brass"
    ],
    "variants": [
      {
        "variantId": "torsjo-coffee-table-brass",
        "colorId": "brass",
        "materialId": "glass",
        "image": "/images/catalog/torsjo-coffee-table/brass.jpg",
        "priceOmr": 82,
        "sourceUrl": "https://www.ikea.com/om/ar/p/torsjoe-coffee-table-gold-effect-glass-50590406/"
      }
    ],
    "images": [
      "/images/catalog/torsjo-coffee-table/brass.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 321
  },
  {
    "id": "ikea-hemnes-bedside-table",
    "slug": "hemnes-bedside-table",
    "category": "side-tables",
    "subcategory": "bedside",
    "model": "HEMNES",
    "nameEn": "Hemnes Bedside Table",
    "nameAr": "طاولة سرير HEMNES",
    "descEn": "Hemnes Bedside Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة سرير HEMNES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 26,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hemnes-bedside-table-grey-green-light-brown-stained-50610739/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 46,
      "depthCm": 35,
      "heightCm": 55
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "hemnes-bedside-table-grey",
        "colorId": "grey",
        "image": "/images/catalog/hemnes-bedside-table/grey.jpg",
        "priceOmr": 26,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hemnes-bedside-table-grey-green-light-brown-stained-50610739/"
      }
    ],
    "images": [
      "/images/catalog/hemnes-bedside-table/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 322
  },
  {
    "id": "ikea-pinntorp-table-2",
    "slug": "pinntorp-table-2",
    "category": "dining",
    "model": "PINNTORP",
    "nameEn": "Pinntorp Table",
    "nameAr": "طاولة PINNTORP",
    "descEn": "Pinntorp Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة PINNTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 105,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-table-light-brown-stained-blue-stained-pine-20635171/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 125,
      "depthCm": 75,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown",
      "white"
    ],
    "variants": [
      {
        "variantId": "pinntorp-table-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/pinntorp-table-2/brown.jpg",
        "priceOmr": 105,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-table-light-brown-stained-blue-stained-pine-20635171/"
      },
      {
        "variantId": "pinntorp-table-2-white",
        "colorId": "white",
        "image": "/images/catalog/pinntorp-table-2/white.jpg",
        "priceOmr": 105,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pinntorp-table-light-brown-stained-white-stained-pine-30529467/"
      }
    ],
    "images": [
      "/images/catalog/pinntorp-table-2/brown.jpg",
      "/images/catalog/pinntorp-table-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 323
  },
  {
    "id": "ikea-alhult-dining-table-2",
    "slug": "alhult-dining-table-2",
    "category": "dining",
    "model": "ÅLHULT",
    "nameEn": "åLhult Dining Table",
    "nameAr": "طاولة طعام ÅLHULT",
    "descEn": "åLhult Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "طاولة طعام ÅLHULT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 244,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-extendable-table-black-brown-20600789/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 170,
      "depthCm": 80,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black",
      "beige"
    ],
    "variants": [
      {
        "variantId": "alhult-dining-table-2-black",
        "colorId": "black",
        "image": "/images/catalog/alhult-dining-table-2/black.jpg",
        "priceOmr": 244,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-extendable-table-black-brown-20600789/"
      },
      {
        "variantId": "alhult-dining-table-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/alhult-dining-table-2/beige.jpg",
        "priceOmr": 244,
        "sourceUrl": "https://www.ikea.com/om/ar/p/alhult-extendable-table-beige-brown-60597921/"
      }
    ],
    "images": [
      "/images/catalog/alhult-dining-table-2/black.jpg",
      "/images/catalog/alhult-dining-table-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 324
  },
  {
    "id": "ikea-ugglerum-coffee-table-2",
    "slug": "ugglerum-coffee-table-2",
    "category": "coffee-tables",
    "model": "UGGLERUM",
    "nameEn": "Ugglerum Coffee Table",
    "nameAr": "طاولة قهوة UGGLERUM",
    "descEn": "Ugglerum Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة UGGLERUM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 103,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ugglerum-coffee-table-side-table-set-of-2-walnut-veneer-brown-s49622427/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 110,
      "depthCm": 60,
      "heightCm": 45
    },
    "dimensionsKnown": false,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "ugglerum-coffee-table-2-brown",
        "colorId": "brown",
        "materialId": "walnut",
        "image": "/images/catalog/ugglerum-coffee-table-2/brown.jpg",
        "priceOmr": 103,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ugglerum-coffee-table-side-table-set-of-2-walnut-veneer-brown-s49622427/"
      }
    ],
    "images": [
      "/images/catalog/ugglerum-coffee-table-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 325
  },
  {
    "id": "ikea-hakanskar-coffee-table",
    "slug": "hakanskar-coffee-table",
    "category": "coffee-tables",
    "model": "HÅKANSKÄR",
    "nameEn": "HåKanskäR Coffee Table",
    "nameAr": "طاولة قهوة HÅKANSKÄR",
    "descEn": "HåKanskäR Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة HÅKANSKÄR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 99,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hakanskaer-coffee-table-outdoor-light-brown-stained-70597162/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 64,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "hakanskar-coffee-table-brown",
        "colorId": "brown",
        "image": "/images/catalog/hakanskar-coffee-table/brown.jpg",
        "priceOmr": 99,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hakanskaer-coffee-table-outdoor-light-brown-stained-70597162/"
      }
    ],
    "images": [
      "/images/catalog/hakanskar-coffee-table/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 326
  },
  {
    "id": "ikea-valnas-coffee-table-2",
    "slug": "valnas-coffee-table-2",
    "category": "coffee-tables",
    "model": "VALNÄS",
    "nameEn": "ValnäS Coffee Table",
    "nameAr": "طاولة قهوة VALNÄS",
    "descEn": "ValnäS Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة VALNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 59,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-coffee-table-oak-veneer-20628038/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "oak"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 118,
      "depthCm": 72,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "oak"
    ],
    "variants": [
      {
        "variantId": "valnas-coffee-table-2-oak",
        "colorId": "oak",
        "materialId": "oak",
        "image": "/images/catalog/valnas-coffee-table-2/oak.jpg",
        "priceOmr": 59,
        "sourceUrl": "https://www.ikea.com/om/ar/p/valnaes-coffee-table-oak-veneer-20628038/"
      }
    ],
    "images": [
      "/images/catalog/valnas-coffee-table-2/oak.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 327
  },
  {
    "id": "ikea-lubban-trolley",
    "slug": "lubban-trolley",
    "category": "storage",
    "subcategory": "trolley",
    "model": "LUBBAN",
    "nameEn": "Lubban Trolley",
    "nameAr": "عربة LUBBAN",
    "descEn": "Lubban Trolley — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "عربة LUBBAN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 29,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lubban-trolley-table-with-storage-rattan-anthracite-50434307/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "rattan"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 40,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "lubban-trolley-charcoal",
        "colorId": "charcoal",
        "materialId": "rattan",
        "image": "/images/catalog/lubban-trolley/charcoal.jpg",
        "priceOmr": 29,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lubban-trolley-table-with-storage-rattan-anthracite-50434307/"
      }
    ],
    "images": [
      "/images/catalog/lubban-trolley/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 328
  },
  {
    "id": "ikea-ikea-ps-2026-trolley",
    "slug": "ikea-ps-2026-trolley",
    "category": "storage",
    "subcategory": "trolley",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Trolley",
    "nameAr": "عربة IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Trolley — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "عربة IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 52,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-trolley-beige-50621078/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 89,
      "depthCm": 48,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige",
      "blue"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-trolley-beige",
        "colorId": "beige",
        "image": "/images/catalog/ikea-ps-2026-trolley/beige.jpg",
        "priceOmr": 52,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-trolley-beige-50621078/"
      },
      {
        "variantId": "ikea-ps-2026-trolley-blue",
        "colorId": "blue",
        "image": "/images/catalog/ikea-ps-2026-trolley/blue.jpg",
        "priceOmr": 52,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-trolley-blue-40621074/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-trolley/beige.jpg",
      "/images/catalog/ikea-ps-2026-trolley/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 329
  },
  {
    "id": "ikea-lisabo-table-3",
    "slug": "lisabo-table-3",
    "category": "dining",
    "model": "LISABO",
    "nameEn": "Lisabo Table",
    "nameAr": "طاولة LISABO",
    "descEn": "Lisabo Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة LISABO — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 99,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-table-ash-veneer-10563773/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "ash"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 200,
      "depthCm": 78,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "lisabo-table-3-natural",
        "colorId": "natural",
        "materialId": "ash",
        "image": "/images/catalog/lisabo-table-3/natural.jpg",
        "priceOmr": 99,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lisabo-table-ash-veneer-10563773/"
      }
    ],
    "images": [
      "/images/catalog/lisabo-table-3/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 330
  },
  {
    "id": "ikea-mabarsskar-coffee-table",
    "slug": "mabarsskar-coffee-table",
    "category": "coffee-tables",
    "model": "MÅBÄRSSKÄR",
    "nameEn": "MåBäRsskäR Coffee Table",
    "nameAr": "طاولة قهوة MÅBÄRSSKÄR",
    "descEn": "MåBäRsskäR Coffee Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة قهوة MÅBÄRSSKÄR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 41,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/mabaersskaer-coffee-table-outdoor-indoor-white-30597164/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 61,
      "depthCm": 41,
      "heightCm": 45
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "mabarsskar-coffee-table-white",
        "colorId": "white",
        "image": "/images/catalog/mabarsskar-coffee-table/white.jpg",
        "priceOmr": 41,
        "sourceUrl": "https://www.ikea.com/om/ar/p/mabaersskaer-coffee-table-outdoor-indoor-white-30597164/"
      }
    ],
    "images": [
      "/images/catalog/mabarsskar-coffee-table/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 331
  },
  {
    "id": "ikea-vihals-dining-table-3",
    "slug": "vihals-dining-table-3",
    "category": "dining",
    "model": "VIHALS",
    "nameEn": "Vihals Dining Table",
    "nameAr": "طاولة طعام VIHALS",
    "descEn": "Vihals Dining Table — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "طاولة طعام VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 66,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-extendable-table-white-90569097/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "dining-room"
    ],
    "dimensions": {
      "widthCm": 120,
      "depthCm": 74,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-dining-table-3-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-dining-table-3/white.jpg",
        "priceOmr": 66,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-extendable-table-white-90569097/"
      }
    ],
    "images": [
      "/images/catalog/vihals-dining-table-3/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 332
  },
  {
    "id": "ikea-slattum-bed-frame",
    "slug": "slattum-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLATTUM",
    "nameEn": "Slattum Bed Frame",
    "nameAr": "هيكل سرير SLATTUM",
    "descEn": "Slattum Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLATTUM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 90,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slattum-upholstered-bed-frame-vissle-dark-grey-00571250/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "slattum-bed-frame-grey",
        "colorId": "grey",
        "image": "/images/catalog/slattum-bed-frame/grey.jpg",
        "priceOmr": 90,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slattum-upholstered-bed-frame-vissle-dark-grey-00571250/"
      }
    ],
    "images": [
      "/images/catalog/slattum-bed-frame/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 333
  },
  {
    "id": "ikea-tarva-bed-frame",
    "slug": "tarva-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TARVA",
    "nameEn": "Tarva Bed Frame",
    "nameAr": "هيكل سرير TARVA",
    "descEn": "Tarva Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TARVA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 216,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tarva-bed-frame-white-stained-80586196/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 120,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "tarva-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/tarva-bed-frame/white.jpg",
        "priceOmr": 216,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tarva-bed-frame-white-stained-80586196/"
      }
    ],
    "images": [
      "/images/catalog/tarva-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 334
  },
  {
    "id": "ikea-malm-bed-frame",
    "slug": "malm-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MALM",
    "nameEn": "Malm Bed Frame",
    "nameAr": "هيكل سرير MALM",
    "descEn": "Malm Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MALM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-white-luroey-s29002433/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "malm-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/malm-bed-frame/white.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-white-luroey-s29002433/"
      }
    ],
    "images": [
      "/images/catalog/malm-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 335
  },
  {
    "id": "ikea-neiden-bed-frame",
    "slug": "neiden-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "NEIDEN",
    "nameEn": "Neiden Bed Frame",
    "nameAr": "هيكل سرير NEIDEN",
    "descEn": "Neiden Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير NEIDEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 150,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/neiden-bed-frame-pine-70395239/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "neiden-bed-frame-natural",
        "colorId": "natural",
        "image": "/images/catalog/neiden-bed-frame/natural.jpg",
        "priceOmr": 150,
        "sourceUrl": "https://www.ikea.com/om/ar/p/neiden-bed-frame-pine-70395239/"
      }
    ],
    "images": [
      "/images/catalog/neiden-bed-frame/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 336
  },
  {
    "id": "ikea-tarva-bed-frame-2",
    "slug": "tarva-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TARVA",
    "nameEn": "Tarva Bed Frame",
    "nameAr": "هيكل سرير TARVA",
    "descEn": "Tarva Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TARVA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 210,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tarva-bed-frame-white-stained-s09553973/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "tarva-bed-frame-2-white",
        "colorId": "white",
        "image": "/images/catalog/tarva-bed-frame-2/white.jpg",
        "priceOmr": 210,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tarva-bed-frame-white-stained-s09553973/"
      }
    ],
    "images": [
      "/images/catalog/tarva-bed-frame-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 337
  },
  {
    "id": "ikea-brimnes-bed-frame",
    "slug": "brimnes-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "BRIMNES",
    "nameEn": "Brimnes Bed Frame",
    "nameAr": "هيكل سرير BRIMNES",
    "descEn": "Brimnes Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير BRIMNES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 230,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-bed-frame-w-storage-and-headboard-white-luroey-s79157451/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "brimnes-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/brimnes-bed-frame/white.jpg",
        "priceOmr": 230,
        "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-bed-frame-w-storage-and-headboard-white-luroey-s79157451/"
      }
    ],
    "images": [
      "/images/catalog/brimnes-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 338
  },
  {
    "id": "ikea-malm-bed-frame-2",
    "slug": "malm-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MALM",
    "nameEn": "Malm Bed Frame",
    "nameAr": "هيكل سرير MALM",
    "descEn": "Malm Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MALM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 77,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-w-2-storage-boxes-black-brown-lindbaden-s79494956/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "malm-bed-frame-2-black",
        "colorId": "black",
        "image": "/images/catalog/malm-bed-frame-2/black.jpg",
        "priceOmr": 77,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-w-2-storage-boxes-black-brown-lindbaden-s79494956/"
      }
    ],
    "images": [
      "/images/catalog/malm-bed-frame-2/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 339
  },
  {
    "id": "ikea-stjarno-bed-frame",
    "slug": "stjarno-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "STJÄRNÖ",
    "nameEn": "StjäRnö Bed Frame",
    "nameAr": "هيكل سرير STJÄRNÖ",
    "descEn": "StjäRnö Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير STJÄRNÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 71,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stjaernoe-bed-frame-white-90579497/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "stjarno-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/stjarno-bed-frame/white.jpg",
        "priceOmr": 71,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stjaernoe-bed-frame-white-90579497/"
      }
    ],
    "images": [
      "/images/catalog/stjarno-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 340
  },
  {
    "id": "ikea-norrudden-bed-frame",
    "slug": "norrudden-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "NORRUDDEN",
    "nameEn": "Norrudden Bed Frame",
    "nameAr": "هيكل سرير NORRUDDEN",
    "descEn": "Norrudden Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير NORRUDDEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 222,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/norrudden-guest-bed-black-90531354/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 193,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "norrudden-bed-frame-black",
        "colorId": "black",
        "image": "/images/catalog/norrudden-bed-frame/black.jpg",
        "priceOmr": 222,
        "sourceUrl": "https://www.ikea.com/om/ar/p/norrudden-guest-bed-black-90531354/"
      }
    ],
    "images": [
      "/images/catalog/norrudden-bed-frame/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 341
  },
  {
    "id": "ikea-vihals-bed-frame",
    "slug": "vihals-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 180,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-1-trundle-bed-white-luroey-s69582034/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame/white.jpg",
        "priceOmr": 180,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-1-trundle-bed-white-luroey-s69582034/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 342
  },
  {
    "id": "ikea-minnen-bed-frame",
    "slug": "minnen-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MINNEN",
    "nameEn": "Minnen Bed Frame",
    "nameAr": "هيكل سرير MINNEN",
    "descEn": "Minnen Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MINNEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 218,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/minnen-ext-bed-frame-with-slatted-bed-base-white-s29123958/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "minnen-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/minnen-bed-frame/white.jpg",
        "priceOmr": 218,
        "sourceUrl": "https://www.ikea.com/om/ar/p/minnen-ext-bed-frame-with-slatted-bed-base-white-s29123958/"
      }
    ],
    "images": [
      "/images/catalog/minnen-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 343
  },
  {
    "id": "ikea-vihals-bed-frame-2",
    "slug": "vihals-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 226,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-2-storage-boxes-white-luroey-s59581983/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-2-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-2/white.jpg",
        "priceOmr": 226,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-2-storage-boxes-white-luroey-s59581983/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 344
  },
  {
    "id": "ikea-vihals-bed-frame-3",
    "slug": "vihals-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 103,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-white-90602445/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-3-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-3/white.jpg",
        "priceOmr": 103,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-white-90602445/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-3/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 345
  },
  {
    "id": "ikea-vihals-bed-frame-4",
    "slug": "vihals-bed-frame-4",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 154,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-white-40602424/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-4-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-4/white.jpg",
        "priceOmr": 154,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-white-40602424/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-4/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 346
  },
  {
    "id": "ikea-hemnes-day-bed",
    "slug": "hemnes-day-bed",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "HEMNES",
    "nameEn": "Hemnes Day-bed",
    "nameAr": "سرير نهاري HEMNES",
    "descEn": "Hemnes Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري HEMNES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 154,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hemnes-day-bed-frame-with-3-drawers-grey-green-80622892/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "hemnes-day-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/hemnes-day-bed/grey.jpg",
        "priceOmr": 154,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hemnes-day-bed-frame-with-3-drawers-grey-green-80622892/"
      }
    ],
    "images": [
      "/images/catalog/hemnes-day-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 347
  },
  {
    "id": "ikea-kleppstad-bed-frame",
    "slug": "kleppstad-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "KLEPPSTAD",
    "nameEn": "Kleppstad Bed Frame",
    "nameAr": "هيكل سرير KLEPPSTAD",
    "descEn": "Kleppstad Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير KLEPPSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 177,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kleppstad-bed-frame-white-vissle-beige-10492686/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "kleppstad-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/kleppstad-bed-frame/white.jpg",
        "priceOmr": 177,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kleppstad-bed-frame-white-vissle-beige-10492686/"
      }
    ],
    "images": [
      "/images/catalog/kleppstad-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 348
  },
  {
    "id": "ikea-tarnkullen-bed-frame",
    "slug": "tarnkullen-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TÄRNKULLEN",
    "nameEn": "TäRnkullen Bed Frame",
    "nameAr": "هيكل سرير TÄRNKULLEN",
    "descEn": "TäRnkullen Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TÄRNKULLEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 104,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-kelinge-beige-lindbaden-s29608130/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tarnkullen-bed-frame-beige",
        "colorId": "beige",
        "image": "/images/catalog/tarnkullen-bed-frame/beige.jpg",
        "priceOmr": 104,
        "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-kelinge-beige-lindbaden-s29608130/"
      }
    ],
    "images": [
      "/images/catalog/tarnkullen-bed-frame/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 349
  },
  {
    "id": "ikea-vihals-day-bed",
    "slug": "vihals-day-bed",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "VIHALS",
    "nameEn": "Vihals Day-bed",
    "nameAr": "سرير نهاري VIHALS",
    "descEn": "Vihals Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 145,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-frame-white-00595086/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-day-bed-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-day-bed/white.jpg",
        "priceOmr": 145,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-frame-white-00595086/"
      }
    ],
    "images": [
      "/images/catalog/vihals-day-bed/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 350
  },
  {
    "id": "ikea-vihals-bed-frame-5",
    "slug": "vihals-bed-frame-5",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 230,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-1-trundle-bed-white-luroey-s49582030/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-5-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-5/white.jpg",
        "priceOmr": 230,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-1-trundle-bed-white-luroey-s49582030/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-5/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 351
  },
  {
    "id": "ikea-brimnes-bed-frame-2",
    "slug": "brimnes-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "BRIMNES",
    "nameEn": "Brimnes Bed Frame",
    "nameAr": "هيكل سرير BRIMNES",
    "descEn": "Brimnes Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير BRIMNES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 88,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-bed-frame-with-storage-white-luroey-s29902933/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "brimnes-bed-frame-2-white",
        "colorId": "white",
        "image": "/images/catalog/brimnes-bed-frame-2/white.jpg",
        "priceOmr": 88,
        "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-bed-frame-with-storage-white-luroey-s29902933/"
      }
    ],
    "images": [
      "/images/catalog/brimnes-bed-frame-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 352
  },
  {
    "id": "ikea-vihals-bed-frame-6",
    "slug": "vihals-bed-frame-6",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 85,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-2-storage-boxes-white-luroey-s39581979/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-6-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-6/white.jpg",
        "priceOmr": 85,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-2-storage-boxes-white-luroey-s39581979/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-6/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 353
  },
  {
    "id": "ikea-vihals-day-bed-2",
    "slug": "vihals-day-bed-2",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "VIHALS",
    "nameEn": "Vihals Day-bed",
    "nameAr": "سرير نهاري VIHALS",
    "descEn": "Vihals Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 147,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-with-storage-1-mattress-white-agotnes-firm-s19580594/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-day-bed-2-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-day-bed-2/white.jpg",
        "gallery": [
          "/images/catalog/vihals-day-bed-2/white-1.jpg",
          "/images/catalog/vihals-day-bed-2/white-2.jpg",
          "/images/catalog/vihals-day-bed-2/white-3.jpg"
        ],
        "priceOmr": 147,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-with-storage-1-mattress-white-agotnes-firm-s19580594/"
      }
    ],
    "images": [
      "/images/catalog/vihals-day-bed-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 354
  },
  {
    "id": "ikea-tufjord-bed-frame",
    "slug": "tufjord-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TUFJORD",
    "nameEn": "Tufjord Bed Frame",
    "nameAr": "هيكل سرير TUFJORD",
    "descEn": "Tufjord Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TUFJORD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 276,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tufjord-upholstered-bed-frame-tallmyra-white-black-20573253/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "tufjord-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/tufjord-bed-frame/white.jpg",
        "priceOmr": 276,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tufjord-upholstered-bed-frame-tallmyra-white-black-20573253/"
      }
    ],
    "images": [
      "/images/catalog/tufjord-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 355
  },
  {
    "id": "ikea-idanas-bed-frame",
    "slug": "idanas-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "IDANÄS",
    "nameEn": "IdanäS Bed Frame",
    "nameAr": "هيكل سرير IDANÄS",
    "descEn": "IdanäS Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير IDANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 101,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-bed-frame-white-lindbaden-s49494934/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "idanas-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/idanas-bed-frame/white.jpg",
        "priceOmr": 101,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-bed-frame-white-lindbaden-s49494934/"
      }
    ],
    "images": [
      "/images/catalog/idanas-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 356
  },
  {
    "id": "ikea-vihals-bed-frame-7",
    "slug": "vihals-bed-frame-7",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 174,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-4-storage-boxes-white-luroey-s79582000/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-7-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-7/white.jpg",
        "priceOmr": 174,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-4-storage-boxes-white-luroey-s79582000/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-7/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 357
  },
  {
    "id": "ikea-bjorksnas-bed-frame",
    "slug": "bjorksnas-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "BJÖRKSNÄS",
    "nameEn": "BjöRksnäS Bed Frame",
    "nameAr": "هيكل سرير BJÖRKSNÄS",
    "descEn": "BjöRksnäS Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير BJÖRKSNÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 106,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/bjoerksnaes-bed-frame-birch-birch-veneer-loenset-s79501706/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "bjorksnas-bed-frame-natural",
        "colorId": "natural",
        "image": "/images/catalog/bjorksnas-bed-frame/natural.jpg",
        "priceOmr": 106,
        "sourceUrl": "https://www.ikea.com/om/ar/p/bjoerksnaes-bed-frame-birch-birch-veneer-loenset-s79501706/"
      }
    ],
    "images": [
      "/images/catalog/bjorksnas-bed-frame/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 358
  },
  {
    "id": "ikea-vihals-day-bed-3",
    "slug": "vihals-day-bed-3",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "VIHALS",
    "nameEn": "Vihals Day-bed",
    "nameAr": "سرير نهاري VIHALS",
    "descEn": "Vihals Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 108,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-w-trundle-bed-2-mattresses-white-agotnes-firm-s69580638/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-day-bed-3-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-day-bed-3/white.jpg",
        "gallery": [
          "/images/catalog/vihals-day-bed-3/white-1.jpg",
          "/images/catalog/vihals-day-bed-3/white-2.jpg",
          "/images/catalog/vihals-day-bed-3/white-3.jpg"
        ],
        "priceOmr": 108,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-w-trundle-bed-2-mattresses-white-agotnes-firm-s69580638/"
      }
    ],
    "images": [
      "/images/catalog/vihals-day-bed-3/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 359
  },
  {
    "id": "ikea-tallasen-bed-frame",
    "slug": "tallasen-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TÄLLÅSEN",
    "nameEn": "TäLlåSen Bed Frame",
    "nameAr": "هيكل سرير TÄLLÅSEN",
    "descEn": "TäLlåSen Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TÄLLÅSEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 119,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/taellasen-upholstered-bed-frame-kulsta-grey-green-70538926/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "tallasen-bed-frame-grey",
        "colorId": "grey",
        "image": "/images/catalog/tallasen-bed-frame/grey.jpg",
        "priceOmr": 119,
        "sourceUrl": "https://www.ikea.com/om/ar/p/taellasen-upholstered-bed-frame-kulsta-grey-green-70538926/"
      }
    ],
    "images": [
      "/images/catalog/tallasen-bed-frame/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 360
  },
  {
    "id": "ikea-malm-bed-frame-3",
    "slug": "malm-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MALM",
    "nameEn": "Malm Bed Frame",
    "nameAr": "هيكل سرير MALM",
    "descEn": "Malm Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MALM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 147,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-w-4-storage-boxes-black-brown-lindbaden-s89495007/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "malm-bed-frame-3-black",
        "colorId": "black",
        "image": "/images/catalog/malm-bed-frame-3/black.jpg",
        "priceOmr": 147,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-w-4-storage-boxes-black-brown-lindbaden-s89495007/"
      }
    ],
    "images": [
      "/images/catalog/malm-bed-frame-3/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 361
  },
  {
    "id": "ikea-vihals-day-bed-4",
    "slug": "vihals-day-bed-4",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "VIHALS",
    "nameEn": "Vihals Day-bed",
    "nameAr": "سرير نهاري VIHALS",
    "descEn": "Vihals Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 90,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-frame-with-trundle-bed-white-s09580537/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-day-bed-4-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-day-bed-4/white.jpg",
        "priceOmr": 90,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-frame-with-trundle-bed-white-s09580537/"
      }
    ],
    "images": [
      "/images/catalog/vihals-day-bed-4/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 362
  },
  {
    "id": "ikea-hemnes-day-bed-2",
    "slug": "hemnes-day-bed-2",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "HEMNES",
    "nameEn": "Hemnes Day-bed",
    "nameAr": "سرير نهاري HEMNES",
    "descEn": "Hemnes Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري HEMNES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 118,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hemnes-day-bed-w-3-drawers-2-mattresses-grey-green-afjaell-firm-s49610231/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "hemnes-day-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/hemnes-day-bed-2/grey.jpg",
        "gallery": [
          "/images/catalog/hemnes-day-bed-2/grey-1.jpg",
          "/images/catalog/hemnes-day-bed-2/grey-2.jpg"
        ],
        "priceOmr": 118,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hemnes-day-bed-w-3-drawers-2-mattresses-grey-green-afjaell-firm-s49610231/"
      }
    ],
    "images": [
      "/images/catalog/hemnes-day-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 363
  },
  {
    "id": "ikea-friheten-sofa-bed",
    "slug": "friheten-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "FRIHETEN",
    "nameEn": "Friheten Sofa-bed",
    "nameAr": "كنبة سرير FRIHETEN",
    "descEn": "Friheten Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير FRIHETEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 239,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-three-seat-sofa-bed-skiftebo-dark-grey-50341148/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black",
      "brown"
    ],
    "variants": [
      {
        "variantId": "friheten-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/friheten-sofa-bed/grey.jpg",
        "gallery": [
          "/images/catalog/friheten-sofa-bed/grey-1.jpg"
        ],
        "priceOmr": 239,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-three-seat-sofa-bed-skiftebo-dark-grey-50341148/"
      },
      {
        "variantId": "friheten-sofa-bed-black",
        "colorId": "black",
        "image": "/images/catalog/friheten-sofa-bed/black.jpg",
        "priceOmr": 239,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-three-seat-sofa-bed-bomstad-black-20341135/"
      },
      {
        "variantId": "friheten-sofa-bed-brown",
        "colorId": "brown",
        "image": "/images/catalog/friheten-sofa-bed/brown.jpg",
        "priceOmr": 239,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-3-seat-sofa-bed-faringe-brown-orange-90551224/"
      }
    ],
    "images": [
      "/images/catalog/friheten-sofa-bed/grey.jpg",
      "/images/catalog/friheten-sofa-bed/black.jpg",
      "/images/catalog/friheten-sofa-bed/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 364
  },
  {
    "id": "ikea-alvdalen-sofa-bed",
    "slug": "alvdalen-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "ÄLVDALEN",
    "nameEn": "äLvdalen Sofa-bed",
    "nameAr": "كنبة سرير ÄLVDALEN",
    "descEn": "äLvdalen Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير ÄLVDALEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 397,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/aelvdalen-3-seat-sofa-bed-knisa-grey-beige-50530648/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "alvdalen-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/alvdalen-sofa-bed/grey.jpg",
        "gallery": [
          "/images/catalog/alvdalen-sofa-bed/grey-1.jpg"
        ],
        "priceOmr": 397,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aelvdalen-3-seat-sofa-bed-knisa-grey-beige-50530648/"
      }
    ],
    "images": [
      "/images/catalog/alvdalen-sofa-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 365
  },
  {
    "id": "ikea-slakt-bed-frame",
    "slug": "slakt-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 110,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-with-slatted-bed-base-white-s79227755/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/slakt-bed-frame/white.jpg",
        "priceOmr": 110,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-with-slatted-bed-base-white-s79227755/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 366
  },
  {
    "id": "ikea-gullaberg-bed-frame",
    "slug": "gullaberg-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GULLABERG",
    "nameEn": "Gullaberg Bed Frame",
    "nameAr": "هيكل سرير GULLABERG",
    "descEn": "Gullaberg Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GULLABERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 200,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-grey-luroey-s89614784/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "gullaberg-bed-frame-grey",
        "colorId": "grey",
        "image": "/images/catalog/gullaberg-bed-frame/grey.jpg",
        "priceOmr": 200,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-grey-luroey-s89614784/"
      }
    ],
    "images": [
      "/images/catalog/gullaberg-bed-frame/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 367
  },
  {
    "id": "ikea-tyssedal-bed-frame",
    "slug": "tyssedal-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TYSSEDAL",
    "nameEn": "Tyssedal Bed Frame",
    "nameAr": "هيكل سرير TYSSEDAL",
    "descEn": "Tyssedal Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TYSSEDAL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 104,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tyssedal-bed-frame-white-luroey-s39057972/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "tyssedal-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/tyssedal-bed-frame/white.jpg",
        "priceOmr": 104,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tyssedal-bed-frame-white-luroey-s39057972/"
      }
    ],
    "images": [
      "/images/catalog/tyssedal-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 368
  },
  {
    "id": "ikea-vihals-bed-frame-8",
    "slug": "vihals-bed-frame-8",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 209,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-2-stor-box-1-trundle-bed-white-luroey-s59582015/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-8-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-8/white.jpg",
        "priceOmr": 209,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-2-stor-box-1-trundle-bed-white-luroey-s59582015/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-8/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 369
  },
  {
    "id": "ikea-sagesund-bed-frame",
    "slug": "sagesund-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SAGESUND",
    "nameEn": "Sagesund Bed Frame",
    "nameAr": "هيكل سرير SAGESUND",
    "descEn": "Sagesund Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SAGESUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 87,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sagesund-upholstered-bed-frame-diseroed-brown-loenset-s59496503/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "sagesund-bed-frame-brown",
        "colorId": "brown",
        "image": "/images/catalog/sagesund-bed-frame/brown.jpg",
        "priceOmr": 87,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sagesund-upholstered-bed-frame-diseroed-brown-loenset-s59496503/"
      }
    ],
    "images": [
      "/images/catalog/sagesund-bed-frame/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 370
  },
  {
    "id": "ikea-mydal-bunk-bed",
    "slug": "mydal-bunk-bed",
    "category": "beds",
    "subcategory": "bunk-bed",
    "model": "MYDAL",
    "nameEn": "Mydal Bunk Bed",
    "nameAr": "سرير بطابقين MYDAL",
    "descEn": "Mydal Bunk Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير بطابقين MYDAL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 196,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/mydal-bunk-bed-frame-white-20467629/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "mydal-bunk-bed-white",
        "colorId": "white",
        "image": "/images/catalog/mydal-bunk-bed/white.jpg",
        "priceOmr": 196,
        "sourceUrl": "https://www.ikea.com/om/ar/p/mydal-bunk-bed-frame-white-20467629/"
      }
    ],
    "images": [
      "/images/catalog/mydal-bunk-bed/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 371
  },
  {
    "id": "ikea-utaker-bed-frame",
    "slug": "utaker-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "UTÅKER",
    "nameEn": "UtåKer Bed Frame",
    "nameAr": "هيكل سرير UTÅKER",
    "descEn": "UtåKer Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير UTÅKER — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 172,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/utaker-stackable-bed-pine-00360484/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "utaker-bed-frame-natural",
        "colorId": "natural",
        "image": "/images/catalog/utaker-bed-frame/natural.jpg",
        "priceOmr": 172,
        "sourceUrl": "https://www.ikea.com/om/ar/p/utaker-stackable-bed-pine-00360484/"
      }
    ],
    "images": [
      "/images/catalog/utaker-bed-frame/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 372
  },
  {
    "id": "ikea-mojlighet-bed-frame",
    "slug": "mojlighet-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MÖJLIGHET",
    "nameEn": "MöJlighet Bed Frame",
    "nameAr": "هيكل سرير MÖJLIGHET",
    "descEn": "MöJlighet Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MÖJLIGHET — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 196,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/moejlighet-bed-pocket-beige-60600971/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 75,
      "depthCm": 27,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "mojlighet-bed-frame-beige",
        "colorId": "beige",
        "image": "/images/catalog/mojlighet-bed-frame/beige.jpg",
        "priceOmr": 196,
        "sourceUrl": "https://www.ikea.com/om/ar/p/moejlighet-bed-pocket-beige-60600971/"
      }
    ],
    "images": [
      "/images/catalog/mojlighet-bed-frame/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 373
  },
  {
    "id": "ikea-gladstad-bed-frame",
    "slug": "gladstad-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GLADSTAD",
    "nameEn": "Gladstad Bed Frame",
    "nameAr": "هيكل سرير GLADSTAD",
    "descEn": "Gladstad Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GLADSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 68,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gladstad-upholstered-bed-frame-kabusa-light-grey-10490456/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "gladstad-bed-frame-grey",
        "colorId": "grey",
        "image": "/images/catalog/gladstad-bed-frame/grey.jpg",
        "priceOmr": 68,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gladstad-upholstered-bed-frame-kabusa-light-grey-10490456/"
      }
    ],
    "images": [
      "/images/catalog/gladstad-bed-frame/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 374
  },
  {
    "id": "ikea-stora-bunk-bed",
    "slug": "stora-bunk-bed",
    "category": "beds",
    "subcategory": "bunk-bed",
    "model": "STORÅ",
    "nameEn": "Storå Bunk Bed",
    "nameAr": "سرير بطابقين STORÅ",
    "descEn": "Storå Bunk Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير بطابقين STORÅ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 128,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stora-loft-bed-frame-white-stain-70242086/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "stora-bunk-bed-white",
        "colorId": "white",
        "image": "/images/catalog/stora-bunk-bed/white.jpg",
        "priceOmr": 128,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stora-loft-bed-frame-white-stain-70242086/"
      }
    ],
    "images": [
      "/images/catalog/stora-bunk-bed/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 375
  },
  {
    "id": "ikea-nattapa-bed-frame",
    "slug": "nattapa-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "NATTAPA",
    "nameEn": "Nattapa Bed Frame",
    "nameAr": "هيكل سرير NATTAPA",
    "descEn": "Nattapa Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير NATTAPA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 214,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nattapa-guard-rail-white-50465761/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "nattapa-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/nattapa-bed-frame/white.jpg",
        "priceOmr": 214,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nattapa-guard-rail-white-50465761/"
      }
    ],
    "images": [
      "/images/catalog/nattapa-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 376
  },
  {
    "id": "ikea-idanas-bed-frame-2",
    "slug": "idanas-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "IDANÄS",
    "nameEn": "IdanäS Bed Frame",
    "nameAr": "هيكل سرير IDANÄS",
    "descEn": "IdanäS Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير IDANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 164,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-upholstered-bed-frame-gunnared-dark-grey-20458941/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "idanas-bed-frame-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/idanas-bed-frame-2/grey.jpg",
        "priceOmr": 164,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-upholstered-bed-frame-gunnared-dark-grey-20458941/"
      }
    ],
    "images": [
      "/images/catalog/idanas-bed-frame-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 377
  },
  {
    "id": "ikea-lyngor-divan-bed",
    "slug": "lyngor-divan-bed",
    "category": "beds",
    "subcategory": "divan-bed",
    "model": "LYNGÖR",
    "nameEn": "LyngöR Divan Bed",
    "nameAr": "سرير ديفان LYNGÖR",
    "descEn": "LyngöR Divan Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير ديفان LYNGÖR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 225,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-valevag-firm-light-blue-dark-grey-s99551432/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lyngor-divan-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/lyngor-divan-bed/grey.jpg",
        "gallery": [
          "/images/catalog/lyngor-divan-bed/grey-1.jpg",
          "/images/catalog/lyngor-divan-bed/grey-2.jpg"
        ],
        "priceOmr": 225,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-valevag-firm-light-blue-dark-grey-s99551432/"
      }
    ],
    "images": [
      "/images/catalog/lyngor-divan-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 378
  },
  {
    "id": "ikea-stickat-bed-frame",
    "slug": "stickat-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "STICKAT",
    "nameEn": "Stickat Bed Frame",
    "nameAr": "هيكل سرير STICKAT",
    "descEn": "Stickat Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير STICKAT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 89,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/stickat-bed-pocket-blue-10622961/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 39,
      "depthCm": 30,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "blue"
    ],
    "variants": [
      {
        "variantId": "stickat-bed-frame-blue",
        "colorId": "blue",
        "image": "/images/catalog/stickat-bed-frame/blue.jpg",
        "priceOmr": 89,
        "sourceUrl": "https://www.ikea.com/om/ar/p/stickat-bed-pocket-blue-10622961/"
      }
    ],
    "images": [
      "/images/catalog/stickat-bed-frame/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 379
  },
  {
    "id": "ikea-tonstad-bed-frame",
    "slug": "tonstad-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TONSTAD",
    "nameEn": "Tonstad Bed Frame",
    "nameAr": "هيكل سرير TONSTAD",
    "descEn": "Tonstad Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TONSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 228,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-bed-frame-with-storage-off-white-luroey-s29496585/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "tonstad-bed-frame-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/tonstad-bed-frame/ivory.jpg",
        "priceOmr": 228,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tonstad-bed-frame-with-storage-off-white-luroey-s29496585/"
      }
    ],
    "images": [
      "/images/catalog/tonstad-bed-frame/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 380
  },
  {
    "id": "ikea-idanas-bed-frame-3",
    "slug": "idanas-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "IDANÄS",
    "nameEn": "IdanäS Bed Frame",
    "nameAr": "هيكل سرير IDANÄS",
    "descEn": "IdanäS Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير IDANÄS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 94,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-upholstered-storage-bed-gunnared-dark-grey-90447176/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "idanas-bed-frame-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/idanas-bed-frame-3/grey.jpg",
        "priceOmr": 94,
        "sourceUrl": "https://www.ikea.com/om/ar/p/idanaes-upholstered-storage-bed-gunnared-dark-grey-90447176/"
      }
    ],
    "images": [
      "/images/catalog/idanas-bed-frame-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 381
  },
  {
    "id": "ikea-friheten-sofa-bed-2",
    "slug": "friheten-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "FRIHETEN",
    "nameEn": "Friheten Sofa-bed",
    "nameAr": "كنبة سرير FRIHETEN",
    "descEn": "Friheten Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير FRIHETEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 196,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey-s39216754/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "black",
      "brown"
    ],
    "variants": [
      {
        "variantId": "friheten-sofa-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/friheten-sofa-bed-2/grey.jpg",
        "gallery": [
          "/images/catalog/friheten-sofa-bed-2/grey-1.jpg"
        ],
        "priceOmr": 196,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey-s39216754/"
      },
      {
        "variantId": "friheten-sofa-bed-2-black",
        "colorId": "black",
        "image": "/images/catalog/friheten-sofa-bed-2/black.jpg",
        "priceOmr": 196,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-corner-sofa-bed-with-storage-bomstad-black-s69216818/"
      },
      {
        "variantId": "friheten-sofa-bed-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/friheten-sofa-bed-2/brown.jpg",
        "priceOmr": 196,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-corner-sofa-bed-with-storage-faringe-brown-orange-s19517041/"
      }
    ],
    "images": [
      "/images/catalog/friheten-sofa-bed-2/grey.jpg",
      "/images/catalog/friheten-sofa-bed-2/black.jpg",
      "/images/catalog/friheten-sofa-bed-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 382
  },
  {
    "id": "ikea-slakt-bed-frame-2",
    "slug": "slakt-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-underbed-with-storage-white-s99239451/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-2-white",
        "colorId": "white",
        "image": "/images/catalog/slakt-bed-frame-2/white.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-underbed-with-storage-white-s99239451/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 383
  },
  {
    "id": "ikea-tarnkullen-bed-frame-2",
    "slug": "tarnkullen-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TÄRNKULLEN",
    "nameEn": "TäRnkullen Bed Frame",
    "nameAr": "هيكل سرير TÄRNKULLEN",
    "descEn": "TäRnkullen Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TÄRNKULLEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 263,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-vissle-beige-luroey-s69564365/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tarnkullen-bed-frame-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/tarnkullen-bed-frame-2/beige.jpg",
        "priceOmr": 263,
        "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-vissle-beige-luroey-s69564365/"
      }
    ],
    "images": [
      "/images/catalog/tarnkullen-bed-frame-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 384
  },
  {
    "id": "ikea-sniglar-bed-frame",
    "slug": "sniglar-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SNIGLAR",
    "nameEn": "Sniglar Bed Frame",
    "nameAr": "هيكل سرير SNIGLAR",
    "descEn": "Sniglar Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SNIGLAR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 136,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sniglar-bed-frame-with-slatted-bed-base-beech-s19185433/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 70,
      "depthCm": 160,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "sniglar-bed-frame-natural",
        "colorId": "natural",
        "image": "/images/catalog/sniglar-bed-frame/natural.jpg",
        "priceOmr": 136,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sniglar-bed-frame-with-slatted-bed-base-beech-s19185433/"
      }
    ],
    "images": [
      "/images/catalog/sniglar-bed-frame/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 385
  },
  {
    "id": "ikea-lyngor-divan-bed-2",
    "slug": "lyngor-divan-bed-2",
    "category": "beds",
    "subcategory": "divan-bed",
    "model": "LYNGÖR",
    "nameEn": "LyngöR Divan Bed",
    "nameAr": "سرير ديفان LYNGÖR",
    "descEn": "LyngöR Divan Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير ديفان LYNGÖR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 291,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-vesteroey-firm-light-blue-dark-grey-s69608595/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lyngor-divan-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/lyngor-divan-bed-2/grey.jpg",
        "gallery": [
          "/images/catalog/lyngor-divan-bed-2/grey-1.jpg",
          "/images/catalog/lyngor-divan-bed-2/grey-2.jpg"
        ],
        "priceOmr": 291,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-vesteroey-firm-light-blue-dark-grey-s69608595/"
      }
    ],
    "images": [
      "/images/catalog/lyngor-divan-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 386
  },
  {
    "id": "ikea-vihals-day-bed-5",
    "slug": "vihals-day-bed-5",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "VIHALS",
    "nameEn": "Vihals Day-bed",
    "nameAr": "سرير نهاري VIHALS",
    "descEn": "Vihals Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 186,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-with-1-mattress-white-afjaell-firm-s79580553/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-day-bed-5-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-day-bed-5/white.jpg",
        "gallery": [
          "/images/catalog/vihals-day-bed-5/white-1.jpg",
          "/images/catalog/vihals-day-bed-5/white-2.jpg",
          "/images/catalog/vihals-day-bed-5/white-3.jpg"
        ],
        "priceOmr": 186,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-with-1-mattress-white-afjaell-firm-s79580553/"
      }
    ],
    "images": [
      "/images/catalog/vihals-day-bed-5/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 387
  },
  {
    "id": "ikea-lyngor-divan-bed-3",
    "slug": "lyngor-divan-bed-3",
    "category": "beds",
    "subcategory": "divan-bed",
    "model": "LYNGÖR",
    "nameEn": "LyngöR Divan Bed",
    "nameAr": "سرير ديفان LYNGÖR",
    "descEn": "LyngöR Divan Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير ديفان LYNGÖR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 294,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-vagstranda-firm-light-blue-dark-grey-s69615143/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lyngor-divan-bed-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/lyngor-divan-bed-3/grey.jpg",
        "gallery": [
          "/images/catalog/lyngor-divan-bed-3/grey-1.jpg",
          "/images/catalog/lyngor-divan-bed-3/grey-2.jpg"
        ],
        "priceOmr": 294,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-vagstranda-firm-light-blue-dark-grey-s69615143/"
      }
    ],
    "images": [
      "/images/catalog/lyngor-divan-bed-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 388
  },
  {
    "id": "ikea-slattum-bed-frame-2",
    "slug": "slattum-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLATTUM",
    "nameEn": "Slattum Bed Frame",
    "nameAr": "هيكل سرير SLATTUM",
    "descEn": "Slattum Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLATTUM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 265,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slattum-upholstered-bed-frame-vissle-dark-grey-incl-slipcover-for-headboard-oereryd-grey-beige-s89613478/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "slattum-bed-frame-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/slattum-bed-frame-2/grey.jpg",
        "priceOmr": 265,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slattum-upholstered-bed-frame-vissle-dark-grey-incl-slipcover-for-headboard-oereryd-grey-beige-s89613478/"
      }
    ],
    "images": [
      "/images/catalog/slattum-bed-frame-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 389
  },
  {
    "id": "ikea-vihals-day-bed-6",
    "slug": "vihals-day-bed-6",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "VIHALS",
    "nameEn": "Vihals Day-bed",
    "nameAr": "سرير نهاري VIHALS",
    "descEn": "Vihals Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 158,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-frame-with-storage-white-s89571586/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-day-bed-6-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-day-bed-6/white.jpg",
        "priceOmr": 158,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-day-bed-frame-with-storage-white-s89571586/"
      }
    ],
    "images": [
      "/images/catalog/vihals-day-bed-6/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 390
  },
  {
    "id": "ikea-kura-bed-frame",
    "slug": "kura-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "KURA",
    "nameEn": "Kura Bed Frame",
    "nameAr": "هيكل سرير KURA",
    "descEn": "Kura Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير KURA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 197,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kura-reversible-bed-white-pine-80253809/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "kura-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/kura-bed-frame/white.jpg",
        "priceOmr": 197,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kura-reversible-bed-white-pine-80253809/"
      }
    ],
    "images": [
      "/images/catalog/kura-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 391
  },
  {
    "id": "ikea-nordli-bed-frame",
    "slug": "nordli-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "NORDLI",
    "nameEn": "Nordli Bed Frame",
    "nameAr": "هيكل سرير NORDLI",
    "descEn": "Nordli Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير NORDLI — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 124,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nordli-bed-frame-with-storage-white-00349849/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "nordli-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/nordli-bed-frame/white.jpg",
        "priceOmr": 124,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nordli-bed-frame-with-storage-white-00349849/"
      }
    ],
    "images": [
      "/images/catalog/nordli-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 392
  },
  {
    "id": "ikea-utaker-mattress",
    "slug": "utaker-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "UTÅKER",
    "nameEn": "UtåKer Mattress",
    "nameAr": "مرتبة UTÅKER",
    "descEn": "UtåKer Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة UTÅKER — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 112,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/utaker-stackable-bed-with-2-mattresses-pine-vannareid-extra-firm-s69423865/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "utaker-mattress-natural",
        "colorId": "natural",
        "image": "/images/catalog/utaker-mattress/natural.jpg",
        "gallery": [
          "/images/catalog/utaker-mattress/natural-1.jpg",
          "/images/catalog/utaker-mattress/natural-2.jpg",
          "/images/catalog/utaker-mattress/natural-3.jpg"
        ],
        "priceOmr": 112,
        "sourceUrl": "https://www.ikea.com/om/ar/p/utaker-stackable-bed-with-2-mattresses-pine-vannareid-extra-firm-s69423865/"
      }
    ],
    "images": [
      "/images/catalog/utaker-mattress/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 393
  },
  {
    "id": "ikea-slakt-bed-frame-3",
    "slug": "slakt-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 141,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-headboard-with-cover-vissle-beige-20594095/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-3-beige",
        "colorId": "beige",
        "image": "/images/catalog/slakt-bed-frame-3/beige.jpg",
        "priceOmr": 141,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-headboard-with-cover-vissle-beige-20594095/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-3/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 394
  },
  {
    "id": "ikea-malm-bed-frame-4",
    "slug": "malm-bed-frame-4",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MALM",
    "nameEn": "Malm Bed Frame",
    "nameAr": "هيكل سرير MALM",
    "descEn": "Malm Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MALM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 65,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malm-ottoman-bed-black-brown-70404804/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "malm-bed-frame-4-black",
        "colorId": "black",
        "image": "/images/catalog/malm-bed-frame-4/black.jpg",
        "priceOmr": 65,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malm-ottoman-bed-black-brown-70404804/"
      }
    ],
    "images": [
      "/images/catalog/malm-bed-frame-4/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 395
  },
  {
    "id": "ikea-gullaberg-bed-frame-2",
    "slug": "gullaberg-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GULLABERG",
    "nameEn": "Gullaberg Bed Frame",
    "nameAr": "هيكل سرير GULLABERG",
    "descEn": "Gullaberg Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GULLABERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 179,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-with-4-storage-boxes-grey-lindbaden-s69614855/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "gullaberg-bed-frame-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/gullaberg-bed-frame-2/grey.jpg",
        "priceOmr": 179,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-with-4-storage-boxes-grey-lindbaden-s69614855/"
      }
    ],
    "images": [
      "/images/catalog/gullaberg-bed-frame-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 396
  },
  {
    "id": "ikea-lyngor-mattress-base",
    "slug": "lyngor-mattress-base",
    "category": "beds",
    "subcategory": "mattress-base",
    "model": "LYNGÖR",
    "nameEn": "LyngöR Mattress Base",
    "nameAr": "قاعدة مرتبة LYNGÖR",
    "descEn": "LyngöR Mattress Base — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "قاعدة مرتبة LYNGÖR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 72,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-slatted-mattress-base-with-legs-dark-grey-s19554458/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lyngor-mattress-base-grey",
        "colorId": "grey",
        "image": "/images/catalog/lyngor-mattress-base/grey.jpg",
        "gallery": [
          "/images/catalog/lyngor-mattress-base/grey-1.jpg",
          "/images/catalog/lyngor-mattress-base/grey-2.jpg"
        ],
        "priceOmr": 72,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-slatted-mattress-base-with-legs-dark-grey-s19554458/"
      }
    ],
    "images": [
      "/images/catalog/lyngor-mattress-base/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 397
  },
  {
    "id": "ikea-tornsborg-sofa-bed-2",
    "slug": "tornsborg-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "TORNSBORG",
    "nameEn": "Tornsborg Sofa-bed",
    "nameAr": "كنبة سرير TORNSBORG",
    "descEn": "Tornsborg Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير TORNSBORG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 219,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-2-seat-sofa-bed-naggen-beige-pine-90584658/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tornsborg-sofa-bed-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/tornsborg-sofa-bed-2/beige.jpg",
        "priceOmr": 219,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-2-seat-sofa-bed-naggen-beige-pine-90584658/"
      }
    ],
    "images": [
      "/images/catalog/tornsborg-sofa-bed-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 398
  },
  {
    "id": "ikea-ikea-ps-2026-bed-frame-2",
    "slug": "ikea-ps-2026-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "IKEA PS 2026",
    "nameEn": "Ikea Ps 2026 Bed Frame",
    "nameAr": "هيكل سرير IKEA PS 2026",
    "descEn": "Ikea Ps 2026 Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "هيكل سرير IKEA PS 2026 — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 258,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bed-skiftebo-bright-orange-60620375/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "orange",
      "grey"
    ],
    "variants": [
      {
        "variantId": "ikea-ps-2026-bed-frame-2-orange",
        "colorId": "orange",
        "image": "/images/catalog/ikea-ps-2026-bed-frame-2/orange.jpg",
        "priceOmr": 258,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bed-skiftebo-bright-orange-60620375/"
      },
      {
        "variantId": "ikea-ps-2026-bed-frame-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/ikea-ps-2026-bed-frame-2/grey.jpg",
        "priceOmr": 258,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ikea-ps-2026-chair-bed-skiftebo-light-grey-beige-00620359/"
      }
    ],
    "images": [
      "/images/catalog/ikea-ps-2026-bed-frame-2/orange.jpg",
      "/images/catalog/ikea-ps-2026-bed-frame-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 399
  },
  {
    "id": "ikea-slakt-bed-frame-4",
    "slug": "slakt-bed-frame-4",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 65,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-with-underbed-and-storage-white-s89227731/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-4-white",
        "colorId": "white",
        "image": "/images/catalog/slakt-bed-frame-4/white.jpg",
        "priceOmr": 65,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-with-underbed-and-storage-white-s89227731/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-4/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 400
  },
  {
    "id": "ikea-vihals-bed-frame-9",
    "slug": "vihals-bed-frame-9",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 244,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-trundle-bed-white-60595111/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-9-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-9/white.jpg",
        "priceOmr": 244,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-trundle-bed-white-60595111/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-9/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 401
  },
  {
    "id": "ikea-lyngor-divan-bed-4",
    "slug": "lyngor-divan-bed-4",
    "category": "beds",
    "subcategory": "divan-bed",
    "model": "LYNGÖR",
    "nameEn": "LyngöR Divan Bed",
    "nameAr": "سرير ديفان LYNGÖR",
    "descEn": "LyngöR Divan Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير ديفان LYNGÖR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 285,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-valevag-extra-firm-light-blue-dark-grey-s09551479/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lyngor-divan-bed-4-grey",
        "colorId": "grey",
        "image": "/images/catalog/lyngor-divan-bed-4/grey.jpg",
        "gallery": [
          "/images/catalog/lyngor-divan-bed-4/grey-1.jpg",
          "/images/catalog/lyngor-divan-bed-4/grey-2.jpg"
        ],
        "priceOmr": 285,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-valevag-extra-firm-light-blue-dark-grey-s09551479/"
      }
    ],
    "images": [
      "/images/catalog/lyngor-divan-bed-4/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 402
  },
  {
    "id": "ikea-nyhamn-sofa-bed",
    "slug": "nyhamn-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "NYHAMN",
    "nameEn": "Nyhamn Sofa-bed",
    "nameAr": "كنبة سرير NYHAMN",
    "descEn": "Nyhamn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير NYHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 501,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-3-seat-sofa-bed-with-pocket-spring-mattress-knisa-grey-beige-s89306361/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "nyhamn-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/nyhamn-sofa-bed/grey.jpg",
        "priceOmr": 501,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-3-seat-sofa-bed-with-pocket-spring-mattress-knisa-grey-beige-s89306361/"
      }
    ],
    "images": [
      "/images/catalog/nyhamn-sofa-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 403
  },
  {
    "id": "ikea-ramsta-day-bed",
    "slug": "ramsta-day-bed",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "RAMSTA",
    "nameEn": "Ramsta Day-bed",
    "nameAr": "سرير نهاري RAMSTA",
    "descEn": "Ramsta Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري RAMSTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 138,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ramsta-day-bed-frame-with-slatted-bed-base-white-s29179554/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "ramsta-day-bed-white",
        "colorId": "white",
        "image": "/images/catalog/ramsta-day-bed/white.jpg",
        "priceOmr": 138,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ramsta-day-bed-frame-with-slatted-bed-base-white-s29179554/"
      }
    ],
    "images": [
      "/images/catalog/ramsta-day-bed/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 404
  },
  {
    "id": "ikea-gullaberg-bed-frame-3",
    "slug": "gullaberg-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GULLABERG",
    "nameEn": "Gullaberg Bed Frame",
    "nameAr": "هيكل سرير GULLABERG",
    "descEn": "Gullaberg Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GULLABERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 257,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-with-2-storage-boxes-grey-loenset-s99614825/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "gullaberg-bed-frame-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/gullaberg-bed-frame-3/grey.jpg",
        "priceOmr": 257,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-with-2-storage-boxes-grey-loenset-s99614825/"
      }
    ],
    "images": [
      "/images/catalog/gullaberg-bed-frame-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 405
  },
  {
    "id": "ikea-tuffing-bunk-bed",
    "slug": "tuffing-bunk-bed",
    "category": "beds",
    "subcategory": "bunk-bed",
    "model": "TUFFING",
    "nameEn": "Tuffing Bunk Bed",
    "nameAr": "سرير بطابقين TUFFING",
    "descEn": "Tuffing Bunk Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير بطابقين TUFFING — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 196,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tuffing-loft-bed-frame-dark-grey-90299449/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "tuffing-bunk-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/tuffing-bunk-bed/grey.jpg",
        "priceOmr": 196,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tuffing-loft-bed-frame-dark-grey-90299449/"
      }
    ],
    "images": [
      "/images/catalog/tuffing-bunk-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 406
  },
  {
    "id": "ikea-smagora-bed-frame",
    "slug": "smagora-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SMÅGÖRA",
    "nameEn": "SmåGöRa Bed Frame",
    "nameAr": "هيكل سرير SMÅGÖRA",
    "descEn": "SmåGöRa Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SMÅGÖRA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 92,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/smagoera-cot-white-50461230/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "smagora-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/smagora-bed-frame/white.jpg",
        "priceOmr": 92,
        "sourceUrl": "https://www.ikea.com/om/ar/p/smagoera-cot-white-50461230/"
      }
    ],
    "images": [
      "/images/catalog/smagora-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 407
  },
  {
    "id": "ikea-gulliver-bed-frame",
    "slug": "gulliver-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GULLIVER",
    "nameEn": "Gulliver Bed Frame",
    "nameAr": "هيكل سرير GULLIVER",
    "descEn": "Gulliver Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GULLIVER — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 142,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gulliver-cot-white-10248519/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "gulliver-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/gulliver-bed-frame/white.jpg",
        "priceOmr": 142,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gulliver-cot-white-10248519/"
      }
    ],
    "images": [
      "/images/catalog/gulliver-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 408
  },
  {
    "id": "ikea-mydal-bunk-bed-2",
    "slug": "mydal-bunk-bed-2",
    "category": "beds",
    "subcategory": "bunk-bed",
    "model": "MYDAL",
    "nameEn": "Mydal Bunk Bed",
    "nameAr": "سرير بطابقين MYDAL",
    "descEn": "Mydal Bunk Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير بطابقين MYDAL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 244,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/mydal-bunk-bed-frame-pine-00102452/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "mydal-bunk-bed-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/mydal-bunk-bed-2/natural.jpg",
        "priceOmr": 244,
        "sourceUrl": "https://www.ikea.com/om/ar/p/mydal-bunk-bed-frame-pine-00102452/"
      }
    ],
    "images": [
      "/images/catalog/mydal-bunk-bed-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 409
  },
  {
    "id": "ikea-vitval-bunk-bed",
    "slug": "vitval-bunk-bed",
    "category": "beds",
    "subcategory": "bunk-bed",
    "model": "VITVAL",
    "nameEn": "Vitval Bunk Bed",
    "nameAr": "سرير بطابقين VITVAL",
    "descEn": "Vitval Bunk Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير بطابقين VITVAL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 234,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vitval-bunk-bed-frame-white-light-grey-80411272/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vitval-bunk-bed-white",
        "colorId": "white",
        "image": "/images/catalog/vitval-bunk-bed/white.jpg",
        "priceOmr": 234,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vitval-bunk-bed-frame-white-light-grey-80411272/"
      }
    ],
    "images": [
      "/images/catalog/vitval-bunk-bed/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 410
  },
  {
    "id": "ikea-sniglar-bed-frame-2",
    "slug": "sniglar-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SNIGLAR",
    "nameEn": "Sniglar Bed Frame",
    "nameAr": "هيكل سرير SNIGLAR",
    "descEn": "Sniglar Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SNIGLAR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 94,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sniglar-cot-beech-30248537/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "sniglar-bed-frame-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/sniglar-bed-frame-2/natural.jpg",
        "priceOmr": 94,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sniglar-cot-beech-30248537/"
      }
    ],
    "images": [
      "/images/catalog/sniglar-bed-frame-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 411
  },
  {
    "id": "ikea-lyngor-divan-bed-5",
    "slug": "lyngor-divan-bed-5",
    "category": "beds",
    "subcategory": "divan-bed",
    "model": "LYNGÖR",
    "nameEn": "LyngöR Divan Bed",
    "nameAr": "سرير ديفان LYNGÖR",
    "descEn": "LyngöR Divan Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير ديفان LYNGÖR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 287,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-valevag-firm-extra-firm-light-blue-dark-grey-s79610908/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lyngor-divan-bed-5-grey",
        "colorId": "grey",
        "image": "/images/catalog/lyngor-divan-bed-5/grey.jpg",
        "gallery": [
          "/images/catalog/lyngor-divan-bed-5/grey-1.jpg",
          "/images/catalog/lyngor-divan-bed-5/grey-2.jpg"
        ],
        "priceOmr": 287,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lyngoer-divan-bed-valevag-firm-extra-firm-light-blue-dark-grey-s79610908/"
      }
    ],
    "images": [
      "/images/catalog/lyngor-divan-bed-5/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 412
  },
  {
    "id": "ikea-tuffing-bunk-bed-2",
    "slug": "tuffing-bunk-bed-2",
    "category": "beds",
    "subcategory": "bunk-bed",
    "model": "TUFFING",
    "nameEn": "Tuffing Bunk Bed",
    "nameAr": "سرير بطابقين TUFFING",
    "descEn": "Tuffing Bunk Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير بطابقين TUFFING — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 90,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tuffing-bunk-bed-frame-dark-grey-00239233/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "tuffing-bunk-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/tuffing-bunk-bed-2/grey.jpg",
        "priceOmr": 90,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tuffing-bunk-bed-frame-dark-grey-00239233/"
      }
    ],
    "images": [
      "/images/catalog/tuffing-bunk-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 413
  },
  {
    "id": "ikea-gulliver-bed-frame-2",
    "slug": "gulliver-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GULLIVER",
    "nameEn": "Gulliver Bed Frame",
    "nameAr": "هيكل سرير GULLIVER",
    "descEn": "Gulliver Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GULLIVER — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 82,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gulliver-cot-green-20589503/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "gulliver-bed-frame-2-green",
        "colorId": "green",
        "image": "/images/catalog/gulliver-bed-frame-2/green.jpg",
        "priceOmr": 82,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gulliver-cot-green-20589503/"
      }
    ],
    "images": [
      "/images/catalog/gulliver-bed-frame-2/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 414
  },
  {
    "id": "ikea-grunnarp-sofa-bed",
    "slug": "grunnarp-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "GRUNNARP",
    "nameEn": "Grunnarp Sofa-bed",
    "nameAr": "كنبة سرير GRUNNARP",
    "descEn": "Grunnarp Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير GRUNNARP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 626,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/grunnarp-3-seat-sofa-bed-gunnared-medium-grey-00583385/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige",
      "brown"
    ],
    "variants": [
      {
        "variantId": "grunnarp-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/grunnarp-sofa-bed/grey.jpg",
        "priceOmr": 626,
        "sourceUrl": "https://www.ikea.com/om/ar/p/grunnarp-3-seat-sofa-bed-gunnared-medium-grey-00583385/"
      },
      {
        "variantId": "grunnarp-sofa-bed-beige",
        "colorId": "beige",
        "image": "/images/catalog/grunnarp-sofa-bed/beige.jpg",
        "priceOmr": 626,
        "sourceUrl": "https://www.ikea.com/om/ar/p/grunnarp-3-seat-sofa-bed-gunnared-beige-30583384/"
      },
      {
        "variantId": "grunnarp-sofa-bed-brown",
        "colorId": "brown",
        "image": "/images/catalog/grunnarp-sofa-bed/brown.jpg",
        "priceOmr": 626,
        "sourceUrl": "https://www.ikea.com/om/ar/p/grunnarp-3-seat-sofa-bed-gunnared-light-brown-pink-50583397/"
      }
    ],
    "images": [
      "/images/catalog/grunnarp-sofa-bed/grey.jpg",
      "/images/catalog/grunnarp-sofa-bed/beige.jpg",
      "/images/catalog/grunnarp-sofa-bed/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 415
  },
  {
    "id": "ikea-nyhamn-mattress",
    "slug": "nyhamn-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "NYHAMN",
    "nameEn": "Nyhamn Mattress",
    "nameAr": "مرتبة NYHAMN",
    "descEn": "Nyhamn Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة NYHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 122,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-pocket-sprung-mattress-20535888/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "nyhamn-mattress-natural",
        "colorId": "natural",
        "image": "/images/catalog/nyhamn-mattress/natural.jpg",
        "priceOmr": 122,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-pocket-sprung-mattress-20535888/"
      }
    ],
    "images": [
      "/images/catalog/nyhamn-mattress/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 416
  },
  {
    "id": "ikea-eldfluga-bed-frame",
    "slug": "eldfluga-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "ELDFLUGA",
    "nameEn": "Eldfluga Bed Frame",
    "nameAr": "هيكل سرير ELDFLUGA",
    "descEn": "Eldfluga Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير ELDFLUGA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 226,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/eldfluga-bed-tent-blue-green-10542115/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "blue"
    ],
    "variants": [
      {
        "variantId": "eldfluga-bed-frame-blue",
        "colorId": "blue",
        "image": "/images/catalog/eldfluga-bed-frame/blue.jpg",
        "priceOmr": 226,
        "sourceUrl": "https://www.ikea.com/om/ar/p/eldfluga-bed-tent-blue-green-10542115/"
      }
    ],
    "images": [
      "/images/catalog/eldfluga-bed-frame/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 417
  },
  {
    "id": "ikea-sniglar-bed-frame-3",
    "slug": "sniglar-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SNIGLAR",
    "nameEn": "Sniglar Bed Frame",
    "nameAr": "هيكل سرير SNIGLAR",
    "descEn": "Sniglar Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SNIGLAR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 232,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sniglar-2-piece-baby-furniture-set-beech-s99506576/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "sniglar-bed-frame-3-natural",
        "colorId": "natural",
        "image": "/images/catalog/sniglar-bed-frame-3/natural.jpg",
        "priceOmr": 232,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sniglar-2-piece-baby-furniture-set-beech-s99506576/"
      }
    ],
    "images": [
      "/images/catalog/sniglar-bed-frame-3/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 418
  },
  {
    "id": "ikea-friheten-klagshamn-sofa-bed",
    "slug": "friheten-klagshamn-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "FRIHETEN / KLAGSHAMN",
    "nameEn": "Friheten / Klagshamn Sofa-bed",
    "nameAr": "كنبة سرير FRIHETEN / KLAGSHAMN",
    "descEn": "Friheten / Klagshamn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير FRIHETEN / KLAGSHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 396,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-klagshamn-corner-sofa-bed-with-storage-skiftebo-dark-grey-s69444330/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "brown"
    ],
    "variants": [
      {
        "variantId": "friheten-klagshamn-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/friheten-klagshamn-sofa-bed/grey.jpg",
        "gallery": [
          "/images/catalog/friheten-klagshamn-sofa-bed/grey-1.jpg"
        ],
        "priceOmr": 396,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-klagshamn-corner-sofa-bed-with-storage-skiftebo-dark-grey-s69444330/"
      },
      {
        "variantId": "friheten-klagshamn-sofa-bed-brown",
        "colorId": "brown",
        "image": "/images/catalog/friheten-klagshamn-sofa-bed/brown.jpg",
        "priceOmr": 396,
        "sourceUrl": "https://www.ikea.com/om/ar/p/friheten-klagshamn-corner-sofa-bed-with-storage-faringe-brown-orange-s29520241/"
      }
    ],
    "images": [
      "/images/catalog/friheten-klagshamn-sofa-bed/grey.jpg",
      "/images/catalog/friheten-klagshamn-sofa-bed/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 419
  },
  {
    "id": "ikea-kura-bed-frame-2",
    "slug": "kura-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "KURA",
    "nameEn": "Kura Bed Frame",
    "nameAr": "هيكل سرير KURA",
    "descEn": "Kura Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير KURA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 183,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kura-bed-accessory-yellow-grey-00618144/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "kura-bed-frame-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/kura-bed-frame-2/grey.jpg",
        "priceOmr": 183,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kura-bed-accessory-yellow-grey-00618144/"
      }
    ],
    "images": [
      "/images/catalog/kura-bed-frame-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 420
  },
  {
    "id": "ikea-klagshamn-mattress",
    "slug": "klagshamn-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "KLAGSHAMN",
    "nameEn": "Klagshamn Mattress",
    "nameAr": "مرتبة KLAGSHAMN",
    "descEn": "Klagshamn Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة KLAGSHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 48,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/klagshamn-mattress-pad-30513541/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "klagshamn-mattress-natural",
        "colorId": "natural",
        "image": "/images/catalog/klagshamn-mattress/natural.jpg",
        "priceOmr": 48,
        "sourceUrl": "https://www.ikea.com/om/ar/p/klagshamn-mattress-pad-30513541/"
      }
    ],
    "images": [
      "/images/catalog/klagshamn-mattress/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 421
  },
  {
    "id": "ikea-nyhamn-sofa-bed-2",
    "slug": "nyhamn-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "NYHAMN",
    "nameEn": "Nyhamn Sofa-bed",
    "nameAr": "كنبة سرير NYHAMN",
    "descEn": "Nyhamn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير NYHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 462,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-3-seat-sofa-bed-with-foam-mattress-skartofta-black-light-grey-s99499991/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black",
      "grey"
    ],
    "variants": [
      {
        "variantId": "nyhamn-sofa-bed-2-black",
        "colorId": "black",
        "image": "/images/catalog/nyhamn-sofa-bed-2/black.jpg",
        "gallery": [
          "/images/catalog/nyhamn-sofa-bed-2/black-1.jpg"
        ],
        "priceOmr": 462,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-3-seat-sofa-bed-with-foam-mattress-skartofta-black-light-grey-s99499991/"
      },
      {
        "variantId": "nyhamn-sofa-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/nyhamn-sofa-bed-2/grey.jpg",
        "priceOmr": 462,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-3-seat-sofa-bed-with-foam-mattress-knisa-grey-beige-s39306368/"
      }
    ],
    "images": [
      "/images/catalog/nyhamn-sofa-bed-2/black.jpg",
      "/images/catalog/nyhamn-sofa-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 422
  },
  {
    "id": "ikea-nyhamn-mattress-2",
    "slug": "nyhamn-mattress-2",
    "category": "beds",
    "subcategory": "mattress",
    "model": "NYHAMN",
    "nameEn": "Nyhamn Mattress",
    "nameAr": "مرتبة NYHAMN",
    "descEn": "Nyhamn Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة NYHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 75,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-foam-mattress-firm-50340163/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "nyhamn-mattress-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/nyhamn-mattress-2/natural.jpg",
        "priceOmr": 75,
        "sourceUrl": "https://www.ikea.com/om/ar/p/nyhamn-foam-mattress-firm-50340163/"
      }
    ],
    "images": [
      "/images/catalog/nyhamn-mattress-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 423
  },
  {
    "id": "ikea-alvdalen-sofa-bed-2",
    "slug": "alvdalen-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "ÄLVDALEN",
    "nameEn": "äLvdalen Sofa-bed",
    "nameAr": "كنبة سرير ÄLVDALEN",
    "descEn": "äLvdalen Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير ÄLVDALEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 269,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/aelvdalen-3-seat-sofa-bed-with-chaise-longue-knisa-grey-beige-10530669/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "alvdalen-sofa-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/alvdalen-sofa-bed-2/grey.jpg",
        "gallery": [
          "/images/catalog/alvdalen-sofa-bed-2/grey-1.jpg"
        ],
        "priceOmr": 269,
        "sourceUrl": "https://www.ikea.com/om/ar/p/aelvdalen-3-seat-sofa-bed-with-chaise-longue-knisa-grey-beige-10530669/"
      }
    ],
    "images": [
      "/images/catalog/alvdalen-sofa-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 424
  },
  {
    "id": "ikea-slakt-nattapa-bed-frame",
    "slug": "slakt-nattapa-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT / NATTAPA",
    "nameEn": "SläKt / Nattapa Bed Frame",
    "nameAr": "هيكل سرير SLÄKT / NATTAPA",
    "descEn": "SläKt / Nattapa Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT / NATTAPA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 69,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-nattapa-bed-frame-w-guard-rail-slat-bd-base-white-s69563889/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "slakt-nattapa-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/slakt-nattapa-bed-frame/white.jpg",
        "priceOmr": 69,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-nattapa-bed-frame-w-guard-rail-slat-bd-base-white-s69563889/"
      }
    ],
    "images": [
      "/images/catalog/slakt-nattapa-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 425
  },
  {
    "id": "ikea-lova-bed-frame",
    "slug": "lova-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "LÖVA",
    "nameEn": "LöVa Bed Frame",
    "nameAr": "هيكل سرير LÖVA",
    "descEn": "LöVa Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير LÖVA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 214,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/loeva-bed-canopy-leaf-green-80542126/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "green"
    ],
    "variants": [
      {
        "variantId": "lova-bed-frame-green",
        "colorId": "green",
        "image": "/images/catalog/lova-bed-frame/green.jpg",
        "priceOmr": 214,
        "sourceUrl": "https://www.ikea.com/om/ar/p/loeva-bed-canopy-leaf-green-80542126/"
      }
    ],
    "images": [
      "/images/catalog/lova-bed-frame/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 426
  },
  {
    "id": "ikea-kura-bed-frame-3",
    "slug": "kura-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "KURA",
    "nameEn": "Kura Bed Frame",
    "nameAr": "هيكل سرير KURA",
    "descEn": "Kura Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير KURA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 261,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kura-bed-curtain-multicolour-animals-on-the-savannah-90603223/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "kura-bed-frame-3-natural",
        "colorId": "natural",
        "image": "/images/catalog/kura-bed-frame-3/natural.jpg",
        "priceOmr": 261,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kura-bed-curtain-multicolour-animals-on-the-savannah-90603223/"
      }
    ],
    "images": [
      "/images/catalog/kura-bed-frame-3/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 427
  },
  {
    "id": "ikea-slakt-bed-frame-5",
    "slug": "slakt-bed-frame-5",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 155,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-headboard-white-50456417/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-5-white",
        "colorId": "white",
        "image": "/images/catalog/slakt-bed-frame-5/white.jpg",
        "priceOmr": 155,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-headboard-white-50456417/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-5/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 428
  },
  {
    "id": "ikea-vitval-desk",
    "slug": "vitval-desk",
    "category": "desks",
    "model": "VITVAL",
    "nameEn": "Vitval Desk",
    "nameAr": "مكتب VITVAL",
    "descEn": "Vitval Desk — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مكتب VITVAL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 91,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vitval-desk-top-white-40411410/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "office"
    ],
    "dimensions": {
      "widthCm": 95,
      "depthCm": 45,
      "heightCm": 74
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vitval-desk-white",
        "colorId": "white",
        "image": "/images/catalog/vitval-desk/white.jpg",
        "priceOmr": 91,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vitval-desk-top-white-40411410/"
      }
    ],
    "images": [
      "/images/catalog/vitval-desk/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 429
  },
  {
    "id": "ikea-myllra-bed-frame",
    "slug": "myllra-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MYLLRA",
    "nameEn": "Myllra Bed Frame",
    "nameAr": "هيكل سرير MYLLRA",
    "descEn": "Myllra Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MYLLRA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 76,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/myllra-cot-with-drawer-beige-40597045/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "myllra-bed-frame-beige",
        "colorId": "beige",
        "image": "/images/catalog/myllra-bed-frame/beige.jpg",
        "priceOmr": 76,
        "sourceUrl": "https://www.ikea.com/om/ar/p/myllra-cot-with-drawer-beige-40597045/"
      }
    ],
    "images": [
      "/images/catalog/myllra-bed-frame/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 430
  },
  {
    "id": "ikea-slakt-bed-frame-6",
    "slug": "slakt-bed-frame-6",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 198,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-with-3-storage-boxes-white-s89386070/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-6-white",
        "colorId": "white",
        "image": "/images/catalog/slakt-bed-frame-6/white.jpg",
        "priceOmr": 198,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-with-3-storage-boxes-white-s89386070/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-6/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 431
  },
  {
    "id": "ikea-klagshamn-chair-pad",
    "slug": "klagshamn-chair-pad",
    "category": "decor",
    "subcategory": "cushion",
    "model": "KLAGSHAMN",
    "nameEn": "Klagshamn Chair Pad",
    "nameAr": "وسادة كرسي KLAGSHAMN",
    "descEn": "Klagshamn Chair Pad — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "وسادة كرسي KLAGSHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 6,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/klagshamn-back-cushion-skiftebo-dark-grey-s89444310/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room"
    ],
    "dimensions": {
      "widthCm": 40,
      "depthCm": 40,
      "heightCm": 5
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "brown"
    ],
    "variants": [
      {
        "variantId": "klagshamn-chair-pad-grey",
        "colorId": "grey",
        "image": "/images/catalog/klagshamn-chair-pad/grey.jpg",
        "gallery": [
          "/images/catalog/klagshamn-chair-pad/grey-1.jpg"
        ],
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/klagshamn-back-cushion-skiftebo-dark-grey-s89444310/"
      },
      {
        "variantId": "klagshamn-chair-pad-brown",
        "colorId": "brown",
        "image": "/images/catalog/klagshamn-chair-pad/brown.jpg",
        "priceOmr": 6,
        "sourceUrl": "https://www.ikea.com/om/ar/p/klagshamn-back-cushion-faringe-brown-orange-s69571375/"
      }
    ],
    "images": [
      "/images/catalog/klagshamn-chair-pad/grey.jpg",
      "/images/catalog/klagshamn-chair-pad/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 432
  },
  {
    "id": "ikea-slakt-bed-frame-7",
    "slug": "slakt-bed-frame-7",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 60,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-incl-headboard-vissle-beige-s99612039/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-7-beige",
        "colorId": "beige",
        "image": "/images/catalog/slakt-bed-frame-7/beige.jpg",
        "priceOmr": 60,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-incl-headboard-vissle-beige-s99612039/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-7/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 433
  },
  {
    "id": "ikea-krummelur-mattress",
    "slug": "krummelur-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "KRUMMELUR",
    "nameEn": "Krummelur Mattress",
    "nameAr": "مرتبة KRUMMELUR",
    "descEn": "Krummelur Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة KRUMMELUR — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 145,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/krummelur-foam-mattress-for-cot-20593406/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 8
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "krummelur-mattress-natural",
        "colorId": "natural",
        "image": "/images/catalog/krummelur-mattress/natural.jpg",
        "priceOmr": 145,
        "sourceUrl": "https://www.ikea.com/om/ar/p/krummelur-foam-mattress-for-cot-20593406/"
      }
    ],
    "images": [
      "/images/catalog/krummelur-mattress/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 434
  },
  {
    "id": "ikea-slakt-bed-frame-8",
    "slug": "slakt-bed-frame-8",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 290,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-accessory-house-shaped-grey-20593878/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-8-grey",
        "colorId": "grey",
        "image": "/images/catalog/slakt-bed-frame-8/grey.jpg",
        "priceOmr": 290,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-accessory-house-shaped-grey-20593878/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-8/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 435
  },
  {
    "id": "ikea-sufflett-bed-frame",
    "slug": "sufflett-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SUFFLETT",
    "nameEn": "Sufflett Bed Frame",
    "nameAr": "هيكل سرير SUFFLETT",
    "descEn": "Sufflett Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SUFFLETT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 278,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sufflett-bed-tent-pink-80332468/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "pink"
    ],
    "variants": [
      {
        "variantId": "sufflett-bed-frame-pink",
        "colorId": "pink",
        "image": "/images/catalog/sufflett-bed-frame/pink.jpg",
        "priceOmr": 278,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sufflett-bed-tent-pink-80332468/"
      }
    ],
    "images": [
      "/images/catalog/sufflett-bed-frame/pink.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 436
  },
  {
    "id": "ikea-slakt-bed-frame-9",
    "slug": "slakt-bed-frame-9",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SLÄKT",
    "nameEn": "SläKt Bed Frame",
    "nameAr": "هيكل سرير SLÄKT",
    "descEn": "SläKt Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SLÄKT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 108,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-incl-bed-accessory-grey-s99608419/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "slakt-bed-frame-9-grey",
        "colorId": "grey",
        "image": "/images/catalog/slakt-bed-frame-9/grey.jpg",
        "priceOmr": 108,
        "sourceUrl": "https://www.ikea.com/om/ar/p/slaekt-bed-frame-incl-bed-accessory-grey-s99608419/"
      }
    ],
    "images": [
      "/images/catalog/slakt-bed-frame-9/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 437
  },
  {
    "id": "ikea-malm-bed-frame-5",
    "slug": "malm-bed-frame-5",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MALM",
    "nameEn": "Malm Bed Frame",
    "nameAr": "هيكل سرير MALM",
    "descEn": "Malm Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MALM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 128,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-white-40249485/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 120,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "malm-bed-frame-5-white",
        "colorId": "white",
        "image": "/images/catalog/malm-bed-frame-5/white.jpg",
        "priceOmr": 128,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-white-40249485/"
      }
    ],
    "images": [
      "/images/catalog/malm-bed-frame-5/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 438
  },
  {
    "id": "ikea-neiden-bed-frame-2",
    "slug": "neiden-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "NEIDEN",
    "nameEn": "Neiden Bed Frame",
    "nameAr": "هيكل سرير NEIDEN",
    "descEn": "Neiden Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير NEIDEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 244,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/neiden-bed-frame-pine-40395245/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "neiden-bed-frame-2-natural",
        "colorId": "natural",
        "image": "/images/catalog/neiden-bed-frame-2/natural.jpg",
        "priceOmr": 244,
        "sourceUrl": "https://www.ikea.com/om/ar/p/neiden-bed-frame-pine-40395245/"
      }
    ],
    "images": [
      "/images/catalog/neiden-bed-frame-2/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 439
  },
  {
    "id": "ikea-mellgrund-bed-frame",
    "slug": "mellgrund-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MELLGRUND",
    "nameEn": "Mellgrund Bed Frame",
    "nameAr": "هيكل سرير MELLGRUND",
    "descEn": "Mellgrund Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MELLGRUND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 97,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/mellgrund-bed-frame-off-white-luroey-s79613394/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "mellgrund-bed-frame-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/mellgrund-bed-frame/ivory.jpg",
        "priceOmr": 97,
        "sourceUrl": "https://www.ikea.com/om/ar/p/mellgrund-bed-frame-off-white-luroey-s79613394/"
      }
    ],
    "images": [
      "/images/catalog/mellgrund-bed-frame/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 440
  },
  {
    "id": "ikea-malm-bed-frame-6",
    "slug": "malm-bed-frame-6",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "MALM",
    "nameEn": "Malm Bed Frame",
    "nameAr": "هيكل سرير MALM",
    "descEn": "Malm Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير MALM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 134,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-w-2-storage-boxes-white-loenset-s49047746/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 120,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "malm-bed-frame-6-white",
        "colorId": "white",
        "image": "/images/catalog/malm-bed-frame-6/white.jpg",
        "priceOmr": 134,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-high-w-2-storage-boxes-white-loenset-s49047746/"
      }
    ],
    "images": [
      "/images/catalog/malm-bed-frame-6/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 441
  },
  {
    "id": "ikea-songesand-bed-frame",
    "slug": "songesand-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SONGESAND",
    "nameEn": "Songesand Bed Frame",
    "nameAr": "هيكل سرير SONGESAND",
    "descEn": "Songesand Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SONGESAND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 95,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/songesand-bed-frame-brown-loenset-s99241072/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "songesand-bed-frame-brown",
        "colorId": "brown",
        "image": "/images/catalog/songesand-bed-frame/brown.jpg",
        "priceOmr": 95,
        "sourceUrl": "https://www.ikea.com/om/ar/p/songesand-bed-frame-brown-loenset-s99241072/"
      }
    ],
    "images": [
      "/images/catalog/songesand-bed-frame/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 442
  },
  {
    "id": "ikea-gladstad-bed-frame-2",
    "slug": "gladstad-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GLADSTAD",
    "nameEn": "Gladstad Bed Frame",
    "nameAr": "هيكل سرير GLADSTAD",
    "descEn": "Gladstad Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GLADSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 198,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gladstad-upholstered-bed-2-storage-boxes-kabusa-light-grey-s39406805/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "gladstad-bed-frame-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/gladstad-bed-frame-2/grey.jpg",
        "priceOmr": 198,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gladstad-upholstered-bed-2-storage-boxes-kabusa-light-grey-s39406805/"
      }
    ],
    "images": [
      "/images/catalog/gladstad-bed-frame-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 443
  },
  {
    "id": "ikea-tarnkullen-bed-frame-3",
    "slug": "tarnkullen-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TÄRNKULLEN",
    "nameEn": "TäRnkullen Bed Frame",
    "nameAr": "هيكل سرير TÄRNKULLEN",
    "descEn": "TäRnkullen Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TÄRNKULLEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 157,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-tibbleby-beige-grey-luroey-s99564335/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "tarnkullen-bed-frame-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/tarnkullen-bed-frame-3/grey.jpg",
        "priceOmr": 157,
        "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-tibbleby-beige-grey-luroey-s99564335/"
      }
    ],
    "images": [
      "/images/catalog/tarnkullen-bed-frame-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 444
  },
  {
    "id": "ikea-songesand-bed-frame-2",
    "slug": "songesand-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SONGESAND",
    "nameEn": "Songesand Bed Frame",
    "nameAr": "هيكل سرير SONGESAND",
    "descEn": "Songesand Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SONGESAND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 157,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/songesand-bed-frame-with-2-storage-boxes-brown-luroey-s09241118/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "songesand-bed-frame-2-brown",
        "colorId": "brown",
        "image": "/images/catalog/songesand-bed-frame-2/brown.jpg",
        "priceOmr": 157,
        "sourceUrl": "https://www.ikea.com/om/ar/p/songesand-bed-frame-with-2-storage-boxes-brown-luroey-s09241118/"
      }
    ],
    "images": [
      "/images/catalog/songesand-bed-frame-2/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 445
  },
  {
    "id": "ikea-ramnefjall-bed-frame",
    "slug": "ramnefjall-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "RAMNEFJÄLL",
    "nameEn": "RamnefjäLl Bed Frame",
    "nameAr": "هيكل سرير RAMNEFJÄLL",
    "descEn": "RamnefjäLl Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير RAMNEFJÄLL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 134,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ramnefjaell-upholstered-bed-frame-kilanda-dark-blue-luroey-s99607486/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "navy"
    ],
    "variants": [
      {
        "variantId": "ramnefjall-bed-frame-navy",
        "colorId": "navy",
        "image": "/images/catalog/ramnefjall-bed-frame/navy.jpg",
        "priceOmr": 134,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ramnefjaell-upholstered-bed-frame-kilanda-dark-blue-luroey-s99607486/"
      }
    ],
    "images": [
      "/images/catalog/ramnefjall-bed-frame/navy.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 446
  },
  {
    "id": "ikea-radmanso-bed-frame",
    "slug": "radmanso-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "RÅDMANSÖ",
    "nameEn": "RåDmansö Bed Frame",
    "nameAr": "هيكل سرير RÅDMANSÖ",
    "descEn": "RåDmansö Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير RÅDMANSÖ — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 184,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/radmansoe-bed-frame-brown-walnut-effect-lindbaden-s79614888/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [
      "walnut"
    ],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "walnut"
    ],
    "variants": [
      {
        "variantId": "radmanso-bed-frame-walnut",
        "colorId": "walnut",
        "materialId": "walnut",
        "image": "/images/catalog/radmanso-bed-frame/walnut.jpg",
        "priceOmr": 184,
        "sourceUrl": "https://www.ikea.com/om/ar/p/radmansoe-bed-frame-brown-walnut-effect-lindbaden-s79614888/"
      }
    ],
    "images": [
      "/images/catalog/radmanso-bed-frame/walnut.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 447
  },
  {
    "id": "ikea-gladstad-bed-frame-3",
    "slug": "gladstad-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GLADSTAD",
    "nameEn": "Gladstad Bed Frame",
    "nameAr": "هيكل سرير GLADSTAD",
    "descEn": "Gladstad Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GLADSTAD — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 120,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gladstad-upholstered-bed-4-storage-boxes-kabusa-light-grey-s19407014/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "gladstad-bed-frame-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/gladstad-bed-frame-3/grey.jpg",
        "priceOmr": 120,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gladstad-upholstered-bed-4-storage-boxes-kabusa-light-grey-s19407014/"
      }
    ],
    "images": [
      "/images/catalog/gladstad-bed-frame-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 448
  },
  {
    "id": "ikea-vihals-bed-frame-10",
    "slug": "vihals-bed-frame-10",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "VIHALS",
    "nameEn": "Vihals Bed Frame",
    "nameAr": "هيكل سرير VIHALS",
    "descEn": "Vihals Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير VIHALS — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 104,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-2-trundle-beds-white-luroey-s49582054/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 180,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "vihals-bed-frame-10-white",
        "colorId": "white",
        "image": "/images/catalog/vihals-bed-frame-10/white.jpg",
        "priceOmr": 104,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vihals-bed-frame-with-2-trundle-beds-white-luroey-s49582054/"
      }
    ],
    "images": [
      "/images/catalog/vihals-bed-frame-10/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 449
  },
  {
    "id": "ikea-skonaback-sofa-bed",
    "slug": "skonaback-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "SKÖNABÄCK",
    "nameEn": "SköNabäCk Sofa-bed",
    "nameAr": "كنبة سرير SKÖNABÄCK",
    "descEn": "SköNabäCk Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير SKÖNABÄCK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 456,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skoenabaeck-2-seat-sofa-bed-knisa-dark-grey-70582542/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "green"
    ],
    "variants": [
      {
        "variantId": "skonaback-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/skonaback-sofa-bed/grey.jpg",
        "priceOmr": 456,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skoenabaeck-2-seat-sofa-bed-knisa-dark-grey-70582542/"
      },
      {
        "variantId": "skonaback-sofa-bed-green",
        "colorId": "green",
        "image": "/images/catalog/skonaback-sofa-bed/green.jpg",
        "priceOmr": 456,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skoenabaeck-2-seat-sofa-bed-vissle-yellow-green-60582547/"
      }
    ],
    "images": [
      "/images/catalog/skonaback-sofa-bed/grey.jpg",
      "/images/catalog/skonaback-sofa-bed/green.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 450
  },
  {
    "id": "ikea-kivik-sofa-bed-2",
    "slug": "kivik-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "KIVIK",
    "nameEn": "Kivik Sofa-bed",
    "nameAr": "كنبة سرير KIVIK",
    "descEn": "Kivik Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 3 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير KIVIK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 3 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 396,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-tresund-light-beige-s09470237/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey",
      "charcoal"
    ],
    "variants": [
      {
        "variantId": "kivik-sofa-bed-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/kivik-sofa-bed-2/beige.jpg",
        "priceOmr": 396,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-tresund-light-beige-s09470237/"
      },
      {
        "variantId": "kivik-sofa-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/kivik-sofa-bed-2/grey.jpg",
        "gallery": [
          "/images/catalog/kivik-sofa-bed-2/grey-1.jpg"
        ],
        "priceOmr": 396,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-kelinge-grey-turquoise-s19470227/"
      },
      {
        "variantId": "kivik-sofa-bed-2-charcoal",
        "colorId": "charcoal",
        "image": "/images/catalog/kivik-sofa-bed-2/charcoal.jpg",
        "priceOmr": 396,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kivik-1-seat-sofa-bed-tresund-anthracite-s89470243/"
      }
    ],
    "images": [
      "/images/catalog/kivik-sofa-bed-2/beige.jpg",
      "/images/catalog/kivik-sofa-bed-2/grey.jpg",
      "/images/catalog/kivik-sofa-bed-2/charcoal.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 451
  },
  {
    "id": "ikea-malm-mattress",
    "slug": "malm-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "MALM",
    "nameEn": "Malm Mattress",
    "nameAr": "مرتبة MALM",
    "descEn": "Malm Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة MALM — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 45,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-with-mattress-white-valevag-firm-s29544666/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 120,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "malm-mattress-white",
        "colorId": "white",
        "image": "/images/catalog/malm-mattress/white.jpg",
        "gallery": [
          "/images/catalog/malm-mattress/white-1.jpg",
          "/images/catalog/malm-mattress/white-2.jpg"
        ],
        "priceOmr": 45,
        "sourceUrl": "https://www.ikea.com/om/ar/p/malm-bed-frame-with-mattress-white-valevag-firm-s29544666/"
      }
    ],
    "images": [
      "/images/catalog/malm-mattress/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 452
  },
  {
    "id": "ikea-songesand-bed-frame-3",
    "slug": "songesand-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SONGESAND",
    "nameEn": "Songesand Bed Frame",
    "nameAr": "هيكل سرير SONGESAND",
    "descEn": "Songesand Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SONGESAND — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 84,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/songesand-bed-frame-with-4-storage-boxes-brown-luroey-s89241157/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 140,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "brown"
    ],
    "variants": [
      {
        "variantId": "songesand-bed-frame-3-brown",
        "colorId": "brown",
        "image": "/images/catalog/songesand-bed-frame-3/brown.jpg",
        "priceOmr": 84,
        "sourceUrl": "https://www.ikea.com/om/ar/p/songesand-bed-frame-with-4-storage-boxes-brown-luroey-s89241157/"
      }
    ],
    "images": [
      "/images/catalog/songesand-bed-frame-3/brown.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 453
  },
  {
    "id": "ikea-brimnes-day-bed",
    "slug": "brimnes-day-bed",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "BRIMNES",
    "nameEn": "Brimnes Day-bed",
    "nameAr": "سرير نهاري BRIMNES",
    "descEn": "Brimnes Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري BRIMNES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 174,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-day-bed-frame-with-2-drawers-white-00228705/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "brimnes-day-bed-white",
        "colorId": "white",
        "image": "/images/catalog/brimnes-day-bed/white.jpg",
        "priceOmr": 174,
        "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-day-bed-frame-with-2-drawers-white-00228705/"
      }
    ],
    "images": [
      "/images/catalog/brimnes-day-bed/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 454
  },
  {
    "id": "ikea-fagelfjallet-bed-frame",
    "slug": "fagelfjallet-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "FÅGELFJÄLLET",
    "nameEn": "FåGelfjäLlet Bed Frame",
    "nameAr": "هيكل سرير FÅGELFJÄLLET",
    "descEn": "FåGelfjäLlet Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير FÅGELFJÄLLET — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 119,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/fagelfjaellet-bed-frame-off-white-lindbaden-s89621039/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "fagelfjallet-bed-frame-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/fagelfjallet-bed-frame/ivory.jpg",
        "priceOmr": 119,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fagelfjaellet-bed-frame-off-white-lindbaden-s89621039/"
      }
    ],
    "images": [
      "/images/catalog/fagelfjallet-bed-frame/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 455
  },
  {
    "id": "ikea-fagelfjallet-bed-frame-2",
    "slug": "fagelfjallet-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "FÅGELFJÄLLET",
    "nameEn": "FåGelfjäLlet Bed Frame",
    "nameAr": "هيكل سرير FÅGELFJÄLLET",
    "descEn": "FåGelfjäLlet Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير FÅGELFJÄLLET — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 256,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/fagelfjaellet-bed-frame-with-2-storage-boxes-off-white-loenset-s89621063/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "fagelfjallet-bed-frame-2-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/fagelfjallet-bed-frame-2/ivory.jpg",
        "priceOmr": 256,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fagelfjaellet-bed-frame-with-2-storage-boxes-off-white-loenset-s89621063/"
      }
    ],
    "images": [
      "/images/catalog/fagelfjallet-bed-frame-2/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 456
  },
  {
    "id": "ikea-ramnefjall-bed-frame-2",
    "slug": "ramnefjall-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "RAMNEFJÄLL",
    "nameEn": "RamnefjäLl Bed Frame",
    "nameAr": "هيكل سرير RAMNEFJÄLL",
    "descEn": "RamnefjäLl Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير RAMNEFJÄLL — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 162,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ramnefjaell-upholstered-bed-frame-kilanda-light-beige-luroey-s99552752/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "ramnefjall-bed-frame-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/ramnefjall-bed-frame-2/beige.jpg",
        "priceOmr": 162,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ramnefjaell-upholstered-bed-frame-kilanda-light-beige-luroey-s99552752/"
      }
    ],
    "images": [
      "/images/catalog/ramnefjall-bed-frame-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 457
  },
  {
    "id": "ikea-barslov-sofa-bed",
    "slug": "barslov-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "BÅRSLÖV",
    "nameEn": "BåRslöV Sofa-bed",
    "nameAr": "كنبة سرير BÅRSLÖV",
    "descEn": "BåRslöV Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير BÅRSLÖV — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 605,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/barsloev-3-seat-sofa-bed-with-chaise-longue-tibbleby-beige-grey-80541594/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "barslov-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/barslov-sofa-bed/grey.jpg",
        "gallery": [
          "/images/catalog/barslov-sofa-bed/grey-1.jpg"
        ],
        "priceOmr": 605,
        "sourceUrl": "https://www.ikea.com/om/ar/p/barsloev-3-seat-sofa-bed-with-chaise-longue-tibbleby-beige-grey-80541594/"
      }
    ],
    "images": [
      "/images/catalog/barslov-sofa-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 458
  },
  {
    "id": "ikea-vretstorp-sofa-bed",
    "slug": "vretstorp-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VRETSTORP",
    "nameEn": "Vretstorp Sofa-bed",
    "nameAr": "كنبة سرير VRETSTORP",
    "descEn": "Vretstorp Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VRETSTORP — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 381,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vretstorp-3-seat-sofa-bed-hakebo-grey-green-s09491254/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "vretstorp-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/vretstorp-sofa-bed/grey.jpg",
        "gallery": [
          "/images/catalog/vretstorp-sofa-bed/grey-1.jpg"
        ],
        "priceOmr": 381,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vretstorp-3-seat-sofa-bed-hakebo-grey-green-s09491254/"
      },
      {
        "variantId": "vretstorp-sofa-bed-beige",
        "colorId": "beige",
        "image": "/images/catalog/vretstorp-sofa-bed/beige.jpg",
        "priceOmr": 381,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vretstorp-3-seat-sofa-bed-kilanda-light-beige-s79491236/"
      }
    ],
    "images": [
      "/images/catalog/vretstorp-sofa-bed/grey.jpg",
      "/images/catalog/vretstorp-sofa-bed/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 459
  },
  {
    "id": "ikea-tarnkullen-bed-frame-4",
    "slug": "tarnkullen-bed-frame-4",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TÄRNKULLEN",
    "nameEn": "TäRnkullen Bed Frame",
    "nameAr": "هيكل سرير TÄRNKULLEN",
    "descEn": "TäRnkullen Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TÄRNKULLEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 151,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-vissle-beige-s59569231/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tarnkullen-bed-frame-4-beige",
        "colorId": "beige",
        "image": "/images/catalog/tarnkullen-bed-frame-4/beige.jpg",
        "priceOmr": 151,
        "sourceUrl": "https://www.ikea.com/om/ar/p/taernkullen-upholstered-bed-frame-vissle-beige-s59569231/"
      }
    ],
    "images": [
      "/images/catalog/tarnkullen-bed-frame-4/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 460
  },
  {
    "id": "ikea-kura-bed-frame-4",
    "slug": "kura-bed-frame-4",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "KURA",
    "nameEn": "Kura Bed Frame",
    "nameAr": "هيكل سرير KURA",
    "descEn": "Kura Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير KURA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 268,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/kura-bed-tent-space-blue-80589086/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "blue"
    ],
    "variants": [
      {
        "variantId": "kura-bed-frame-4-blue",
        "colorId": "blue",
        "image": "/images/catalog/kura-bed-frame-4/blue.jpg",
        "priceOmr": 268,
        "sourceUrl": "https://www.ikea.com/om/ar/p/kura-bed-tent-space-blue-80589086/"
      }
    ],
    "images": [
      "/images/catalog/kura-bed-frame-4/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 461
  },
  {
    "id": "ikea-hammarn-sofa-bed",
    "slug": "hammarn-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "HAMMARN",
    "nameEn": "Hammarn Sofa-bed",
    "nameAr": "كنبة سرير HAMMARN",
    "descEn": "Hammarn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير HAMMARN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 237,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/hammarn-sofa-bed-knisa-dark-grey-black-90354327/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "hammarn-sofa-bed-black",
        "colorId": "black",
        "image": "/images/catalog/hammarn-sofa-bed/black.jpg",
        "priceOmr": 237,
        "sourceUrl": "https://www.ikea.com/om/ar/p/hammarn-sofa-bed-knisa-dark-grey-black-90354327/"
      }
    ],
    "images": [
      "/images/catalog/hammarn-sofa-bed/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 462
  },
  {
    "id": "ikea-brimnes-day-bed-2",
    "slug": "brimnes-day-bed-2",
    "category": "beds",
    "subcategory": "day-bed",
    "model": "BRIMNES",
    "nameEn": "Brimnes Day-bed",
    "nameAr": "سرير نهاري BRIMNES",
    "descEn": "Brimnes Day-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير نهاري BRIMNES — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 166,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-day-bed-w-2-drawers-2-mattresses-white-afjaell-firm-s89521153/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "brimnes-day-bed-2-white",
        "colorId": "white",
        "image": "/images/catalog/brimnes-day-bed-2/white.jpg",
        "gallery": [
          "/images/catalog/brimnes-day-bed-2/white-1.jpg",
          "/images/catalog/brimnes-day-bed-2/white-2.jpg",
          "/images/catalog/brimnes-day-bed-2/white-3.jpg"
        ],
        "priceOmr": 166,
        "sourceUrl": "https://www.ikea.com/om/ar/p/brimnes-day-bed-w-2-drawers-2-mattresses-white-afjaell-firm-s89521153/"
      }
    ],
    "images": [
      "/images/catalog/brimnes-day-bed-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 463
  },
  {
    "id": "ikea-fagelfjallet-bed-frame-3",
    "slug": "fagelfjallet-bed-frame-3",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "FÅGELFJÄLLET",
    "nameEn": "FåGelfjäLlet Bed Frame",
    "nameAr": "هيكل سرير FÅGELFJÄLLET",
    "descEn": "FåGelfjäLlet Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير FÅGELFJÄLLET — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 83,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/fagelfjaellet-bed-frame-with-4-storage-boxes-off-white-lindbaden-s99621109/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "ivory"
    ],
    "variants": [
      {
        "variantId": "fagelfjallet-bed-frame-3-ivory",
        "colorId": "ivory",
        "image": "/images/catalog/fagelfjallet-bed-frame-3/ivory.jpg",
        "priceOmr": 83,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fagelfjaellet-bed-frame-with-4-storage-boxes-off-white-lindbaden-s99621109/"
      }
    ],
    "images": [
      "/images/catalog/fagelfjallet-bed-frame-3/ivory.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 464
  },
  {
    "id": "ikea-tornsborg-bed-frame-2",
    "slug": "tornsborg-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "TORNSBORG",
    "nameEn": "Tornsborg Bed Frame",
    "nameAr": "هيكل سرير TORNSBORG",
    "descEn": "Tornsborg Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير TORNSBORG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 96,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-armchair-bed-naggen-beige-pine-50582411/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "tornsborg-bed-frame-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/tornsborg-bed-frame-2/beige.jpg",
        "priceOmr": 96,
        "sourceUrl": "https://www.ikea.com/om/ar/p/tornsborg-armchair-bed-naggen-beige-pine-50582411/"
      }
    ],
    "images": [
      "/images/catalog/tornsborg-bed-frame-2/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 465
  },
  {
    "id": "ikea-fridhult-sofa-bed",
    "slug": "fridhult-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "FRIDHULT",
    "nameEn": "Fridhult Sofa-bed",
    "nameAr": "كنبة سرير FRIDHULT",
    "descEn": "Fridhult Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير FRIDHULT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 340,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/fridhult-sofa-bed-knisa-light-grey-70351725/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "yellow"
    ],
    "variants": [
      {
        "variantId": "fridhult-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/fridhult-sofa-bed/grey.jpg",
        "priceOmr": 340,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fridhult-sofa-bed-knisa-light-grey-70351725/"
      },
      {
        "variantId": "fridhult-sofa-bed-yellow",
        "colorId": "yellow",
        "image": "/images/catalog/fridhult-sofa-bed/yellow.jpg",
        "priceOmr": 340,
        "sourceUrl": "https://www.ikea.com/om/ar/p/fridhult-sofa-bed-skiftebo-yellow-00575446/"
      }
    ],
    "images": [
      "/images/catalog/fridhult-sofa-bed/grey.jpg",
      "/images/catalog/fridhult-sofa-bed/yellow.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 466
  },
  {
    "id": "ikea-svarta-bunk-bed",
    "slug": "svarta-bunk-bed",
    "category": "beds",
    "subcategory": "bunk-bed",
    "model": "SVÄRTA",
    "nameEn": "SväRta Bunk Bed",
    "nameAr": "سرير بطابقين SVÄRTA",
    "descEn": "SväRta Bunk Bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "سرير بطابقين SVÄRTA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 110,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/svaerta-bunk-bed-frame-silver-colour-10247973/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "svarta-bunk-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/svarta-bunk-bed/grey.jpg",
        "priceOmr": 110,
        "sourceUrl": "https://www.ikea.com/om/ar/p/svaerta-bunk-bed-frame-silver-colour-10247973/"
      }
    ],
    "images": [
      "/images/catalog/svarta-bunk-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 467
  },
  {
    "id": "ikea-lindakra-sofa-bed",
    "slug": "lindakra-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "LINDÅKRA",
    "nameEn": "LindåKra Sofa-bed",
    "nameAr": "كنبة سرير LINDÅKRA",
    "descEn": "LindåKra Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير LINDÅKRA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 430,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/lindakra-2-seat-sofa-bed-vissle-light-grey-green-20629269/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "lindakra-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/lindakra-sofa-bed/grey.jpg",
        "gallery": [
          "/images/catalog/lindakra-sofa-bed/grey-1.jpg"
        ],
        "priceOmr": 430,
        "sourceUrl": "https://www.ikea.com/om/ar/p/lindakra-2-seat-sofa-bed-vissle-light-grey-green-20629269/"
      }
    ],
    "images": [
      "/images/catalog/lindakra-sofa-bed/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 468
  },
  {
    "id": "ikea-soderhamn-sofa-bed",
    "slug": "soderhamn-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "SÖDERHAMN",
    "nameEn": "SöDerhamn Sofa-bed",
    "nameAr": "كنبة سرير SÖDERHAMN",
    "descEn": "SöDerhamn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير SÖDERHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 390,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-corner-sofa-bed-6-seat-kelinge-beige-s89621398/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "soderhamn-sofa-bed-beige",
        "colorId": "beige",
        "image": "/images/catalog/soderhamn-sofa-bed/beige.jpg",
        "gallery": [
          "/images/catalog/soderhamn-sofa-bed/beige-1.jpg",
          "/images/catalog/soderhamn-sofa-bed/beige-2.jpg"
        ],
        "priceOmr": 390,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-corner-sofa-bed-6-seat-kelinge-beige-s89621398/"
      }
    ],
    "images": [
      "/images/catalog/soderhamn-sofa-bed/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 469
  },
  {
    "id": "ikea-gullaberg-bed-frame-4",
    "slug": "gullaberg-bed-frame-4",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GULLABERG",
    "nameEn": "Gullaberg Bed Frame",
    "nameAr": "هيكل سرير GULLABERG",
    "descEn": "Gullaberg Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GULLABERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 94,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-with-2-storage-boxes-grey-s99631009/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 160,
      "depthCm": 210,
      "heightCm": 100
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "gullaberg-bed-frame-4-grey",
        "colorId": "grey",
        "image": "/images/catalog/gullaberg-bed-frame-4/grey.jpg",
        "priceOmr": 94,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-with-2-storage-boxes-grey-s99631009/"
      }
    ],
    "images": [
      "/images/catalog/gullaberg-bed-frame-4/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 470
  },
  {
    "id": "ikea-sundvik-bed-frame",
    "slug": "sundvik-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SUNDVIK",
    "nameEn": "Sundvik Bed Frame",
    "nameAr": "هيكل سرير SUNDVIK",
    "descEn": "Sundvik Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SUNDVIK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 170,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sundvik-ext-bed-frame-with-slatted-bed-base-white-s49046068/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "sundvik-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/sundvik-bed-frame/white.jpg",
        "priceOmr": 170,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sundvik-ext-bed-frame-with-slatted-bed-base-white-s49046068/"
      }
    ],
    "images": [
      "/images/catalog/sundvik-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 471
  },
  {
    "id": "ikea-gullaberg-bed-frame-5",
    "slug": "gullaberg-bed-frame-5",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "GULLABERG",
    "nameEn": "Gullaberg Bed Frame",
    "nameAr": "هيكل سرير GULLABERG",
    "descEn": "Gullaberg Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير GULLABERG — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 146,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-white-lindbaden-s79614497/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 90,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "gullaberg-bed-frame-5-white",
        "colorId": "white",
        "image": "/images/catalog/gullaberg-bed-frame-5/white.jpg",
        "priceOmr": 146,
        "sourceUrl": "https://www.ikea.com/om/ar/p/gullaberg-bed-frame-white-lindbaden-s79614497/"
      }
    ],
    "images": [
      "/images/catalog/gullaberg-bed-frame-5/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 472
  },
  {
    "id": "ikea-sundvik-bed-frame-2",
    "slug": "sundvik-bed-frame-2",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "SUNDVIK",
    "nameEn": "Sundvik Bed Frame",
    "nameAr": "هيكل سرير SUNDVIK",
    "descEn": "Sundvik Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير SUNDVIK — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 130,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/sundvik-cot-white-00248567/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "sundvik-bed-frame-2-white",
        "colorId": "white",
        "image": "/images/catalog/sundvik-bed-frame-2/white.jpg",
        "priceOmr": 130,
        "sourceUrl": "https://www.ikea.com/om/ar/p/sundvik-cot-white-00248567/"
      }
    ],
    "images": [
      "/images/catalog/sundvik-bed-frame-2/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 473
  },
  {
    "id": "ikea-vimle-sofa-bed",
    "slug": "vimle-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 227,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-grann-bomstad-black-s09477333/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-black",
        "colorId": "black",
        "image": "/images/catalog/vimle-sofa-bed/black.jpg",
        "priceOmr": 227,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-grann-bomstad-black-s09477333/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 474
  },
  {
    "id": "ikea-ekholma-sofa-bed",
    "slug": "ekholma-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "EKHOLMA",
    "nameEn": "Ekholma Sofa-bed",
    "nameAr": "كنبة سرير EKHOLMA",
    "descEn": "Ekholma Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير EKHOLMA — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 233,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/ekholma-2-seat-sofa-bed-kilanda-light-beige-s69598563/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige"
    ],
    "variants": [
      {
        "variantId": "ekholma-sofa-bed-beige",
        "colorId": "beige",
        "image": "/images/catalog/ekholma-sofa-bed/beige.jpg",
        "priceOmr": 233,
        "sourceUrl": "https://www.ikea.com/om/ar/p/ekholma-2-seat-sofa-bed-kilanda-light-beige-s69598563/"
      }
    ],
    "images": [
      "/images/catalog/ekholma-sofa-bed/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 475
  },
  {
    "id": "ikea-vimle-sofa-bed-2",
    "slug": "vimle-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 360,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-with-wide-armrests-hallarp-beige-s59537042/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-2/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-2/beige-1.jpg"
        ],
        "priceOmr": 360,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-with-wide-armrests-hallarp-beige-s59537042/"
      },
      {
        "variantId": "vimle-sofa-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-2/grey.jpg",
        "priceOmr": 360,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-with-wide-armrests-hallarp-grey-s29537048/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-2/beige.jpg",
      "/images/catalog/vimle-sofa-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 476
  },
  {
    "id": "ikea-soderhamn-sofa-bed-2",
    "slug": "soderhamn-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "SÖDERHAMN",
    "nameEn": "SöDerhamn Sofa-bed",
    "nameAr": "كنبة سرير SÖDERHAMN",
    "descEn": "SöDerhamn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير SÖDERHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 520,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-4-seat-sofa-bed-with-chaise-longue-fridtuna-light-beige-s69616128/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "soderhamn-sofa-bed-2-beige",
        "colorId": "beige",
        "image": "/images/catalog/soderhamn-sofa-bed-2/beige.jpg",
        "gallery": [
          "/images/catalog/soderhamn-sofa-bed-2/beige-1.jpg"
        ],
        "priceOmr": 520,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-4-seat-sofa-bed-with-chaise-longue-fridtuna-light-beige-s69616128/"
      },
      {
        "variantId": "soderhamn-sofa-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/soderhamn-sofa-bed-2/grey.jpg",
        "priceOmr": 520,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-4-seat-sofa-bed-with-chaise-longue-fridtuna-dark-grey-blue-s89621379/"
      }
    ],
    "images": [
      "/images/catalog/soderhamn-sofa-bed-2/beige.jpg",
      "/images/catalog/soderhamn-sofa-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 477
  },
  {
    "id": "ikea-soderhamn-sofa-bed-3",
    "slug": "soderhamn-sofa-bed-3",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "SÖDERHAMN",
    "nameEn": "SöDerhamn Sofa-bed",
    "nameAr": "كنبة سرير SÖDERHAMN",
    "descEn": "SöDerhamn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير SÖDERHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 181,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-3-seat-sofa-bed-viarp-beige-brown-s89580067/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "blue"
    ],
    "variants": [
      {
        "variantId": "soderhamn-sofa-bed-3-beige",
        "colorId": "beige",
        "image": "/images/catalog/soderhamn-sofa-bed-3/beige.jpg",
        "gallery": [
          "/images/catalog/soderhamn-sofa-bed-3/beige-1.jpg"
        ],
        "priceOmr": 181,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-3-seat-sofa-bed-viarp-beige-brown-s89580067/"
      },
      {
        "variantId": "soderhamn-sofa-bed-3-blue",
        "colorId": "blue",
        "image": "/images/catalog/soderhamn-sofa-bed-3/blue.jpg",
        "priceOmr": 181,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-3-seat-sofa-bed-kelinge-dark-blue-s89621384/"
      }
    ],
    "images": [
      "/images/catalog/soderhamn-sofa-bed-3/beige.jpg",
      "/images/catalog/soderhamn-sofa-bed-3/blue.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 478
  },
  {
    "id": "ikea-saltsjobaden-sofa-bed",
    "slug": "saltsjobaden-sofa-bed",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "SALTSJÖBADEN",
    "nameEn": "SaltsjöBaden Sofa-bed",
    "nameAr": "كنبة سرير SALTSJÖBADEN",
    "descEn": "SaltsjöBaden Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير SALTSJÖBADEN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 597,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/saltsjoebaden-2-seat-sofa-bed-tonerud-grey-s79578593/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "white"
    ],
    "variants": [
      {
        "variantId": "saltsjobaden-sofa-bed-grey",
        "colorId": "grey",
        "image": "/images/catalog/saltsjobaden-sofa-bed/grey.jpg",
        "priceOmr": 597,
        "sourceUrl": "https://www.ikea.com/om/ar/p/saltsjoebaden-2-seat-sofa-bed-tonerud-grey-s79578593/"
      },
      {
        "variantId": "saltsjobaden-sofa-bed-white",
        "colorId": "white",
        "image": "/images/catalog/saltsjobaden-sofa-bed/white.jpg",
        "gallery": [
          "/images/catalog/saltsjobaden-sofa-bed/white-1.jpg"
        ],
        "priceOmr": 597,
        "sourceUrl": "https://www.ikea.com/om/ar/p/saltsjoebaden-2-seat-sofa-bed-vittangi-light-beige-white-s59621432/"
      }
    ],
    "images": [
      "/images/catalog/saltsjobaden-sofa-bed/grey.jpg",
      "/images/catalog/saltsjobaden-sofa-bed/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 479
  },
  {
    "id": "ikea-busunge-bed-frame",
    "slug": "busunge-bed-frame",
    "category": "beds",
    "subcategory": "bed-frame",
    "model": "BUSUNGE",
    "nameEn": "Busunge Bed Frame",
    "nameAr": "هيكل سرير BUSUNGE",
    "descEn": "Busunge Bed Frame — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "هيكل سرير BUSUNGE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 160,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/busunge-extendable-bed-white-70305700/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 80,
      "depthCm": 200,
      "heightCm": 100
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "busunge-bed-frame-white",
        "colorId": "white",
        "image": "/images/catalog/busunge-bed-frame/white.jpg",
        "priceOmr": 160,
        "sourceUrl": "https://www.ikea.com/om/ar/p/busunge-extendable-bed-white-70305700/"
      }
    ],
    "images": [
      "/images/catalog/busunge-bed-frame/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 480
  },
  {
    "id": "ikea-barslov-sofa-bed-2",
    "slug": "barslov-sofa-bed-2",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "BÅRSLÖV",
    "nameEn": "BåRslöV Sofa-bed",
    "nameAr": "كنبة سرير BÅRSLÖV",
    "descEn": "BåRslöV Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير BÅRSLÖV — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 338,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/barsloev-3-seat-sofa-bed-tibbleby-light-grey-turquoise-30541582/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey"
    ],
    "variants": [
      {
        "variantId": "barslov-sofa-bed-2-grey",
        "colorId": "grey",
        "image": "/images/catalog/barslov-sofa-bed-2/grey.jpg",
        "gallery": [
          "/images/catalog/barslov-sofa-bed-2/grey-1.jpg"
        ],
        "priceOmr": 338,
        "sourceUrl": "https://www.ikea.com/om/ar/p/barsloev-3-seat-sofa-bed-tibbleby-light-grey-turquoise-30541582/"
      }
    ],
    "images": [
      "/images/catalog/barslov-sofa-bed-2/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 481
  },
  {
    "id": "ikea-vimle-sofa-bed-3",
    "slug": "vimle-sofa-bed-3",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 502,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-gunnared-beige-s69545225/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-3-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-3/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-3/beige-1.jpg"
        ],
        "priceOmr": 502,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-gunnared-beige-s69545225/"
      },
      {
        "variantId": "vimle-sofa-bed-3-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-3/grey.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-3/grey-1.jpg"
        ],
        "priceOmr": 502,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-hallarp-grey-s49537009/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-3/beige.jpg",
      "/images/catalog/vimle-sofa-bed-3/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 482
  },
  {
    "id": "ikea-vimle-sofa-bed-4",
    "slug": "vimle-sofa-bed-4",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 557,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-with-wide-armrests-gunnared-beige-s39545203/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-4-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-4/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-4/beige-1.jpg"
        ],
        "priceOmr": 557,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-with-wide-armrests-gunnared-beige-s39545203/"
      },
      {
        "variantId": "vimle-sofa-bed-4-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-4/grey.jpg",
        "priceOmr": 557,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-with-wide-armrests-hallarp-grey-s19537020/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-4/beige.jpg",
      "/images/catalog/vimle-sofa-bed-4/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 483
  },
  {
    "id": "ikea-vimle-sofa-bed-5",
    "slug": "vimle-sofa-bed-5",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 218,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-grann-bomstad-black-s79477377/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-5-black",
        "colorId": "black",
        "image": "/images/catalog/vimle-sofa-bed-5/black.jpg",
        "priceOmr": 218,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-crnr-sofa-bed-5-seat-w-chaise-lng-grann-bomstad-black-s79477377/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-5/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 484
  },
  {
    "id": "ikea-vimle-sofa-bed-6",
    "slug": "vimle-sofa-bed-6",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 273,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-grann-bomstad-black-s59477359/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-6-black",
        "colorId": "black",
        "image": "/images/catalog/vimle-sofa-bed-6/black.jpg",
        "priceOmr": 273,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-grann-bomstad-black-s59477359/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-6/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 485
  },
  {
    "id": "ikea-vimle-sofa-bed-7",
    "slug": "vimle-sofa-bed-7",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 415,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-hallarp-grey-s29537072/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-7-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-7/grey.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-7/grey-1.jpg"
        ],
        "priceOmr": 415,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-hallarp-grey-s29537072/"
      },
      {
        "variantId": "vimle-sofa-bed-7-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-7/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-7/beige-1.jpg"
        ],
        "priceOmr": 415,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-gunnared-beige-s19545242/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-7/grey.jpg",
      "/images/catalog/vimle-sofa-bed-7/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 486
  },
  {
    "id": "ikea-vimle-sofa-bed-8",
    "slug": "vimle-sofa-bed-8",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 337,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-gunnared-beige-s89545229/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-8-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-8/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-8/beige-1.jpg"
        ],
        "priceOmr": 337,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-gunnared-beige-s89545229/"
      },
      {
        "variantId": "vimle-sofa-bed-8-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-8/grey.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-8/grey-1.jpg"
        ],
        "priceOmr": 337,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-2-seat-sofa-bed-gunnared-medium-grey-s09545271/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-8/beige.jpg",
      "/images/catalog/vimle-sofa-bed-8/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 487
  },
  {
    "id": "ikea-pelleplutt-mattress",
    "slug": "pelleplutt-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "PELLEPLUTT",
    "nameEn": "Pelleplutt Mattress",
    "nameAr": "مرتبة PELLEPLUTT",
    "descEn": "Pelleplutt Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة PELLEPLUTT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 67,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/pelleplutt-foam-mattress-for-cot-80593578/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 6
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "pelleplutt-mattress-natural",
        "colorId": "natural",
        "image": "/images/catalog/pelleplutt-mattress/natural.jpg",
        "priceOmr": 67,
        "sourceUrl": "https://www.ikea.com/om/ar/p/pelleplutt-foam-mattress-for-cot-80593578/"
      }
    ],
    "images": [
      "/images/catalog/pelleplutt-mattress/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 488
  },
  {
    "id": "ikea-skonast-mattress",
    "slug": "skonast-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "SKÖNAST",
    "nameEn": "SköNast Mattress",
    "nameAr": "مرتبة SKÖNAST",
    "descEn": "SköNast Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة SKÖNAST — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 65,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/skoenast-foam-mattress-for-cot-10593586/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 8
    },
    "dimensionsKnown": true,
    "colorIds": [
      "natural"
    ],
    "variants": [
      {
        "variantId": "skonast-mattress-natural",
        "colorId": "natural",
        "image": "/images/catalog/skonast-mattress/natural.jpg",
        "priceOmr": 65,
        "sourceUrl": "https://www.ikea.com/om/ar/p/skoenast-foam-mattress-for-cot-10593586/"
      }
    ],
    "images": [
      "/images/catalog/skonast-mattress/natural.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 489
  },
  {
    "id": "ikea-jattetrott-mattress",
    "slug": "jattetrott-mattress",
    "category": "beds",
    "subcategory": "mattress",
    "model": "JÄTTETRÖTT",
    "nameEn": "JäTtetröTt Mattress",
    "nameAr": "مرتبة JÄTTETRÖTT",
    "descEn": "JäTtetröTt Mattress — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "مرتبة JÄTTETRÖTT — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 108,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/jaettetroett-pocket-spring-mattress-for-cot-white-10593398/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "bedroom"
    ],
    "dimensions": {
      "widthCm": 60,
      "depthCm": 120,
      "heightCm": 11
    },
    "dimensionsKnown": true,
    "colorIds": [
      "white"
    ],
    "variants": [
      {
        "variantId": "jattetrott-mattress-white",
        "colorId": "white",
        "image": "/images/catalog/jattetrott-mattress/white.jpg",
        "priceOmr": 108,
        "sourceUrl": "https://www.ikea.com/om/ar/p/jaettetroett-pocket-spring-mattress-for-cot-white-10593398/"
      }
    ],
    "images": [
      "/images/catalog/jattetrott-mattress/white.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 490
  },
  {
    "id": "ikea-vimle-sofa-bed-9",
    "slug": "vimle-sofa-bed-9",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 479,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-gunnared-beige-s39545236/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-9-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-9/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-9/beige-1.jpg"
        ],
        "priceOmr": 479,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-gunnared-beige-s39545236/"
      },
      {
        "variantId": "vimle-sofa-bed-9-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-9/grey.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-9/grey-1.jpg"
        ],
        "priceOmr": 479,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-gunnared-medium-grey-s79545277/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-9/beige.jpg",
      "/images/catalog/vimle-sofa-bed-9/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 491
  },
  {
    "id": "ikea-soderhamn-sofa-bed-4",
    "slug": "soderhamn-sofa-bed-4",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "SÖDERHAMN",
    "nameEn": "SöDerhamn Sofa-bed",
    "nameAr": "كنبة سرير SÖDERHAMN",
    "descEn": "SöDerhamn Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير SÖDERHAMN — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 323,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-4-seat-sofa-bed-with-chaise-longue-with-open-end-fridtuna-dark-grey-blue-s79621365/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "grey",
      "beige"
    ],
    "variants": [
      {
        "variantId": "soderhamn-sofa-bed-4-grey",
        "colorId": "grey",
        "image": "/images/catalog/soderhamn-sofa-bed-4/grey.jpg",
        "priceOmr": 323,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-4-seat-sofa-bed-with-chaise-longue-with-open-end-fridtuna-dark-grey-blue-s79621365/"
      },
      {
        "variantId": "soderhamn-sofa-bed-4-beige",
        "colorId": "beige",
        "image": "/images/catalog/soderhamn-sofa-bed-4/beige.jpg",
        "gallery": [
          "/images/catalog/soderhamn-sofa-bed-4/beige-1.jpg"
        ],
        "priceOmr": 323,
        "sourceUrl": "https://www.ikea.com/om/ar/p/soederhamn-4-seat-sofa-bed-with-chaise-longue-with-open-end-kelinge-beige-s49621362/"
      }
    ],
    "images": [
      "/images/catalog/soderhamn-sofa-bed-4/grey.jpg",
      "/images/catalog/soderhamn-sofa-bed-4/beige.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 492
  },
  {
    "id": "ikea-vimle-sofa-bed-10",
    "slug": "vimle-sofa-bed-10",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 609,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-wide-armrests-gunnared-beige-s79545215/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-10-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-10/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-10/beige-1.jpg"
        ],
        "priceOmr": 609,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-wide-armrests-gunnared-beige-s79545215/"
      },
      {
        "variantId": "vimle-sofa-bed-10-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-10/grey.jpg",
        "priceOmr": 609,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-wide-armrests-hallarp-grey-s19537096/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-10/beige.jpg",
      "/images/catalog/vimle-sofa-bed-10/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 493
  },
  {
    "id": "ikea-vimle-sofa-bed-11",
    "slug": "vimle-sofa-bed-11",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 2 colour/finish options. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 2 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 467,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-with-wide-armrests-hallarp-beige-s79537084/",
    "stockStatus": "in-stock",
    "customizable": true,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "beige",
      "grey"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-11-beige",
        "colorId": "beige",
        "image": "/images/catalog/vimle-sofa-bed-11/beige.jpg",
        "gallery": [
          "/images/catalog/vimle-sofa-bed-11/beige-1.jpg"
        ],
        "priceOmr": 467,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-with-wide-armrests-hallarp-beige-s79537084/"
      },
      {
        "variantId": "vimle-sofa-bed-11-grey",
        "colorId": "grey",
        "image": "/images/catalog/vimle-sofa-bed-11/grey.jpg",
        "priceOmr": 467,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-with-chaise-longue-with-wide-armrests-hallarp-grey-s29537086/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-11/beige.jpg",
      "/images/catalog/vimle-sofa-bed-11/grey.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 494
  },
  {
    "id": "ikea-vimle-sofa-bed-12",
    "slug": "vimle-sofa-bed-12",
    "category": "sofas",
    "subcategory": "sofa-bed",
    "model": "VIMLE",
    "nameEn": "Vimle Sofa-bed",
    "nameAr": "كنبة سرير VIMLE",
    "descEn": "Vimle Sofa-bed — reference furniture imported into the Athathi prototype from the IKEA Oman gallery. 1 colour/finish option. Price is an estimate in OMR.",
    "descAr": "كنبة سرير VIMLE — قطعة أثاث مرجعية مستوردة إلى نموذج أثاثي من معرض ايكيا عُمان. 1 خيار لون/تشطيب. السعر تقديري بالريال العُماني.",
    "price": 325,
    "priceType": "estimated",
    "sourceLabel": "IKEA Oman (reference)",
    "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-grann-bomstad-black-s89477372/",
    "stockStatus": "in-stock",
    "customizable": false,
    "materials": [],
    "styleTags": [
      "scandinavian",
      "modern"
    ],
    "roomTypes": [
      "living-room",
      "majlis"
    ],
    "dimensions": {
      "widthCm": 220,
      "depthCm": 95,
      "heightCm": 85
    },
    "dimensionsKnown": false,
    "colorIds": [
      "black"
    ],
    "variants": [
      {
        "variantId": "vimle-sofa-bed-12-black",
        "colorId": "black",
        "image": "/images/catalog/vimle-sofa-bed-12/black.jpg",
        "priceOmr": 325,
        "sourceUrl": "https://www.ikea.com/om/ar/p/vimle-3-seat-sofa-bed-grann-bomstad-black-s89477372/"
      }
    ],
    "images": [
      "/images/catalog/vimle-sofa-bed-12/black.jpg"
    ],
    "addedAt": "2026-08-12",
    "featuredRank": 495
  }
];
