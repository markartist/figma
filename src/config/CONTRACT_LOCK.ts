/**
 * CONTRACT LOCK CONFIGURATION
 * 
 * Single Source of Truth for Export Engine Versioning & Validation
 * 
 * GOVERNANCE RULES:
 * - Contract version changes require system-wide approval
 * - Schema versions must be explicitly supported
 * - Action taxonomy is frozen (no runtime modifications)
 * - Required-target actions enforce mandatory target values
 * 
 * MODIFICATION DISCIPLINE:
 * - Changes to this file are CONTRACT CHANGES
 * - Must be reviewed and versioned
 * - No ad-hoc modifications in export engine
 */

export const CONTRACT_LOCK = {
  /**
   * Expected Contract Version
   * Format: GOV-SPEC-V{MAJOR}.{MINOR}
   * 
   * MAJOR: Breaking changes to contract structure
   * MINOR: Backward-compatible additions
   */
  EXPECTED_CONTRACT_VERSION: 'GOV-SPEC-V2.0',
  
  /**
   * Export Engine Version
   * Format: ENGINE-V{MAJOR}.{MINOR}.{PATCH}
   * 
   * MAJOR: Breaking changes to export logic
   * MINOR: New features (backward compatible)
   * PATCH: Bug fixes
   */
  EXPORT_ENGINE_VERSION: 'ENGINE-V2.0.0',
  
  /**
   * Supported Schema Versions
   * Only these schema versions are allowed
   * Unsupported versions will fail validation
   */
  SUPPORTED_SCHEMA_VERSIONS: [
    '1.0',
    '1.1',
    '1.2',
    '2.0'
  ],
  
  /**
   * Default Schema Version
   * Used when model does not specify schema_version
   */
  DEFAULT_SCHEMA_VERSION: '1.0',
  
  /**
   * Allowed Actions (Frozen Taxonomy)
   * NO OTHER ACTIONS ARE PERMITTED
   */
  ALLOWED_ACTIONS: [
    'navigate',
    'external_link',
    'show_information',
    'input',
    'submit',
    'search',
    'toggle',
    'download',
    'phone_call',
    'sms',
    'email'
  ] as const,
  
  /**
   * Actions Requiring Mandatory Target Values
   * If action is in this list, target MUST be present and non-empty
   */
  REQUIRED_TARGET_ACTIONS: [
    'show_information',
    'navigate',
    'external_link'
  ] as const,
  
  /**
   * Build Mode
   * - 'release': Deterministic hashing (no timestamps in hash)
   * - 'development': Include timestamps in hash for debugging
   */
  BUILD_MODE: 'release' as 'release' | 'development',
  
  /**
   * Hash Algorithm Configuration
   */
  HASH_CONFIG: {
    algorithm: 'SHA-256',
    encoding: 'hex' as const,
    truncate: 16 // First 16 hex chars (64 bits)
  }
} as const;

/**
 * Type exports for compile-time safety
 */
export type AllowedAction = typeof CONTRACT_LOCK.ALLOWED_ACTIONS[number];
export type RequiredTargetAction = typeof CONTRACT_LOCK.REQUIRED_TARGET_ACTIONS[number];
export type SupportedSchemaVersion = typeof CONTRACT_LOCK.SUPPORTED_SCHEMA_VERSIONS[number];
export type BuildMode = typeof CONTRACT_LOCK.BUILD_MODE;

/**
 * Validation helpers
 */
export function isAllowedAction(action: string): action is AllowedAction {
  return CONTRACT_LOCK.ALLOWED_ACTIONS.includes(action as AllowedAction);
}

export function requiresTarget(action: string): action is RequiredTargetAction {
  return CONTRACT_LOCK.REQUIRED_TARGET_ACTIONS.includes(action as RequiredTargetAction);
}

export function isSupportedSchema(version: string): version is SupportedSchemaVersion {
  return CONTRACT_LOCK.SUPPORTED_SCHEMA_VERSIONS.includes(version as SupportedSchemaVersion);
}
