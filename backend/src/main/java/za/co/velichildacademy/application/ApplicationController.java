package za.co.velichildacademy.application;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ApplicationController {

    public record ApplicationRequest(
            @NotBlank @Size(max = 80) String childFirstName,
            @NotBlank @Size(max = 80) String childLastName,
            @NotNull @Past LocalDate childBirthDate,
            @NotBlank @Pattern(regexp = "Grade R|Grade 1|Grade 2|Grade 3", message = "choose Grade R, 1, 2 or 3") String grade,
            @Min(2026) @Max(2035) int startYear,
            @Size(max = 150) String previousSchool,
            @NotBlank @Size(max = 100) String parentName,
            @NotBlank @Size(max = 40) String relationship,
            @NotBlank @Size(max = 30) String phone,
            @Email @Size(max = 150) String email,
            @Size(max = 300) String address,
            @Size(max = 2000) String notes,
            @AssertTrue(message = "consent is required (POPIA)") boolean consent) {}

    public record ApplicationResponse(
            Long id, String childFirstName, String childLastName, LocalDate childBirthDate, String grade,
            int startYear, String previousSchool, String parentName, String relationship, String phone,
            String email, String address, String notes, ApplicationStatus status, Instant createdAt) {

        static ApplicationResponse from(Application a) {
            return new ApplicationResponse(a.getId(), a.getChildFirstName(), a.getChildLastName(),
                    a.getChildBirthDate(), a.getGrade(), a.getStartYear(), a.getPreviousSchool(),
                    a.getParentName(), a.getRelationship(), a.getPhone(), a.getEmail(), a.getAddress(),
                    a.getNotes(), a.getStatus(), a.getCreatedAt());
        }
    }

    public record StatusRequest(@NotNull ApplicationStatus status) {}

    private final ApplicationRepository repository;

    public ApplicationController(ApplicationRepository repository) {
        this.repository = repository;
    }

    // ---- Public ----

    @PostMapping("/api/applications")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> submit(@Valid @RequestBody ApplicationRequest r) {
        Application a = new Application();
        a.setChildFirstName(r.childFirstName().trim());
        a.setChildLastName(r.childLastName().trim());
        a.setChildBirthDate(r.childBirthDate());
        a.setGrade(r.grade());
        a.setStartYear(r.startYear());
        a.setPreviousSchool(blankToNull(r.previousSchool()));
        a.setParentName(r.parentName().trim());
        a.setRelationship(r.relationship().trim());
        a.setPhone(r.phone().trim());
        a.setEmail(blankToNull(r.email()));
        a.setAddress(blankToNull(r.address()));
        a.setNotes(blankToNull(r.notes()));
        a.setConsent(true);
        return Map.of("reference", repository.save(a).getId());
    }

    // ---- Admin ----

    @GetMapping("/api/admin/applications")
    public List<ApplicationResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(ApplicationResponse::from).toList();
    }

    @GetMapping("/api/admin/applications/new-count")
    public Map<String, Long> newCount() {
        return Map.of("new", repository.countByStatus(ApplicationStatus.NEW));
    }

    @PatchMapping("/api/admin/applications/{id}")
    @Transactional
    public ApplicationResponse setStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        Application a = find(id);
        a.setStatus(request.status());
        return ApplicationResponse.from(a);
    }

    @DeleteMapping("/api/admin/applications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(find(id));
    }

    private Application find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
