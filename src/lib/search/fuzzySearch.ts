import { Product } from "@/types/catalog";

// Fast Levenshtein distance with early exit
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  if (a.length < b.length) {
    const tmp = a;
    a = b;
    b = tmp;
  }

  let row = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 0; i < a.length; i++) {
    const nextRow = [i + 1];
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      nextRow.push(
        Math.min(
          nextRow[j] + 1, // insertion
          row[j + 1] + 1, // deletion
          row[j] + cost // substitution
        )
      );
    }
    row = nextRow;
  }

  return row[b.length];
}

// Common gifting domain typos and colloquial synonyms
const COMMON_TYPOS: Record<string, string> = {
  fame: "frame",
  fames: "frames",
  fram: "frame",
  frams: "frames",
  frems: "frames",
  farme: "frame",
  farmes: "frames",
  mug: "mug",
  mugs: "mugs",
  mugg: "mug",
  muggs: "mugs",
  pic: "photo",
  pics: "photo",
  foto: "photo",
  fotos: "photo",
  fotofram: "photo frame",
  walet: "wallet",
  walets: "wallets",
  cuple: "couple",
  cuples: "couples",
  copule: "couple",
  aniversary: "anniversary",
  aniversery: "anniversary",
  anniversery: "anniversary",
  bithday: "birthday",
  brithday: "birthday",
  bday: "birthday",
  bdays: "birthday",
  valantine: "valentine",
  valentines: "valentine",
  diwaly: "diwali",
  diwaali: "diwali",
  persnalized: "personalized",
  personlized: "personalized",
  presonalized: "personalized",
  customised: "customized",
  costum: "custom",
  costumized: "customized",
  costume: "custom",
  keychan: "keychain",
  keychane: "keychain",
  kyechain: "keychain",
  keychaines: "keychains",
  lamp: "lamp",
  lampe: "lamp",
  lamps: "lamps",
  botle: "bottle",
  bottel: "bottle",
  botles: "bottles",
  pilow: "pillow",
  cusion: "cushion",
  cushon: "cushion",
  clok: "clock",
  cloks: "clocks",
  wch: "watch",
  wtch: "watch",
};

/**
 * Extracts all unique searchable keywords from product catalog
 */
export function buildCatalogVocabulary(products: Product[]): string[] {
  const wordSet = new Set<string>();

  const addText = (text?: string) => {
    if (!text) return;
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3)
      .forEach((w) => {
        wordSet.add(w);
        // Also index singular forms for plurals
        if (w.endsWith("s") && w.length > 3) wordSet.add(w.slice(0, -1));
        if (w.endsWith("es") && w.length > 4) wordSet.add(w.slice(0, -2));
      });
  };

  for (const p of products) {
    addText(p.name);
    addText(p.categorySlug);
    addText(p.shortDescription);
    p.tags?.forEach(addText);
    p.occasionSlugs?.forEach(addText);
    p.recipientSlugs?.forEach(addText);
    p.materials?.forEach(addText);
    p.frameColors?.forEach((fc) => addText(fc.name));
  }

  return Array.from(wordSet);
}

/**
 * Finds the closest catalog word for a typo with maximum distance tolerance based on word length.
 */
export function findClosestWord(word: string, vocabulary: string[]): string | null {
  const cleanWord = word.toLowerCase().trim();
  if (cleanWord.length < 3) return null;

  // 1. Direct typo dictionary lookup
  if (COMMON_TYPOS[cleanWord]) {
    return COMMON_TYPOS[cleanWord];
  }

  // 2. Exact or substring match in vocabulary
  if (vocabulary.includes(cleanWord)) {
    return cleanWord;
  }

  // 3. Prefix matching (e.g., "keych" -> "keychain")
  const prefixMatch = vocabulary.find(
    (v) => v.startsWith(cleanWord) && v.length - cleanWord.length <= 4
  );
  if (prefixMatch) {
    return prefixMatch;
  }

  // 4. Levenshtein distance search
  const maxDistance = cleanWord.length <= 4 ? 1 : cleanWord.length <= 7 ? 2 : 3;

  let bestMatch: string | null = null;
  let bestDist = maxDistance + 1;

  for (const candidate of vocabulary) {
    // Length difference heuristic to skip heavy comparison
    if (Math.abs(candidate.length - cleanWord.length) > maxDistance) continue;

    const dist = levenshteinDistance(cleanWord, candidate);
    if (dist < bestDist) {
      bestDist = dist;
      bestMatch = candidate;
    }
  }

  return bestDist <= maxDistance ? bestMatch : null;
}

