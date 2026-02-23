/**
 * UNIFIED BATCH EXPORTER - Uses ONLY newExportEngine.ts
 * NO LEGACY FORMATTERS ALLOWED
 * 
 * System-Wide Export Engine Unification:
 * - ONE serializer (newExportEngine)
 * - ONE contract format (VENTERRA GOVERNED SPEC CONTRACT)
 * - ONE action taxonomy (11 allowed actions)
 * - ONE traversal logic
 * - ONE validation engine
 * 
 * ALL pages route through the same export path with ZERO exceptions.
 */

import homepageSpec from '@/layouts/pages/homepage.json';
import contactSpec from '@/layouts/pages/contact.json';
import featuresSpec from '@/layouts/pages/features.json';
import amenitiesSpec from '@/layouts/pages/amenities.json';
import reviewsSpec from '@/layouts/pages/reviews.json';
import specialsSpec from '@/layouts/pages/specials.json';
import aboutVenterraSpec from '@/layouts/pages/about-venterra.json';
import apartmentsPricingSpec from '@/layouts/pages/apartments-pricing.json';
import faqSpec from '@/layouts/pages/faq.json';
import gallerySpec from '@/layouts/pages/gallery.json';
import neighborhoodSpec from '@/layouts/pages/neighborhood.json';
import navPrimarySpec from '@/layouts/components/nav-primary.json';
import footerPrimarySpec from '@/layouts/components/footer-primary.json';

// UNIFIED EXPORT ENGINE (NO LEGACY)
import { generateGovernedSpecTXT, generateGovernedSpecCSV, ExportResult as EngineExportResult } from './newExportEngine';

export interface ExportResult {
  governedSpecs: {
    [filename: string]: EngineExportResult;
  };
  csvExports: {
    [filename: string]: string;
  };
  summary: {
    totalPages: number;
    totalComponents: number;
    totalExports: number;
    allValid: boolean;
    validExports: number;
    invalidExports: number;
  };
}

/**
 * Normalize legacy section IDs to standard format
 * PHASE 3 - LEGACY MODEL NORMALIZATION
 */
function normalizeLegacyStructure(spec: any): any {
  if (!spec || !spec.sections) return spec;
  
  const normalized = JSON.parse(JSON.stringify(spec));
  
  normalized.sections = normalized.sections.map((section: any, idx: number) => {
    const canonicalNum = idx + 1;
    const paddedNum = canonicalNum.toString().padStart(2, '0');
    const canonicalId = `section_${paddedNum}`;
    const canonicalName = `SECTION_${paddedNum}`;
    
    let semanticKey = section['data-page-section'] || '';
    
    if (!semanticKey && section.section_id) {
      const legacyId = String(section.section_id);
      const match = legacyId.match(/_([a-z_]+)$/);
      if (match) {
        semanticKey = match[1];
      }
    }
    
    if (!semanticKey && section.name) {
      const legacyName = String(section.name);
      const match = legacyName.match(/_([a-z_]+)$/i);
      if (match) {
        semanticKey = match[1].toLowerCase();
      }
    }
    
    return {
      ...section,
      section_id: canonicalId,
      id: canonicalId,
      'data-page-section': semanticKey,
      'data-page-section-location': canonicalNum.toString(),
      name: canonicalName
    };
  });
  
  return normalized;
}

export function exportAllLayouts(): ExportResult {
  const governedSpecs: { [filename: string]: EngineExportResult } = {};
  const csvExports: { [filename: string]: string } = {};
  
  let validExports = 0;
  let invalidExports = 0;

  const pages = [
    { id: 'homepage', spec: homepageSpec },
    { id: 'contact', spec: contactSpec },
    { id: 'features', spec: featuresSpec },
    { id: 'amenities', spec: amenitiesSpec },
    { id: 'reviews', spec: reviewsSpec },
    { id: 'specials', spec: specialsSpec },
    { id: 'about-venterra', spec: aboutVenterraSpec },
    { id: 'apartments-pricing', spec: apartmentsPricingSpec },
    { id: 'faq', spec: faqSpec },
    { id: 'gallery', spec: gallerySpec },
    { id: 'neighborhood', spec: neighborhoodSpec },
  ];

  pages.forEach(({ id, spec }) => {
    const normalizedSpec = normalizeLegacyStructure(spec);
    const exportResult = generateGovernedSpecTXT(normalizedSpec, id, 'Pages');
    governedSpecs[`${id}_governed_spec_new.txt`] = exportResult;
    const csvContent = generateGovernedSpecCSV(normalizedSpec, id);
    csvExports[`${id}_export.csv`] = csvContent;
    if (exportResult.valid) {
      validExports++;
    } else {
      invalidExports++;
    }
  });

  const components = [
    { id: 'nav-primary', spec: navPrimarySpec },
    { id: 'footer-primary', spec: footerPrimarySpec },
  ];

  components.forEach(({ id, spec }) => {
    const normalizedSpec = normalizeLegacyStructure(spec);
    const exportResult = generateGovernedSpecTXT(normalizedSpec, id, 'Components');
    governedSpecs[`${id}_governed_spec_new.txt`] = exportResult;
    const csvContent = generateGovernedSpecCSV(normalizedSpec, id);
    csvExports[`${id}_export.csv`] = csvContent;
    if (exportResult.valid) {
      validExports++;
    } else {
      invalidExports++;
    }
  });

  return {
    governedSpecs,
    csvExports,
    summary: {
      totalPages: pages.length,
      totalComponents: components.length,
      totalExports: pages.length + components.length,
      allValid: invalidExports === 0,
      validExports,
      invalidExports,
    },
  };
}

export function getExportData(): ExportResult {
  return exportAllLayouts();
}

export function getExportDataLegacyCompat(): {
  attributes: { [filename: string]: string };
  exportResults: { [filename: string]: EngineExportResult };
  inventory: string;
  summary: any;
} {
  const result = exportAllLayouts();
  const attributes: { [filename: string]: string } = {};
  Object.entries(result.governedSpecs).forEach(([filename, exportResult]) => {
    attributes[filename] = exportResult.content;
  });
  
  let inventoryCsv = 'Page,Total Subsections,Validation Status,Model Hash,Export Hash\n';
  Object.entries(result.governedSpecs).forEach(([filename, exportResult]) => {
    const pageId = filename.replace('_governed_spec_new.txt', '');
    const subsectionMatch = exportResult.content.match(/Total Subsections: (\\d+)/);
    const totalSubsections = subsectionMatch ? subsectionMatch[1] : '0';
    const isValid = exportResult.valid ? 'VALID' : 'INVALID';
    const modelHash = exportResult.metadata.modelHash || '';
    const exportHash = exportResult.metadata.exportHash || '';
    inventoryCsv += `\"${pageId}\",\"${totalSubsections}\",\"${isValid}\",\"${modelHash}\",\"${exportHash}\"\n`;
  });
  
  return {
    attributes,
    exportResults: result.governedSpecs,
    inventory: inventoryCsv,
    summary: result.summary,
  };
}