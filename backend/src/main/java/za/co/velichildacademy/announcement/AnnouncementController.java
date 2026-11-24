package za.co.velichildacademy.announcement;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import za.co.velichildacademy.announcement.AnnouncementDtos.AdminAnnouncement;
import za.co.velichildacademy.announcement.AnnouncementDtos.AnnouncementRequest;
import za.co.velichildacademy.announcement.AnnouncementDtos.PublicAnnouncement;

@RestController
public class AnnouncementController {

    private static final ZoneId SCHOOL_ZONE = ZoneId.of("Africa/Johannesburg");

    private final AnnouncementRepository repository;

    public AnnouncementController(AnnouncementRepository repository) {
        this.repository = repository;
    }

    // ---- Public ----

    @GetMapping("/api/announcements")
    public List<PublicAnnouncement> listPublic() {
        return repository
                .findByPublishedTrueAndPublishedAtLessThanEqualOrderByPinnedDescPublishedAtDesc(LocalDate.now(SCHOOL_ZONE))
                .stream().map(PublicAnnouncement::from).toList();
    }

    @GetMapping("/api/announcements/{id}")
    public PublicAnnouncement getPublic(@PathVariable Long id) {
        Announcement a = find(id);
        if (!a.isPublished() || a.getPublishedAt().isAfter(LocalDate.now(SCHOOL_ZONE))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return PublicAnnouncement.from(a);
    }

    // ---- Admin ----

    @GetMapping("/api/admin/announcements")
    public List<AdminAnnouncement> listAll() {
        return repository.findAllByOrderByPublishedAtDescIdDesc().stream().map(AdminAnnouncement::from).toList();
    }

    @GetMapping("/api/admin/announcements/{id}")
    public AdminAnnouncement get(@PathVariable Long id) {
        return AdminAnnouncement.from(find(id));
    }

    @PostMapping("/api/admin/announcements")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminAnnouncement create(@Valid @RequestBody AnnouncementRequest request) {
        Announcement a = new Announcement();
        request.applyTo(a);
        return AdminAnnouncement.from(repository.saveAndFlush(a));
    }

    @PutMapping("/api/admin/announcements/{id}")
    @Transactional
    public AdminAnnouncement update(@PathVariable Long id, @Valid @RequestBody AnnouncementRequest request) {
        Announcement a = find(id);
        request.applyTo(a);
        return AdminAnnouncement.from(repository.saveAndFlush(a));
    }

    @DeleteMapping("/api/admin/announcements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(find(id));
    }

    private Announcement find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
