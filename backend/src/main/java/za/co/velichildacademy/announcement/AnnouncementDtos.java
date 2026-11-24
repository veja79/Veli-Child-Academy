package za.co.velichildacademy.announcement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;

public final class AnnouncementDtos {

    private AnnouncementDtos() {}

    /** Shape returned to the public site. Matches frontend/src/types/announcement.ts */
    public record PublicAnnouncement(
            Long id, String title, String summary, String body,
            Category category, LocalDate publishedAt, boolean pinned, String imageUrl) {

        static PublicAnnouncement from(Announcement a) {
            return new PublicAnnouncement(a.getId(), a.getTitle(), a.getSummary(), a.getBody(),
                    a.getCategory(), a.getPublishedAt(), a.isPinned(), a.getImageUrl());
        }
    }

    /** Shape returned to the admin portal, including drafts and audit dates. */
    public record AdminAnnouncement(
            Long id, String title, String summary, String body,
            Category category, LocalDate publishedAt, boolean pinned, boolean published, String imageUrl,
            Instant createdAt, Instant updatedAt) {

        static AdminAnnouncement from(Announcement a) {
            return new AdminAnnouncement(a.getId(), a.getTitle(), a.getSummary(), a.getBody(),
                    a.getCategory(), a.getPublishedAt(), a.isPinned(), a.isPublished(), a.getImageUrl(),
                    a.getCreatedAt(), a.getUpdatedAt());
        }
    }

    public record AnnouncementRequest(
            @NotBlank @Size(max = 150) String title,
            @NotBlank @Size(max = 300) String summary,
            @NotBlank @Size(max = 5000) String body,
            @NotNull Category category,
            @NotNull LocalDate publishedAt,
            boolean pinned,
            boolean published,
            @Size(max = 300) String imageUrl) {

        void applyTo(Announcement a) {
            a.setTitle(title.trim());
            a.setSummary(summary.trim());
            a.setBody(body.trim());
            a.setCategory(category);
            a.setPublishedAt(publishedAt);
            a.setPinned(pinned);
            a.setPublished(published);
            a.setImageUrl(imageUrl == null || imageUrl.isBlank() ? null : imageUrl.trim());
        }
    }
}
