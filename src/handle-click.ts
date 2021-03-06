import { navigate } from "./navigate";
import { toggleEntity } from "./toggle-entity";
import { HomeAssistant, ActionConfig } from "./types";
import { fireEvent } from "./fire-event";
import { forwardHaptic } from "./haptic";

export const handleClick = (
  node: HTMLElement,
  hass: HomeAssistant,
  config: {
    entity?: string;
    camera_image?: string;
    hold_action?: ActionConfig;
    tap_action?: ActionConfig;
  },
  hold: boolean
): void => {
  let actionConfig: ActionConfig | undefined;

  if (hold && config.hold_action) {
    actionConfig = config.hold_action;
  } else if (!hold && config.tap_action) {
    actionConfig = config.tap_action;
  }

  if (!actionConfig) {
    actionConfig = {
      action: "more-info"
    };
  }

  switch (actionConfig.action) {
    case "more-info":
      if (config.entity) {
        fireEvent(node, "hass-more-info", {
          entityId: config.entity
        });
        if (actionConfig.haptic) forwardHaptic(node, actionConfig.haptic);
      }
      break;
    case "navigate":
      if (actionConfig.navigation_path) {
        navigate(node, actionConfig.navigation_path);
        if (actionConfig.haptic) forwardHaptic(node, actionConfig.haptic);
      }
      break;
    case "url":
      actionConfig.url && window.open(actionConfig.url);
      if (actionConfig.haptic) forwardHaptic(node, actionConfig.haptic);
      break;
    case "toggle":
      if (config.entity) {
        toggleEntity(hass, config.entity!);
        if (actionConfig.haptic) forwardHaptic(node, actionConfig.haptic);
      }
      break;
    case "call-service": {
      if (!actionConfig.service) {
        return;
      }
      const [domain, service] = actionConfig.service.split(".", 2);
      hass.callService(domain, service, actionConfig.service_data);
      if (actionConfig.haptic) forwardHaptic(node, actionConfig.haptic);
    }
  }
};
