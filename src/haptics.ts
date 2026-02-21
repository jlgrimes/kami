import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const safeHaptic = (fn: () => Promise<void>) => {
  fn().catch(() => { /* not available on web */ });
};

export const hapticLight = () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Light }));
export const hapticMedium = () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Medium }));
export const hapticHeavy = () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Heavy }));
export const hapticSuccess = () => safeHaptic(() => Haptics.notification({ type: NotificationType.Success }));
export const hapticWarning = () => safeHaptic(() => Haptics.notification({ type: NotificationType.Warning }));
export const hapticError = () => safeHaptic(() => Haptics.notification({ type: NotificationType.Error }));
export const hapticSelection = () => safeHaptic(() => Haptics.selectionStart());
