import { ClientTrackingData } from "@/lib/types";

export async function trackLinkClick(event: ClientTrackingData) {
  try {
    const trackingData = {
      profileUsername: event.profileUsername,
      linkId: event.linkId,
      linkTitle: event.linkTitle,
      linkUrl: event.linkUrl,
      userAgent: event.userAgent || navigator.userAgent,
      referrer: event.referrer || document.referrer || "direct",
    };

    console.log("Link click tracked:", trackingData);

    // Send to your API endpoint which forwards to Tinybird
    await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackingData),
    });

    return trackingData;
  } catch (error) {
    console.error("Failed to track link click:", error);
  }
}