package za.co.velichildacademy.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Keeps the staff login in step with ADMIN_USERNAME / ADMIN_PASSWORD.
 *
 * - If an admin with that username exists, its password is updated to ADMIN_PASSWORD
 *   (this is also how a forgotten password is reset).
 * - If not, the admin account is created.
 * - If the variables are not set, nothing changes.
 */
@Component
public class AdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminSeeder(AdminUserRepository repository, PasswordEncoder passwordEncoder,
                       @Value("${app.admin.username:}") String username,
                       @Value("${app.admin.password:}") String password) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.username = username == null ? "" : username.trim();
        this.password = password == null ? "" : password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (username.isBlank() && password.isEmpty()) {
            if (repository.count() == 0) {
                log.warn("No admin account exists. Set ADMIN_USERNAME and ADMIN_PASSWORD (10+ characters) and restart.");
            }
            return;
        }
        if (username.isBlank() || password.length() < 10) {
            log.warn("ADMIN_USERNAME must be set and ADMIN_PASSWORD must be at least 10 characters. Admin login not changed.");
            return;
        }

        repository.findByUsernameIgnoreCase(username).ifPresentOrElse(admin -> {
            if (!passwordEncoder.matches(password, admin.getPasswordHash())) {
                admin.setPasswordHash(passwordEncoder.encode(password));
                repository.save(admin);
                log.info("Updated the password for admin account '{}'.", admin.getUsername());
            } else {
                log.info("Admin account '{}' is ready.", admin.getUsername());
            }
        }, () -> {
            repository.save(new AdminUser(username, passwordEncoder.encode(password)));
            log.info("Created admin account '{}'.", username);
        });
    }
}
