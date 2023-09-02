import * as Haptics from 'expo-haptics'
interface HapticTypes {
  type:
    | "impactHeavy"
    | "impactMedium"
    | "impactLight"
    | "notiSuccess"
    | "notiError"
    | "notiWarning"
    | "selection";
}
export const haptics = (e: HapticTypes) => {
    switch (e.type) {
      case "impactHeavy":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      case "impactMedium":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case "impactLight":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case "notiSuccess":
        return Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      case "notiError":
        return Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        );
      case "notiWarning":
        return Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
      case "selection":
        return Haptics.selectionAsync();
      default:
        throw new Error(`Unsupported haptics type: ${e.type}`);
    }
  };