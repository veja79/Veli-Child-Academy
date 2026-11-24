package za.co.velichildacademy;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import za.co.velichildacademy.auth.AdminSeeder;
import za.co.velichildacademy.auth.AdminUser;
import za.co.velichildacademy.auth.AdminUserRepository;

class AdminSeederTest {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Test
    void resetsPasswordOfExistingAdmin() {
        AdminUserRepository repo = mock(AdminUserRepository.class);
        AdminUser admin = new AdminUser("root", encoder.encode("old-password-123"));
        when(repo.findByUsernameIgnoreCase("root")).thenReturn(Optional.of(admin));

        new AdminSeeder(repo, encoder, "root", "new-password-456").run(null);

        verify(repo).save(admin);
        assertTrue(encoder.matches("new-password-456", admin.getPasswordHash()));
    }

    @Test
    void createsAdminWhenMissing() {
        AdminUserRepository repo = mock(AdminUserRepository.class);
        when(repo.findByUsernameIgnoreCase("principal")).thenReturn(Optional.empty());

        new AdminSeeder(repo, encoder, "principal", "a-strong-password").run(null);

        ArgumentCaptor<AdminUser> saved = ArgumentCaptor.forClass(AdminUser.class);
        verify(repo).save(saved.capture());
        assertTrue(encoder.matches("a-strong-password", saved.getValue().getPasswordHash()));
    }

    @Test
    void ignoresShortPassword() {
        AdminUserRepository repo = mock(AdminUserRepository.class);

        new AdminSeeder(repo, encoder, "root", "short").run(null);

        verify(repo, never()).save(any());
    }
}
