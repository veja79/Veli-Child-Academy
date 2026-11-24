package za.co.velichildacademy.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the first admin from ADMIN_USERNAME / ADMIN_PASSWORD when no admin exists yet. */
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
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) {
            return;
        }
        if (username.isBlank() || password.length() < 10) {
            log.warn("No admin account exists. Set ADMIN_USERNAME and ADMIN_PASSWORD (10+ characters) and restart.");
            return;
        }
        repository.save(new AdminUser(username.trim(), passwordEncoder.encode(password)));
        log.info("Created admin account '{}'. You can now remove ADMIN_PASSWORD from the environment.", username.trim());
    }
}
