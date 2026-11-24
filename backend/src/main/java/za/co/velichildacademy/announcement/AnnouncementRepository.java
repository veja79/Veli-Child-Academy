package za.co.velichildacademy.announcement;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    /** What the public site shows: published, not dated in the future, pinned first, newest first. */
    List<Announcement> findByPublishedTrueAndPublishedAtLessThanEqualOrderByPinnedDescPublishedAtDesc(LocalDate today);

    List<Announcement> findAllByOrderByPublishedAtDescIdDesc();
}
