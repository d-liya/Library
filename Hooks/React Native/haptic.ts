/**
 * Not a hook but a usefull function
 */

import * as Haptics from "expo-haptics";
export async function imapactHaptic(type?: "Heavy" | "Light" | "Medium") {
  switch (type) {
    case "Light":
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    case "Heavy":
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    default:
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}
