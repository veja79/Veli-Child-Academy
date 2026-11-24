package za.co.velichildacademy.contact;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
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
public class ContactController {

    public record ContactRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email @Size(max = 150) String email,
            @Size(max = 30) String phone,
            @NotBlank @Size(max = 50) String subject,
            @NotBlank @Size(max = 2000) String message,
            @AssertTrue(message = "consent is required (POPIA)") boolean consent) {}

    public record MessageResponse(
            Long id, String name, String email, String phone, String subject,
            String message, boolean read, Instant createdAt) {

        static MessageResponse from(ContactMessage m) {
            return new MessageResponse(m.getId(), m.getName(), m.getEmail(), m.getPhone(),
                    m.getSubject(), m.getMessage(), m.isRead(), m.getCreatedAt());
        }
    }

    public record ReadRequest(boolean read) {}

    private final ContactMessageRepository repository;

    public ContactController(ContactMessageRepository repository) {
        this.repository = repository;
    }

    // ---- Public ----

    @PostMapping("/api/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public void submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage m = new ContactMessage();
        m.setName(request.name().trim());
        m.setEmail(request.email().trim());
        m.setPhone(request.phone() == null || request.phone().isBlank() ? null : request.phone().trim());
        m.setSubject(request.subject().trim());
        m.setMessage(request.message().trim());
        m.setConsent(true);
        repository.save(m);
    }

    // ---- Admin ----

    @GetMapping("/api/admin/messages")
    public List<MessageResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(MessageResponse::from).toList();
    }

    @GetMapping("/api/admin/messages/unread-count")
    public Map<String, Long> unreadCount() {
        return Map.of("unread", repository.countByReadFalse());
    }

    @PatchMapping("/api/admin/messages/{id}")
    @Transactional
    public MessageResponse markRead(@PathVariable Long id, @RequestBody ReadRequest request) {
        ContactMessage m = find(id);
        m.setRead(request.read());
        return MessageResponse.from(m);
    }

    @DeleteMapping("/api/admin/messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.delete(find(id));
    }

    private ContactMessage find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