/**
 * Normalizes query string and autocorrects words if they don't match any catalog terms.
 */
export function correctQuery(
  rawQuery: string,
  vocabulary: string[]
): {
  correctedQuery: string;
  hasCorrections: boolean;
  terms: string[];
} {
  const words = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { correctedQuery: "", hasCorrections: false, terms: [] };
  }

  let hasCorrections = false;
  const correctedWords = words.map((word) => {
    // 1. Check direct common typos first (e.g. "fames" -> "frames", "mugg" -> "mug")
    if (COMMON_TYPOS[word]) {
      hasCorrections = true;
      return COMMON_TYPOS[word];
    }

    // 2. If the word already exists exactly in vocabulary, keep it
    if (vocabulary.includes(word)) {
      return word;
    }

    // 3. Find closest word via fuzzy matching
    const suggested = findClosestWord(word, vocabulary);
    if (suggested && suggested !== word) {
      hasCorrections = true;
      return suggested;
    }

    return word;
  });

  return {
    correctedQuery: correctedWords.join(" "),
    hasCorrections,
    terms: correctedWords,
  };
}

/**
 * High-performance, zero-overhead fuzzy product filter.
 * 1. Checks exact matches first.
 * 2. If 0 exact matches, automatically applies typo correction against catalog vocabulary.
 */
export function filterProductsFuzzy(
  products: Product[],
  rawQuery: string,
  vocabulary?: string[]
): {
  matchedProducts: Product[];
  correctedQuery: string | null;
} {
  const query = rawQuery.trim();
  if (!query) {
    return { matchedProducts: products, correctedQuery: null };
  }

  const vocab = vocabulary || buildCatalogVocabulary(products);
  const rawTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const getProductSearchableText = (p: Product) =>
    `${p.name} ${p.shortDescription} ${p.categorySlug} ${(p.tags || []).join(" ")} ${(p.occasionSlugs || []).join(" ")} ${(p.recipientSlugs || []).join(" ")}`.toLowerCase();

  // 1. Try exact substring match with raw terms
  const exactMatches = products.filter((p) => {
    const text = getProductSearchableText(p);
    return rawTerms.every((term) => text.includes(term));
  });

  if (exactMatches.length > 0) {
    return { matchedProducts: exactMatches, correctedQuery: null };
  }

  // 2. If 0 matches, perform spelling correction
  const { correctedQuery, hasCorrections, terms: correctedTerms } = correctQuery(
    query,
    vocab
  );

  if (hasCorrections && correctedTerms.length > 0) {
    const correctedMatches = products.filter((p) => {
      const text = getProductSearchableText(p);
      return correctedTerms.every((term) => text.includes(term));
    });

    if (correctedMatches.length > 0) {
      return {
        matchedProducts: correctedMatches,
        correctedQuery,
      };
    }
  }

  // 3. Fallback: match if at least ANY corrected term matches or fuzzy word match
  const fallbackMatches = products.filter((p) => {
    const text = getProductSearchableText(p);
    const words = text.split(/\s+/);

    return rawTerms.some((term) => {
      if (text.includes(term)) return true;
      const cleanTerm = term.toLowerCase();
      const maxDist = cleanTerm.length <= 4 ? 1 : 2;
      return words.some(
        (w) =>
          Math.abs(w.length - cleanTerm.length) <= maxDist &&
          levenshteinDistance(w, cleanTerm) <= maxDist
      );
    });
  });

  return {
    matchedProducts: fallbackMatches,
    correctedQuery: hasCorrections ? correctedQuery : null,
  };
}
