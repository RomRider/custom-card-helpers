import {
  HassEntities,
  HassConfig,
  Auth,
  Connection,
  MessageBase,
  HassServices
} from "home-assistant-js-websocket";
import { HapticType } from "./haptic";

export interface ToggleActionConfig {
  action: "toggle";
  haptic?: HapticType;
}

export interface ToggleMenuActionConfig {
  action: "toggle-menu";
  haptic?: HapticType;
}

export interface CallServiceActionConfig {
  action: "call-service";
  haptic?: HapticType;
  service: string;
  service_data?: {
    entity_id?: string | [string];
    [key: string]: any;
  };
}

export interface NavigateActionConfig {
  action: "navigate";
  haptic?: HapticType;
  navigation_path: string;
}

export interface MoreInfoActionConfig {
  action: "more-info";
  haptic?: HapticType;
  entity?: string;
}

export interface UrlActionConfig {
  action: "url";
  haptic?: HapticType;
  url: string;
}

export interface NoActionConfig {
  action: "none";
}

export type ActionConfig =
  | ToggleActionConfig
  | ToggleMenuActionConfig
  | CallServiceActionConfig
  | NavigateActionConfig
  | MoreInfoActionConfig
  | UrlActionConfig
  | NoActionConfig;

declare global {
  // for fire event
  interface HASSDomEvents {
    "value-changed": {
      value: unknown;
    };
    "config-changed": {
      config: any;
    };
    "hass-more-info": {
      entityId: string | null;
    };
    "ll-rebuild": {};
    "location-changed": {
      replace: boolean;
    };
    undefined;
  }
}

type ValidHassDomEvent = keyof HASSDomEvents;

export type LocalizeFunc = (key: string, ...args: any[]) => string;

export interface Credential {
  auth_provider_type: string;
  auth_provider_id: string;
}

export interface MFAModule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CurrentUser {
  id: string;
  is_owner: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}

export interface Theme {
  // Incomplete
  "primary-color": string;
  "text-primary-color": string;
  "accent-color": string;
}

export interface Themes {
  default_theme: string;
  themes: { [key: string]: Theme };
}

export interface Panel {
  component_name: string;
  config: { [key: string]: any } | null;
  icon: string | null;
  title: string | null;
  url_path: string;
}

export interface Panels {
  [name: string]: Panel;
}

export interface Resources {
  [language: string]: { [key: string]: string };
}

export interface Translation {
  nativeName: string;
  isRTL: boolean;
  fingerprints: { [fragment: string]: string };
}

export interface HomeAssistant {
  auth: Auth;
  connection: Connection;
  connected: boolean;
  states: HassEntities;
  services: HassServices;
  config: HassConfig;
  themes: Themes;
  selectedTheme?: string | null;
  panels: Panels;
  panelUrl: string;

  // i18n
  // current effective language, in that order:
  //   - backend saved user selected lanugage
  //   - language in local appstorage
  //   - browser language
  //   - english (en)
  language: string;
  // local stored language, keep that name for backward compability
  selectedLanguage: string;
  resources: Resources;
  localize: LocalizeFunc;
  translationMetadata: {
    fragments: string[];
    translations: {
      [lang: string]: Translation;
    };
  };

  dockedSidebar: boolean;
  moreInfoEntityId: string;
  user: CurrentUser;
  callService: (
    domain: string,
    service: string,
    serviceData?: { [key: string]: any }
  ) => Promise<void>;
  callApi: <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: { [key: string]: any }
  ) => Promise<T>;
  fetchWithAuth: (
    path: string,
    init?: { [key: string]: any }
  ) => Promise<Response>;
  sendWS: (msg: MessageBase) => Promise<void>;
  callWS: <T>(msg: MessageBase) => Promise<T>;
}
