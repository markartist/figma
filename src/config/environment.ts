/**
 * Environment Configuration
 * All platform-level values set via configuration (not stored in PageSpec/ComponentSpec)
 */

export const ENV_CONFIG = {
  // Spec versions
  SPEC_VERSION: 'v1.0',
  EXPORT_FORMAT_VERSION: 'ExportSpec v1.0',
  CONTRACT_STANDARD: 'Dhun-Sheth-Dual-Attribute',
  
  // Hash configuration
  HASH_ALGORITHM: 'SHA-256',
  HASH_TRUNCATION_LENGTH: 6,
  
  // Timestamps
  DEFAULT_TIMEZONE: 'UTC',
  
  // Validation
  VALIDATION_STRICT_MODE: false,
  
  // Allowed actions (strict enum)
  ALLOWED_ACTIONS: [
    'navigate',
    'toggle',
    'phone_call',
    'sms',
    'email',
    'download',
    'modal_open',
    'modal_close',
    'search',
    'submit_form',
    'trigger_modal',
    'external_link',
    'carousel_prev',
    'carousel_next',
    'carousel_click',
    'tab_switch',
    'open_overlay',
    'open_offcanvas',
    'toggle_dropdown'
  ],
  
  // Export flags
  GENERATE_RESI_TXT: true,
  GENERATE_AUDIT_CSV: true,
  
  // Access control
  ADMIN_MODE_ENABLED: true,
  READ_ONLY_PUBLIC_VIEW: false,
} as const;

export type ActionType = typeof ENV_CONFIG.ALLOWED_ACTIONS[number];
