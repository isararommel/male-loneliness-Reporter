export type DeliveryChannel =
  | "WhatsApp"
  | "Instagram"
  | "Facebook"
  | "Snapchat"
  | "TikTok"
  | "Tinder"
  | "Bumble"
  | "Andere Dating-App"
  | "SMS"
  | "E-Mail"
  | "Sonstiger Messenger / Social Media";

export const DELIVERY_CHANNELS: DeliveryChannel[] = [
  "WhatsApp",
  "Instagram",
  "Facebook",
  "Snapchat",
  "TikTok",
  "Tinder",
  "Bumble",
  "Andere Dating-App",
  "SMS",
  "E-Mail",
  "Sonstiger Messenger / Social Media",
];

export type IncidentStatus = "erfasst" | "angezeigt";

export interface Screenshot {
  id: string;
  incidentId: string;
  blob: Blob;
  mimeType: string;
  fileName: string;
}

export interface Incident {
  id: string;
  createdAt: string;
  receivedDate: string;
  channel: DeliveryChannel;
  channelDetail?: string;
  senderName?: string;
  senderHandle?: string;
  senderProfileUrl?: string;
  notes?: string;
  status: IncidentStatus;
  reportedAt?: string;
}

export interface Profile {
  id: "self";
  firstName: string;
  lastName: string;
  birthDate?: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
}

export function isProfileComplete(profile: Profile | undefined): profile is Profile {
  if (!profile) return false;
  return Boolean(
    profile.firstName.trim() &&
      profile.lastName.trim() &&
      profile.street.trim() &&
      profile.houseNumber.trim() &&
      profile.postalCode.trim() &&
      profile.city.trim()
  );
}
